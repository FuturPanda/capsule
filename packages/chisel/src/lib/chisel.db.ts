import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import pino from "pino";
import { ColInfoType } from "./_utils/types/database.type";
import { Migration } from "./_utils/types/migrations.type";
import { IFactoryOpts } from "./_utils/types/queries.type";
import { ChiselQuerable } from "./chisel.querable";
import { generateSQLCommands } from "./migrations";

export class ChiselDb extends ChiselQuerable {
  private readonly logger = pino();
  private readonly dirPath: string;

  constructor(
    dbFilePath: string,
    private opts?: IFactoryOpts,
  ) {
    super(new Database(dbFilePath));

    if (opts) {
      this.dirPath = opts.uri;
    }
  }

  /**
   * Main static entrypoint
   * @param opts
   */
  static create(opts: IFactoryOpts): ChiselDb {
    try {
      const filepath = path.join(
        opts.uri,
        `${opts.dbName.toLowerCase()}.capsule`,
      );
      const exists = fs.existsSync(filepath);
      if (!exists) fs.mkdirSync(opts.uri, { recursive: true });
      const db = new ChiselDb(filepath, opts);
      if (opts.migrations) {
        console.log(
          "Initializing database from migrations.BVIUFYGIUEfhUIEHF..",
        );
        return db.initializeFromMigrations();
      } else return db;
    } catch (e: any) {
      throw new Error(`Failed to get database connection: ${e.message}`);
    }
  }

  static getConnectionFromPath(path: string) {
    try {
      return new ChiselDb(path);
    } catch (error: any) {
      throw new Error(`Failed to get database connection: ${error.message}`);
    }
  }

  initializeFromMigrations() {
    if (!this.opts?.migrations) {
      throw new Error("No migrations provided");
    }
    for (const migration of this.opts.migrations) {
      const hasChangelog = this.checkChangelogTable();
      if (!hasChangelog) {
        this.createChangelogTable();
      }
      const wasExecuted = this.checkMigrationExecuted(migration);

      if (!wasExecuted) {
        this.executeMigration(migration);
      }
    }
    return this;
  }

  applyMigrations(migrations: Migration[]) {
    let appliedMigrations = 0;
    for (const migration of migrations) {
      const hasChangelog = this.checkChangelogTable();
      if (!hasChangelog) {
        this.createChangelogTable();
      }
      const wasExecuted = this.checkMigrationExecuted(migration);
      if (!wasExecuted) {
        appliedMigrations++;
        this.executeMigration(migration);
      }
    }
    return appliedMigrations;
  }

  getTables = (): string[] =>
    this.db
      .prepare(
        `
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
              AND name NOT LIKE 'sqlite_%'
        `,
      )
      .all()
      .map((t: { name: string; [key: string]: string }) => t.name);

  getTableInfo = (tableName: string): ColInfoType[] =>
    this.db
      .prepare("SELECT * FROM pragma_table_info(?)")
      .all(tableName)
      .map((col: any) => ({
        name: col.name,
        type: col.type,
        notNull: col.notnull === 1,
        primaryKey: col.pk === 1,
      }));

  getDbDefinition = () => {
    const tables = this.getTables();
    return tables.map((t) => ({
      tableName: t,
      columns: this.getTableInfo(t),
    }));
  };

  private checkChangelogTable(): boolean {
    const result = this.db
      .prepare(
        `
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
              AND name = 'DATABASE_CHANGELOG'
        `,
      )
      .get();

    return !!result;
  }

  private createChangelogTable() {
    this.db.exec(`
        CREATE TABLE DATABASE_CHANGELOG
        (
            ID           TEXT     NOT NULL,
            AUTHOR       TEXT     NOT NULL,
            FILENAME     TEXT,
            DATEEXECUTED datetime NOT NULL,
            SHA256SUM    TEXT,
            PRIMARY KEY (ID, AUTHOR)
        )
    `);
  }

  private checkMigrationExecuted(migration: Migration): boolean {
    const result = this.db
      .prepare(
        `
            SELECT ID
            FROM DATABASE_CHANGELOG
            WHERE ID = ?
        `,
      )
      .get(migration.changeSetId);

    return !!result;
  }

  private executeMigration(migration: Migration, filename: string = "opde") {
    for (const operation of migration.operations) {
      const commands = generateSQLCommands(operation);

      this.db.transaction(() => {
        for (const command of commands.flat()) {
          this.db.exec(command);
        }
      })();
    }

    const hashedContent = crypto
      .createHash("sha256")
      .update(migration.operations.join(""))
      .digest("hex");

    this.db
      .prepare(
        `
            INSERT INTO DATABASE_CHANGELOG
                (ID, AUTHOR, FILENAME, DATEEXECUTED, SHA256SUM)
            VALUES (?, ?, ?, datetime('now'), ?)
        `,
      )
      .run(migration.changeSetId, migration.author, filename, hashedContent);
  }
}
