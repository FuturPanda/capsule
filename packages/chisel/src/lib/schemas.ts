import {
  adjectives,
  names,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { v4 as uuidv4 } from "uuid";
import { JournalType } from "./_utils/types/journal.type";
import {
  ChiselSchema,
  ColumnOptions,
  TableOptions,
} from "./_utils/types/schema.type";
import { SnapShotTableType, SnapshotType } from "./_utils/types/snapshot.type";

const NAMES_DICTIONARY: string[] = names.map((name) => name.toLowerCase());
const UUID_ZERO = uuidv4().replace(/[0-9a-fA-F]/g, "0");

export function generateUniqueFilename(versionNumber?: number): string {
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, adjectives, NAMES_DICTIONARY, NAMES_DICTIONARY],
    separator: "_",
  });

  return `${versionNumber ? versionNumber : "0000"}_${randomName}`;
}

const escapeIdentifier = (identifier: string): string => {
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

export const createDatabaseSchema = (dbName: string) => {
  const schema: ChiselSchema = { dbName, entities: [] };

  const addEntity = (
    name: string,
    columns: { [key: string]: ColumnOptions },
  ) => {
    schema.entities.push({ name, columns });
    return { addEntity, addEntities, build };
  };

  const addEntities = (
    entities: { name: string; columns: { [key: string]: ColumnOptions } }[],
  ) => {
    entities.forEach((entity) => schema.entities.push(entity));
    return { addEntity, addEntities, build };
  };

  const build = () => {
    return schema;
  };

  return { addEntity, addEntities, build };
};

const buildColumnDefinition = (
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

const generateCreateTableSQL = (entity: TableOptions): string => {
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
        `CREATE INDEX ${escapeIdentifier(indexName)} ON ${escapeIdentifier(entity.name)} ( ${escapeIdentifier(
          field,
        )} );`,
      ),
    );
  if (entity.compositePrimaryKeys)
    columnsSQL.push(
      `PRIMARY KEY ( ${entity.compositePrimaryKeys.map((it) => ` ${escapeIdentifier(it)}`).join(",")} )`,
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

  return `CREATE TABLE IF NOT EXISTS ${escapeIdentifier(entity.name)} (\n\t${columnsSQL.join(",\n\t")}\n);\n`;
};

export const generateDatabaseSQL = (schema: ChiselSchema): string[] => {
  return schema.entities.map(generateCreateTableSQL);
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
  schema: ChiselSchema,
  prevId?: string,
): SnapshotType => ({
  version: "1",
  name: schema.dbName,
  id: uuidv4(),
  prevId: prevId ? prevId : UUID_ZERO,
  tables: schema.entities
    .map(
      (entity): Record<string, SnapShotTableType> => ({
        [entity.name]: {
          columns: Object.entries(entity.columns)
            .map(([name, opts]) => ({
              [name]: {
                type: opts.type,
                primaryKey: opts.primaryKey,
                notNull: opts.notNull,
                autoIncrement: opts.autoIncrement,
              },
            }))
            .reduce((acc, obj) => ({ ...acc, ...obj }), {}),
          indexes: entity.indexes,
          foreignKeys: entity.foreignKeys,
          compositePrimaryKeys: entity.compositePrimaryKeys,
          uniqueConstraints: entity.uniqueConstraints,
        },
      }),
    )
    .reduce((acc, obj) => ({ ...acc, ...obj }), {}),
});
