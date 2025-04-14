import { Migration } from "@capsulesh/shared-types";
import fs from "node:fs";
import path from "node:path";
import { ChiselDb } from "../dist";

jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
}));

describe("ChiselDb", () => {
  const testDbPath = ":memory:"; // Use in-memory SQLite for tests
  let db: ChiselDb;

  beforeEach(() => {
    jest.clearAllMocks();
    db = new ChiselDb(testDbPath);
  });
  afterEach(() => {
    if (db) {
      db.close();
    }
  });

  describe("static create", () => {
    it("should create a new database connection", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const opts = {
        uri: "/tmp",
        dbName: "test_db",
      };

      const result = ChiselDb.create(opts);

      expect(result).toBeInstanceOf(ChiselDb);
    });
  });

  describe("initializeFromMigrations", () => {
    it("should apply migrations if not already executed", () => {
      const migration: Migration = {
        changeSetId: "test-migration-1",
        author: "tester",
        operations: [
          {
            type: "createTable",
            tableName: "test_table",
            columns: [
              {
                name: "id",
                type: "integer",
                constraints: { primaryKey: true },
                autoIncrement: true,
              },
              { name: "name", type: "text", constraints: { nullable: false } },
            ],
            primaryKey: [],
          },
        ],
      };

      const dbWithMigrations = new ChiselDb(testDbPath, {
        uri: "/tmp",
        dbName: "test_db",
        migrations: [migration],
      });

      // Mock database methods that would be called during migration
      jest
        .spyOn(dbWithMigrations as any, "checkChangelogTable")
        .mockReturnValue(false);
      jest
        .spyOn(dbWithMigrations as any, "createChangelogTable")
        .mockImplementation(() => {});
      jest
        .spyOn(dbWithMigrations as any, "checkMigrationExecuted")
        .mockReturnValue(false);
      jest
        .spyOn(dbWithMigrations as any, "executeMigration")
        .mockImplementation(() => {});

      const result = dbWithMigrations.initializeFromMigrations();

      expect(result).toBe(dbWithMigrations);
      expect((dbWithMigrations as any).checkChangelogTable).toHaveBeenCalled();
      expect((dbWithMigrations as any).createChangelogTable).toHaveBeenCalled();
      expect(
        (dbWithMigrations as any).checkMigrationExecuted,
      ).toHaveBeenCalledWith(migration);
      expect((dbWithMigrations as any).executeMigration).toHaveBeenCalledWith(
        migration,
      );
    });

    it("should throw an error if no migrations provided", () => {
      expect(() => db.initializeFromMigrations()).toThrow(
        "No migrations provided",
      );
    });
  });

  describe("getTables", () => {
    it("should return a list of tables", () => {
      // Create a test table
      db.rawQuery("CREATE TABLE test_table (id INTEGER PRIMARY KEY)");

      const tables = db.getTables();

      expect(tables).toContain("test_table");
    });
  });

  describe("getTableInfo", () => {
    it("should return column information for a table", () => {
      // Create a test table with specific columns
      db.rawQuery(`
        CREATE TABLE test_table (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER
        )
      `);

      const tableInfo = db.getTableInfo("test_table");

      expect(tableInfo).toHaveLength(3);
      expect(tableInfo[0].name).toBe("id");
      expect(tableInfo[0].type).toBe("INTEGER");
      expect(tableInfo[0].primaryKey).toBe(true);

      expect(tableInfo[1].name).toBe("name");
      expect(tableInfo[1].type).toBe("TEXT");
      expect(tableInfo[1].notNull).toBe(true);

      expect(tableInfo[2].name).toBe("age");
      expect(tableInfo[2].type).toBe("INTEGER");
      expect(tableInfo[2].notNull).toBe(false);
    });
  });

  describe("getDbDefinition", () => {
    it("should return the database schema definition", () => {
      db.rawQuery(`
        CREATE TABLE users (
                 id INTEGER PRIMARY KEY,
                 username TEXT NOT NULL UNIQUE
               );
      `);
      db.rawQuery(`
        CREATE TABLE posts (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL,
          user_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);

      const definition = db.getDbDefinition();

      expect(definition).toHaveLength(2);

      const usersTable = definition.find((t) => t.tableName === "users");
      expect(usersTable).toBeDefined();
      expect(usersTable?.columns).toHaveLength(2);

      const postsTable = definition.find((t) => t.tableName === "posts");
      expect(postsTable).toBeDefined();
      expect(postsTable?.columns).toHaveLength(3);
    });
  });
});
