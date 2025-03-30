import { Column, MigrationOperation } from "@capsulesh/shared-types";

export const generateSqlFromCommandArray = (operations: MigrationOperation[]) =>
  operations.map((op) => generateSQLCommands(op));

export function generateSQLCommands(operation: MigrationOperation): string[] {
  let commands: string[];

  switch (operation.type) {
    case "createTable":
      commands = generateCreateTableSQL(operation);
      break;
    case "addForeignKey":
      commands = generateAddForeignKeySQL(operation);
      break;
    default:
      throw new Error(`Unsupported operation type: ${operation.type}`);
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

function escapeIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

export const generateCreateTableSQL = (
  operation: MigrationOperation,
): string[] => {
  const hasPrimaryKeyColumns = Object.values(operation.columns).some(
    (it) => it.constraints?.primaryKey,
  );
  const hasCompositePrimaryKey = operation.primaryKey?.length > 0;

  if (!hasPrimaryKeyColumns && !hasCompositePrimaryKey) {
    throw new Error(`${operation.tableName} requires a primary key`);
  }

  if (hasPrimaryKeyColumns && hasCompositePrimaryKey) {
    throw new Error(
      `${operation.tableName} should have only one primary key declaration (either column-level or table-level)`,
    );
  }

  const columnsSQL = operation.columns.map((col) => buildColumnDefinition(col));

  if (hasCompositePrimaryKey) {
    columnsSQL.push(
      `PRIMARY KEY (${operation.primaryKey.map((name) => escapeIdentifier(name)).join(", ")})`,
    );
  }

  if (operation.foreignKeys) {
    operation.foreignKeys.forEach((fk) => {
      columnsSQL.push(
        `FOREIGN KEY (${escapeIdentifier(fk.baseColumnName)}) ` +
          `REFERENCES ${escapeIdentifier(fk.referencedTableName)} ` +
          `(${escapeIdentifier(fk.referencedColumnName)})`,
      );
    });
  }

  if (operation.uniqueConstraints?.length > 0) {
    columnsSQL.push(
      `UNIQUE (${operation.uniqueConstraints.map(escapeIdentifier).join(", ")})`,
    );
  }

  const output = [
    `CREATE TABLE IF NOT EXISTS ${escapeIdentifier(operation.tableName)} (
      ${columnsSQL.join(",\n      ")}
    );`,
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

function generateAddForeignKeySQL(operation: MigrationOperation): string[] {
  if (!operation.table || !operation.columns || !operation.references) {
    throw new Error("Missing required properties for addForeignKey operation");
  }

  const { table, columns, references } = operation;
  const { table: refTable, columns: refColumns } = references;

  return [
    `ALTER TABLE ${escapeIdentifier(table)} ADD CONSTRAINT fk_${table}_${refTable} ` +
      `FOREIGN KEY (${columns.map((it) => escapeIdentifier(it.name)).join(", ")}) ` +
      `REFERENCES ${escapeIdentifier(refTable)} (${refColumns.map(escapeIdentifier).join(", ")});`,
  ];
}
