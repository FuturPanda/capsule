import Database from "better-sqlite3";
import * as fs from "node:fs";
import * as path from "node:path";
import pino from "pino";
import { IChiselDbParams, IFactoryOpts } from "./_utils/types/queries.type";
import { ChiselQuerable } from "./chisel.querable";
import {
  generateDatabaseSQL,
  generateJournal,
  generateSnapshot,
  generateUniqueFilename,
} from "./schemas";
import { compareSchemas, handleSchemaChanges } from "./migrations";
import { generateTypesSync } from "./type-generation";
import { SnapshotType } from "./_utils/types/snapshot.type";

export class ChiselDb extends ChiselQuerable {
  private readonly logger = pino();
  private filePath: string = "";
  private dbName: string = "";

  constructor(dbFilePath: string, params?: IChiselDbParams) {
    super(new Database(dbFilePath));
    if (params?.filePath) this.filePath = params.filePath;
  }

  static SchemaFactory(opts: IFactoryOpts): any {
    const logger = pino();
    logger.info("inside schema factory");
    const dirPath = path.join(opts.uri, opts.dbName.toLowerCase());
    const filepath = path.join(dirPath, `${opts.dbName.toLowerCase()}.capsule`);
    const exists = fs.existsSync(filepath);
    let migrationsPath: string = path.join(dirPath, "migrations");
    let journalFilePath: string = path.join(dirPath, `_journal.json`);
    let metaDirectoryPath: string = path.join(migrationsPath, "_meta");
    let snapshotPath: string = path.join(
      metaDirectoryPath,
      "_snapshot_0000.json",
    );
    let schemaFilePath: string = "";

    const generateMetas = (isHandlingChange: boolean = false) => {
      pino().info(`generate metas : ${opts.entities}`);
      const sqlScripts = generateDatabaseSQL(opts.entities);

      const fileName = generateUniqueFilename();
      const journal = generateJournal(fileName);
      const snapshot = generateSnapshot(opts.dbName, opts.entities);

      schemaFilePath = path.join(migrationsPath, `${fileName}.sql`);
      return {
        sqlScripts,
        snapshot,
        journal,
      };
    };

    const fromSchemaSync = () => {
      if (exists) {
        logger.info(
          `Cannot create Database, db already exists at ${filepath}, using ${opts.dbName}, journalPath : ${journalFilePath}, snapshotPath : ${snapshotPath}, dirPath :${dirPath}`,
        );
        if (fs.existsSync(snapshotPath)) {
          const snapshot = JSON.parse(
            fs.readFileSync(snapshotPath, "utf8"),
          ) as SnapshotType;
          logger.info(`Snapshot : ${snapshot.entities}`);
          const diff = compareSchemas(
            {
              dbName: snapshot.name,
              version: snapshot.version,
              entities: snapshot.entities,
            },
            {
              dbName: opts.dbName,
              version: snapshot.version + 1,
              entities: opts.entities,
            },
          );
          logger.error(`Diff : ${JSON.stringify(diff)}`);
          const res = handleSchemaChanges(
            diff,
            {
              dbName: opts.dbName,
              version: snapshot.version + 1,
              entities: opts.entities,
            },
            {
              journalPath: journalFilePath,
              snapshotPath: snapshotPath,
              dirPath: dirPath,
            },
          );
          if (!res) return new ChiselDb(filepath);
          else {
            const db = new ChiselDb(filepath);
            db.runSqlCommands(res.sqlCommands);
          }
        }
      }
      return writeChiselFiles();
    };

    const writeChiselFiles = () => {
      const logger = pino();
      logger.info(
        `Database doesn't exists at ${filepath}, creating ${opts.dbName}`,
      );
      fs.mkdirSync(dirPath, { recursive: true });
      const db = new Database(filepath);

      const { sqlScripts, snapshot, journal } = generateMetas();
      db.exec(sqlScripts.join("\n"));

      fs.mkdirSync(metaDirectoryPath, { recursive: true });
      fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2), {
        encoding: "utf-8",
      });
      fs.writeFileSync(journalFilePath, JSON.stringify(journal, null, 2), {
        encoding: "utf-8",
      });
      fs.writeFileSync(schemaFilePath, sqlScripts.join("\n"), {
        encoding: "utf-8",
      });
      if (opts.generateTypes) {
        logger.info(`Generating types... in ${opts.typesDir}`);
        const data = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
        generateTypesSync(data, { dir: opts.typesDir });
        if (!db) throw new Error("Error during database creation ");
      }

      logger.info(
        `Connection with SQLite Dabatase "${filepath}" has been established`,
      );
      return new ChiselDb(filepath);
    };
    return { fromSchemaSync };
  }

  static provideConnection(opts: IFactoryOpts): ChiselDb {
    try {
      return ChiselDb.SchemaFactory(opts).fromSchemaSync();
    } catch (error: any) {
      console.error("Error occurred while providing connection:", error);
      throw new Error(
        `Failed to provide database connection: ${error.message}`,
      );
    }
  }
}
