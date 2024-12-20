import { Column, MigrationOperation } from "./_utils/types/migrations.type";

export const generateSqlFromCommandArray = (operations: MigrationOperation[]) =>
  operations.map((op) => generateSQLCommands(op));

export function generateSQLCommands(operation: MigrationOperation): string[] {
  let commands: string[];

  switch (operation.type) {
    case "createTable":
      commands = generateCreateTableSQL(operation);
  }

  return commands;
}

function buildColumnDefinition(column: Column): string {
  const parts: string[] = [
    escapeIdentifier(column.name),
    column.type.toUpperCase(),
  ];

  if (column.defaultValue) {
    if (typeof column.defaultValue === "string") {
      parts.push(`DEFAULT ${column.defaultValue}`);
    } else if (
      typeof column.defaultValue === "object" &&
      "sql" in column.defaultValue
    ) {
      parts.push(`DEFAULT ${column.defaultValue.sql}`);
    }
  }

  if (column.constraints) {
    if (column.constraints.primaryKey) {
      parts.push("PRIMARY KEY");

      if (column.autoIncrement) {
        parts.push("AUTOINCREMENT");
      }
    }
    if (column.constraints.nullable === false) {
      parts.push("NOT NULL");
    }
    if (column.constraints.unique) {
      parts.push("UNIQUE");
    }
  }

  if (column.enumValues && column.enumValues.length > 0) {
    const enumValues = column.enumValues.map((v) => `'${v}'`).join(", ");
    parts.push(`CHECK (${column.name} IN (${enumValues}))`);
  }

  return parts.join(" ");
}

export const generateCreateTableSQL = (
  operation: MigrationOperation,
): string[] => {
  if (
    operation.primaryKey?.columnNames?.length <= 0 &&
    Object.values(operation.columns).every((it) => !it.constraints?.primaryKey)
  )
    throw new Error(`${operation.tableName} require a primary key`);
  if (
    operation.primaryKey &&
    Object.values(operation.columns).some((it) => it.constraints?.primaryKey)
  )
    throw new Error(
      `${operation.tableName} should only have a one primary key declaration`,
    );

  const columnsSQL = operation.columns.map((col) => buildColumnDefinition(col));

  /*if (operation.indexes)
    operation.indexes.forEach((indexName) =>
      columnsSQL.push(
        `CREATE INDEX ${escapeIdentifier(indexName)} ON ${escapeIdentifier(operation.)} (${escapeIdentifier(
          field,
        )});`,
      ),
    );*/
  if (operation.primaryKey)
    columnsSQL.push(
      `PRIMARY KEY (${operation.primaryKey?.columnNames?.map((it) => ` ${escapeIdentifier(it)}`).join(",")} )`,
    );

  if (operation.foreignKeys) {
    operation.foreignKeys.forEach((fk) => {
      columnsSQL.push(
        `FOREIGN KEY (${escapeIdentifier(fk.baseColumnName)}) ` +
          `REFERENCES ${escapeIdentifier(fk.referencedTableName)}` +
          `(${escapeIdentifier(fk.referencedColumnName)})`,
      );
    });
  }

  if (operation.uniqueConstraints?.length > 0) {
    columnsSQL.push(`UNIQUE (${operation.uniqueConstraints.join(", ")})`);
  }

  const output = [
    `CREATE TABLE IF NOT EXISTS ${escapeIdentifier(operation.tableName)}
     (
         ${columnsSQL.join(",\n\t")}
     );  `,
  ];

  operation.columns.forEach((column) => {
    if (column.constraints?.unique) {
      output.push(
        `CREATE UNIQUE INDEX idx_${operation.tableName}_${column.name} ` +
          `ON ${escapeIdentifier(operation.tableName)} (${escapeIdentifier(column.name)});`,
      );
    }
  });
  return output;
};

function escapeIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}
