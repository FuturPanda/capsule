import {
  buildColumnDefinition,
  escapeIdentifier,
  generateCreateTableSQL,
  generateDatabaseSQL,
  generateJournal,
  generateSnapshot,
  generateUniqueFilename,
} from "../../src/lib/schemas";
import { ColumnOptions, TableOptions } from "../../src";

describe("Schema Utilities", () => {
  describe("generateUniqueFilename", () => {
    it("should generate filename with correct version format", () => {
      expect(generateUniqueFilename(0.1)).toMatch(/^0100_.*$/);
      expect(generateUniqueFilename(0.141)).toMatch(/^0141_.*$/);
      expect(generateUniqueFilename(1.0)).toMatch(/^1000_.*$/);
      expect(generateUniqueFilename()).toMatch(/^0000_.*$/);
    });

    it("should generate unique filenames", () => {
      const name1 = generateUniqueFilename(0.1);
      const name2 = generateUniqueFilename(0.1);
      expect(name1).not.toBe(name2);
    });
  });

  describe("escapeIdentifier", () => {
    it("should escape identifiers correctly", () => {
      expect(escapeIdentifier("normal")).toBe("`normal`");
      expect(escapeIdentifier("with`backtick")).toBe("`with``backtick`");
      expect(escapeIdentifier("multiple``ticks")).toBe("`multiple````ticks`");
    });
  });

  describe("buildColumnDefinition", () => {
    it("should build basic column definition", () => {
      const options: ColumnOptions = {
        type: "text",
        notNull: true,
      };
      expect(buildColumnDefinition("name", options)).toBe(
        "`name` TEXT NOT NULL",
      );
    });

    it("should build column with primary key and autoincrement", () => {
      const options: ColumnOptions = {
        type: "integer",
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
      };
      expect(buildColumnDefinition("id", options)).toBe(
        "`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
      );
    });

    it("should handle enum constraints", () => {
      const options: ColumnOptions = {
        type: "text",
        enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      };
      const result = buildColumnDefinition("status", options);
      expect(result).toContain("CHECK (status IN");
      expect(result).toContain("'DRAFT'");
      expect(result).toContain("'PUBLISHED'");
      expect(result).toContain("'ARCHIVED'");
    });

    it("should throw error for invalid column type", () => {
      const options = {
        type: "invalid_type",
      };
      expect(() => buildColumnDefinition("test", options as any)).toThrow(
        "Invalid column type",
      );
    });

    it("should throw error for enum on non-text column", () => {
      const options: ColumnOptions = {
        type: "integer",
        enum: ["1", "2"],
      };
      expect(() => buildColumnDefinition("test", options)).toThrow();
    });
  });

  describe("generateCreateTableSQL", () => {
    const baseTable: TableOptions = {
      name: "users",
      columns: {
        id: {
          type: "integer",
          primaryKey: true,
          autoIncrement: true,
          notNull: true,
        },
        email: {
          type: "text",
          notNull: true,
          unique: true,
        },
      },
    };

    it("should generate basic table creation SQL", () => {
      const sql = generateCreateTableSQL(baseTable);
      expect(sql).toContain("CREATE TABLE IF NOT EXISTS `users`");
      expect(sql).toContain("`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL");
      expect(sql).toContain("`email` TEXT NOT NULL UNIQUE");
    });

    it("should handle foreign keys", () => {
      const tableWithFK: TableOptions = {
        ...baseTable,
        foreignKeys: {
          role_id: {
            foreignTable: "roles",
            foreignKey: "id",
          },
        },
      };
      const sql = generateCreateTableSQL(tableWithFK);
      expect(sql).toContain("FOREIGN KEY");
      expect(sql).toContain("`roles`");
    });

    it("should handle composite primary keys", () => {
      const tableWithCompositePK: TableOptions = {
        name: "user_roles",
        columns: {
          user_id: { type: "integer", notNull: true },
          role_id: { type: "integer", notNull: true },
        },
        compositePrimaryKeys: ["user_id", "role_id"],
      };
      const sql = generateCreateTableSQL(tableWithCompositePK);
      expect(sql).toContain("PRIMARY KEY ( `user_id`, `role_id` )");
    });

    it("should throw error when no primary key is defined", () => {
      const invalidTable: TableOptions = {
        name: "invalid",
        columns: {
          name: { type: "text" },
        },
      };
      expect(() => generateCreateTableSQL(invalidTable)).toThrow(
        "require a primary key",
      );
    });
  });

  describe("generateDatabaseSQL", () => {
    it("should generate SQL for multiple tables", () => {
      const tables: TableOptions[] = [
        {
          name: "users",
          columns: {
            id: { type: "integer", primaryKey: true },
            name: { type: "text" },
          },
        },
        {
          name: "posts",
          columns: {
            id: { type: "integer", primaryKey: true },
            title: { type: "text" },
          },
        },
      ];

      const sqls = generateDatabaseSQL(tables);
      expect(sqls).toHaveLength(2);
      expect(sqls[0]).toContain("CREATE TABLE IF NOT EXISTS `users`");
      expect(sqls[1]).toContain("CREATE TABLE IF NOT EXISTS `posts`");
    });

    it("should handle empty input", () => {
      expect(generateDatabaseSQL()).toHaveLength(0);
    });
  });

  describe("generateJournal", () => {
    it("should generate journal with correct structure", () => {
      const journal = generateJournal("test_migration");
      expect(journal).toEqual({
        version: 0.1,
        entries: [
          {
            idx: 0,
            version: 0.1,
            when: expect.any(Number),
            tag: "test_migration",
          },
        ],
      });
    });
  });

  describe("generateSnapshot", () => {
    it("should generate snapshot with correct structure", () => {
      const entities: TableOptions[] = [
        {
          name: "test",
          columns: {
            id: { type: "integer", primaryKey: true },
          },
        },
      ];

      const snapshot = generateSnapshot("test_db", entities);
      expect(snapshot).toEqual({
        version: "0000",
        name: "test_db",
        id: expect.any(String),
        prevId: expect.any(String),
        entities: entities,
      });
    });

    it("should use provided prevId", () => {
      const prevId = "test-prev-id";
      const snapshot = generateSnapshot("test_db", [], null, prevId);
      expect(snapshot.prevId).toBe(prevId);
    });
  });
});
