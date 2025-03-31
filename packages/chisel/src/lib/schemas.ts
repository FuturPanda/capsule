import {
  ColumnOptions,
  JournalType,
  SnapshotType,
  TableOptions,
} from "@capsulesh/shared-types";
import {
  adjectives,
  names,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { v4 as uuidv4 } from "uuid";

const NAMES_DICTIONARY: string[] = names.map((name) => name.toLowerCase());
const UUID_ZERO = uuidv4().replace(/[0-9a-fA-F]/g, "0");

export function generateUniqueFilename(versionNumber?: number): string {
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, adjectives, NAMES_DICTIONARY, NAMES_DICTIONARY],
    separator: "_",
  });
  const number = versionNumber
    ? Math.round(versionNumber * 1000)
        .toString()
        .padStart(4, "0")
    : "0000";

  return `${number}_${randomName}`;
}

export const escapeIdentifier = (identifier: string): string => {
  return `\`${identifier.replace(/`/g, "``")}\``;
};

const isValidColumnType = (type: string): boolean => {
  const validTypes = ["INTEGER", "TEXT", "BLOB", "REAL", "NUMERIC", "NULL"];
  return validTypes.includes(type.toUpperCase());
};

const safeDefaultValues = (value: string | number): string => {
  if (typeof value === "string") {
    return `'${value.replace(/'/g, "''")}'`;
  }
  return value.toString();
};

export const buildColumnDefinition = (
  columnName: string,
  options: ColumnOptions,
): string => {
  if (!isValidColumnType(options.type)) {
    throw new Error(`Invalid column type: ${options.type}`);
  }
  let definition = `${escapeIdentifier(columnName)} ${options.type.toUpperCase()}`;

  console.log(`in build column definition : ${columnName}`);

  if (options.primaryKey) definition += " PRIMARY KEY";
  if (options.autoIncrement) definition += " AUTOINCREMENT";
  if (options.notNull) definition += " NOT NULL";
  if (options.unique) definition += " UNIQUE";
  if (options.defaultValue !== undefined) {
    definition += ` DEFAULT '${safeDefaultValues(options.defaultValue)}'`;
  }

  if (options.enum) {
    if (options.type !== "text") throw new Error();
    definition += `,\n\tCHECK (${columnName} IN (${Object.values(options.enum).map((value) => `\'${value}\'`)}))`;
  }
  console.log(definition);
  return definition;
};

export const generateCreateTableSQL = (entity: TableOptions): string => {
  if (
    !entity.compositePrimaryKeys &&
    Object.values(entity.columns).every((it) => !it.primaryKey)
  )
    throw new Error(`${entity.name} require a primary key`);

  const columnsSQL = Object.entries(entity.columns).map(
    ([columnName, options]) => buildColumnDefinition(columnName, options),
  );

  if (entity.indexes)
    Object.entries(entity.indexes).forEach(([field, indexName]) =>
      columnsSQL.push(
        `CREATE INDEX ${escapeIdentifier(indexName)} ON ${escapeIdentifier(entity.name)} (${escapeIdentifier(
          field,
        )});`,
      ),
    );
  if (entity.compositePrimaryKeys)
    columnsSQL.push(
      `PRIMARY KEY (${entity.compositePrimaryKeys.map((it) => ` ${escapeIdentifier(it)}`).join(",")} )`,
    );
  if (entity.uniqueConstraints)
    columnsSQL.push(
      `UNIQUE ( ${entity.compositePrimaryKeys.map((key) => escapeIdentifier(key)).join(",")} )`,
    );
  if (entity.foreignKeys)
    Object.entries(entity.foreignKeys).forEach(
      ([field, { foreignTable, foreignKey }]) =>
        columnsSQL.push(
          `\nFOREIGN KEY ( ${escapeIdentifier(field)} ) REFERENCES ${escapeIdentifier(foreignTable)}( ${escapeIdentifier(
            foreignKey,
          )} )`,
        ),
    );

  return `CREATE TABLE IF NOT EXISTS ${escapeIdentifier(entity.name)}
            (
                ${columnsSQL.join(",\n\t")}
            );  `;
};

export const generateDatabaseSQL = (
  entities: TableOptions[] = [],
): string[] => {
  return entities.map(generateCreateTableSQL);
};

export const generateJournal = (scriptName: string): JournalType => ({
  version: 0.1,
  entries: [
    {
      idx: 0,
      version: 0.1,
      when: Date.now(),
      tag: scriptName,
    },
  ],
});

export const generateSnapshot = (
  dbName: string,
  entities: TableOptions[],
  version?: string,
  prevId?: string,
): SnapshotType => ({
  version: version ?? "0000",
  name: dbName,
  id: uuidv4(),
  prevId: prevId ? prevId : UUID_ZERO,
  entities: entities,
});
