import Database from "better-sqlite3";
import * as fs from "node:fs";
import * as path from "node:path";
import pino from "pino";
import { generateTypes, generateTypesSync } from "./_utils/flint";
import { IChiselDbParams, IFactoryOpts } from "./_utils/types/queries.type";
import { ChiselQuerable } from "./chisel.querable";
import {
  createDatabaseSchema,
  generateDatabaseSQL,
  generateJournal,
  generateSnapshot,
  generateUniqueFilename,
} from "./schemas";

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
    const dirPath = path.join(opts.uri, opts.dbName.toLowerCase());
    const filepath = path.join(dirPath, `${opts.dbName.toLowerCase()}.capsule`);
    const exists = fs.existsSync(filepath);

    const generateMetas = () => {
      const sqlSchema = createDatabaseSchema(opts.schema.dbName)
        .addEntities(opts.schema.entities)
        .build();
      const sqlScripts = generateDatabaseSQL(sqlSchema);

      const fileName = generateUniqueFilename();
      const journal = generateJournal(fileName);
      const snapshot = generateSnapshot(opts.schema);

      const migrationsPath = path.join(dirPath, "migrations");
      const journalFilePath = path.join(dirPath, `_journal.json`);
      const metaDirectoryPath = path.join(migrationsPath, "_meta");
      const schemaFilePath = path.join(migrationsPath, `${fileName}.sql`);
      const snapshotPath = path.join(metaDirectoryPath, "_snapshot_0000.json");
      return {
        sqlScripts,
        metaDirectoryPath,
        snapshotPath,
        snapshot,
        journal,
        journalFilePath,
        schemaFilePath,
      };
    };

    const fromSchemaSync = () => {
      if (fs.existsSync(filepath)) {
        logger.info(
          `Cannot create Database, db already exists at ${filepath}, using ${opts.dbName}`,
        );
        return new ChiselDb(filepath);
      }
      logger.info(
        `Database doesn't exists at ${filepath}, creating ${opts.dbName}`,
      );
      fs.mkdirSync(dirPath, { recursive: true });
      const db = new Database(filepath);

      const {
        sqlScripts,
        metaDirectoryPath,
        snapshotPath,
        snapshot,
        journal,
        journalFilePath,
        schemaFilePath,
      } = generateMetas();
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

    const fromSchema = async (): Promise<ChiselDb> => {
      if (fs.existsSync(filepath)) {
        logger.info(
          `Cannot create Database, db already exists at ${filepath}, using ${opts.dbName}`,
        );
        return new ChiselDb(filepath);
      }
      logger.info(
        `Database doesn't exists at ${filepath}, creating ${opts.dbName}`,
      );
      await fs.promises.mkdir(dirPath, { recursive: true });
      const db = new Database(filepath);

      const {
        sqlScripts,
        metaDirectoryPath,
        snapshotPath,
        snapshot,
        journal,
        journalFilePath,
        schemaFilePath,
      } = generateMetas();
      db.exec(sqlScripts.join("\n"));

      await fs.promises.mkdir(metaDirectoryPath, { recursive: true });
      await Promise.all([
        fs.promises.writeFile(
          snapshotPath,
          JSON.stringify(snapshot, null, 2),
          "utf8",
        ),
        fs.promises.writeFile(
          journalFilePath,
          JSON.stringify(journal, null, 2),
          "utf8",
        ),
        fs.promises.writeFile(schemaFilePath, sqlScripts.join("\n"), "utf8"),
      ]);
      if (opts.generateTypes) {
        logger.info(`Generating types...`);

        const data = JSON.parse(
          await fs.promises.readFile(snapshotPath, "utf8"),
        );
        await generateTypes(data, { dir: opts.typesDir });
        if (!db) throw new Error("Error during database creation ");
      }
      logger.info(
        `Connection with SQLite Dabatase "${filepath}" has been established`,
      );
      return new ChiselDb(filepath);
    };

    return { fromSchema, fromSchemaSync };
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
