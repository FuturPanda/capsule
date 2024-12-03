import {ChiselSchema} from "./_utils/types/schema.type";
import * as fs from "node:fs";
import {JournalType} from "./_utils/types/journal.type";
import {
  buildColumnDefinition,
  escapeIdentifier,
  generateCreateTableSQL,
  generateSnapshot,
  generateUniqueFilename,
} from "./schemas";
import {SnapshotType} from "./_utils/types/snapshot.type";
import path from "node:path";
import pino from "pino";
import {getCurrentVersion} from "./_utils/functions/get-current-version.function";
import {MigrationFiles, SchemaDiff,} from "./_utils/interfaces/schema-diff.interface";

/**
 * Produce a Delta between two ChiselSchemas
 * @param oldSchema the previous schema. May be found in the previous snapshot
 * @param newSchema the new schema.
 * To date, there's no way to know if a table have been renamed. It will create a new table and drop the old one.
 * Warning ! data could be lost.
 * TODO : add similarity score to trigger updates.
 */

export function compareSchemas(
  oldSchema: ChiselSchema,
  newSchema: ChiselSchema,
): SchemaDiff {
  const diff: SchemaDiff = {
    added: {
      tables: [],
      columns: {},
      foreignKeys: {},
    },
    modified: {
      columns: {},
      foreignKeys: {},
    },
    removed: {
      tables: [],
      columns: {},
      foreignKeys: {},
    },
  };

  const oldTables = new Map(oldSchema.entities.map((e) => [e.name, e]));
  const newTables = new Map(newSchema.entities.map((e) => [e.name, e]));

  for (const [tableName, entity] of newTables) {
    if (!oldTables.has(tableName)) {
      diff.added.tables.push(tableName);
    }
  }

  for (const [tableName, entity] of oldTables) {
    if (!newTables.has(tableName)) {
      diff.removed.tables.push(tableName);
    }
  }

  for (const [tableName, newEntity] of newTables) {
    const oldEntity = oldTables.get(tableName);
    if (!oldEntity) continue; // Skip added tables

    const oldColumns = oldEntity.columns;
    const newColumns = newEntity.columns;

    for (const [columnName, columnDef] of Object.entries(newColumns)) {
      if (!oldColumns[columnName]) {
        if (!diff.added.columns[tableName]) {
          diff.added.columns[tableName] = [];
        }
        diff.added.columns[tableName].push(columnName);
      }
    }

    for (const [columnName, columnDef] of Object.entries(oldColumns)) {
      if (!newColumns[columnName]) {
        if (!diff.removed.columns[tableName]) {
          diff.removed.columns[tableName] = [];
        }
        diff.removed.columns[tableName].push(columnName);
      }
    }

    for (const [columnName, newColumnDef] of Object.entries(newColumns)) {
      const oldColumnDef = oldColumns[columnName];
      if (!oldColumnDef) continue; // Skip added columns

      const columnChanges: Array<{
        field: string;
        oldValue: any;
        newValue: any;
      }> = [];

      for (const field of [
        "type",
        "notNull",
        "primaryKey",
        "autoIncrement",
        "unique",
        "enum",
        "mode",
      ] as const) {
        if (
          JSON.stringify(oldColumnDef[field]) !==
          JSON.stringify(newColumnDef[field])
        ) {
          columnChanges.push({
            field,
            oldValue: oldColumnDef[field],
            newValue: newColumnDef[field],
          });
        }
      }

      if (columnChanges.length > 0) {
        if (!diff.modified.columns[tableName]) {
          diff.modified.columns[tableName] = [];
        }
        diff.modified.columns[tableName].push({
          column: columnName,
          changes: columnChanges,
        });
      }
    }

    const oldForeignKeys = oldEntity.foreignKeys || {};
    const newForeignKeys = newEntity.foreignKeys || {};

    for (const [fkName, fkDef] of Object.entries(newForeignKeys)) {
      if (!oldForeignKeys[fkName]) {
        if (!diff.added.foreignKeys[tableName]) {
          diff.added.foreignKeys[tableName] = [];
        }
        diff.added.foreignKeys[tableName].push(fkName);
      }
    }

    for (const [fkName, fkDef] of Object.entries(oldForeignKeys)) {
      if (!newForeignKeys[fkName]) {
        if (!diff.removed.foreignKeys[tableName]) {
          diff.removed.foreignKeys[tableName] = [];
        }
        diff.removed.foreignKeys[tableName].push(fkName);
      }
    }

    for (const [fkName, newFkDef] of Object.entries(newForeignKeys)) {
      const oldFkDef = oldForeignKeys[fkName];
      if (!oldFkDef) continue; // Skip added foreign keys

      const fkChanges: Array<{
        field: string;
        oldValue: any;
        newValue: any;
      }> = [];

      if (oldFkDef.foreignTable !== newFkDef.foreignTable) {
        fkChanges.push({
          field: "foreignTable",
          oldValue: oldFkDef.foreignTable,
          newValue: newFkDef.foreignTable,
        });
      }

      if (oldFkDef.foreignKey !== newFkDef.foreignKey) {
        fkChanges.push({
          field: "foreignKey",
          oldValue: oldFkDef.foreignKey,
          newValue: newFkDef.foreignKey,
        });
      }

      if (fkChanges.length > 0) {
        if (!diff.modified.foreignKeys[tableName]) {
          diff.modified.foreignKeys[tableName] = [];
        }
        diff.modified.foreignKeys[tableName].push({
          key: fkName,
          changes: fkChanges,
        });
      }
    }
  }
  return diff;
}

export function handleSchemaChanges(
  diff: SchemaDiff,
  newSchema: ChiselSchema,
  files: MigrationFiles,
) {
  if (
    diff.added.tables.length === 0 &&
    Object.keys(diff.added.columns).length === 0 &&
    Object.keys(diff.modified.columns).length === 0 &&
    Object.keys(diff.removed.columns).length === 0 &&
    diff.removed.tables.length === 0
  ) {
    pino().info("No changes, return");
    return;
  }
  const currentVersion = getCurrentVersion(files.journalPath);
  const nextVersion = currentVersion + 0.1;
  const migrationName = generateUniqueFilename(nextVersion);

  const sqlCommands = generateSQLCommands(diff, newSchema);

  const prevSnapshot = JSON.parse(
    fs.readFileSync(files.snapshotPath, "utf8"),
  ) as SnapshotType;

  const newSnapshot = generateSnapshot(
    newSchema.dbName,
    newSchema.entities,
    nextVersion.toString(),
    prevSnapshot.id,
  );

  const journal = JSON.parse(
    fs.readFileSync(files.journalPath, "utf8"),
  ) as JournalType;

  journal.entries.push({
    idx: journal.entries.length,
    version: nextVersion,
    when: Date.now(),
    tag: migrationName,
  });

  fs.writeFileSync(
    path.join(files.dirPath, "migrations", `${migrationName}.sql`),
    sqlCommands.join(";\n"),
    "utf8",
  );
  fs.writeFileSync(files.journalPath, JSON.stringify(journal, null, 2), "utf8");
  fs.writeFileSync(
    path.join(
      files.dirPath,
      "migrations",
      "_meta",
      `_snapshot_${String(nextVersion).padStart(4, "0")}.json`,
    ),
    JSON.stringify(newSnapshot, null, 2),
    "utf8",
  );

  return {
    migrationName,
    sqlCommands,
    newSnapshot,
    journal,
  };
}

function generateSQLCommands(
  diff: SchemaDiff,
  newSchema: ChiselSchema,
): string[] {
  const commands: string[] = [];

  diff.added.tables.forEach((tableName) => {
    const entity = newSchema.entities.find((e) => e.name === tableName);
    if (entity) {
      commands.push(generateCreateTableSQL(entity));
    }
  });

  Object.entries(diff.modified.columns).forEach(
    ([tableName, modifications]) => {
      modifications.forEach((mod) => {
        const entity = newSchema.entities.find((e) => e.name === tableName);
        if (entity) {
          if (mod.changes.length === 1 && mod.changes[0].field === "name") {
            commands.push(
              `ALTER TABLE ${escapeIdentifier(tableName)}
                                RENAME COLUMN ${escapeIdentifier(mod.column)}
                                TO ${escapeIdentifier(mod.changes[0].newValue)};`,
            );
          } else {
            const tempColumnName = `${mod.column}_new`;

            const columnDef = buildColumnDefinition(
              tempColumnName,
              entity.columns[mod.column],
            );
            commands.push(
              `ALTER TABLE ${escapeIdentifier(tableName)}
                                ADD COLUMN ${columnDef};`,
            );

            const typeChange = mod.changes.find((c) => c.field === "type");
            const copyValue = typeChange
              ? `CAST(${escapeIdentifier(mod.column)} AS ${typeChange.newValue})`
              : escapeIdentifier(mod.column);

            commands.push(
              `UPDATE ${escapeIdentifier(tableName)}
                             SET ${escapeIdentifier(tempColumnName)} = ${copyValue};`,
            );

            commands.push(
              `ALTER TABLE ${escapeIdentifier(tableName)}
                            DROP
                            COLUMN
                            ${escapeIdentifier(mod.column)};`,
            );

            commands.push(
              `ALTER TABLE ${escapeIdentifier(tableName)}
                                RENAME COLUMN ${escapeIdentifier(tempColumnName)}
                                TO ${escapeIdentifier(mod.column)};`,
            );
          }
        }
      });
    },
  );

  Object.entries(diff.added.columns).forEach(([tableName, columns]) => {
    columns.forEach((columnName) => {
      const entity = newSchema.entities.find((e) => e.name === tableName);
      if (entity && entity.columns[columnName]) {
        const columnDef = buildColumnDefinition(
          columnName,
          entity.columns[columnName],
        );
        commands.push(`ALTER TABLE ${escapeIdentifier(tableName)}
                    ADD COLUMN ${columnDef};`);
      }
    });
  });

  Object.entries(diff.added.foreignKeys).forEach(([tableName, foreignKeys]) => {
    const entity = newSchema.entities.find((e) => e.name === tableName);
    if (entity) {
      const tempTableName = `${tableName}_temp`;
      const newTableSQL = generateCreateTableSQL({
        ...entity,
        name: tempTableName,
      });

      commands.push(newTableSQL);
      commands.push(`INSERT INTO ${escapeIdentifier(tempTableName)}
                           SELECT *
                           FROM ${escapeIdentifier(tableName)};`);
      commands.push(`DROP TABLE ${escapeIdentifier(tableName)};`);
      commands.push(
        `ALTER TABLE ${escapeIdentifier(tempTableName)} RENAME TO ${escapeIdentifier(tableName)};`,
      );
    }
  });

  return commands;
}
