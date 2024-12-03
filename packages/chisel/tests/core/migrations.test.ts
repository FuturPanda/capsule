import { ChiselSchema } from "../../src";
import { compareSchemas, handleSchemaChanges } from "../../src/lib/migrations";
import * as fs from "fs/promises";
import * as path from "path";

describe("compareSchemas", () => {
  const baseSchema: ChiselSchema = {
    dbName: "test",
    version: "0.0.1",
    entities: [
      {
        name: "user",
        columns: {
          id: {
            type: "integer",
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
          },
          email: { type: "text", notNull: true },
          created_at: { type: "text" },
        },
        foreignKeys: {
          created_by: {
            foreignTable: "admin",
            foreignKey: "id",
          },
        },
      },
    ],
  };

  it("should detect no changes when schemas are identical", () => {
    const newSchema = JSON.parse(JSON.stringify(baseSchema)); // Deep clone
    const diff = compareSchemas(baseSchema, newSchema);
    console.log(diff);

    expect(diff.added.tables).toHaveLength(0);
    expect(diff.removed.tables).toHaveLength(0);
    expect(Object.keys(diff.modified.columns)).toHaveLength(0);
    expect(Object.keys(diff.modified.foreignKeys)).toHaveLength(0);
  });

  it("should detect added tables", () => {
    const newSchema = JSON.parse(JSON.stringify(baseSchema));
    newSchema.entities.push({
      name: "post",
      columns: {
        id: {
          type: "integer",
          notNull: true,
          primaryKey: true,
        },
      },
    });

    const diff = compareSchemas(baseSchema, newSchema);
    console.log(diff);

    expect(diff.added.tables).toContain("post");
    expect(diff.added.tables).toHaveLength(1);
    expect(diff.removed.tables).toHaveLength(0);
  });

  it("should detect removed tables", () => {
    const newSchema = JSON.parse(JSON.stringify(baseSchema));
    newSchema.entities = [];

    const diff = compareSchemas(baseSchema, newSchema);

    expect(diff.removed.tables).toContain("user");
    expect(diff.removed.tables).toHaveLength(1);
    expect(diff.added.tables).toHaveLength(0);
  });

  it("should detect added columns", () => {
    const newSchema = JSON.parse(JSON.stringify(baseSchema));
    newSchema.entities[0].columns.password = {
      type: "text",
      notNull: true,
    };

    const diff = compareSchemas(baseSchema, newSchema);

    expect(diff.added.columns.user).toContain("password");
    expect(diff.added.columns.user).toHaveLength(1);
    expect(diff.removed.columns.user).toBeUndefined();
  });

  it("should detect removed columns", () => {
    const newSchema = JSON.parse(JSON.stringify(baseSchema));
    delete newSchema.entities[0].columns.email;

    const diff = compareSchemas(baseSchema, newSchema);

    expect(diff.removed.columns.user).toContain("email");
    expect(diff.removed.columns.user).toHaveLength(1);
    expect(diff.added.columns.user).toBeUndefined();
  });

  it("should detect modified columns", () => {
    const newSchema = JSON.parse(JSON.stringify(baseSchema));
    newSchema.entities[0].columns.email.notNull = false;
    newSchema.entities[0].columns.email.type = "varchar";

    const diff = compareSchemas(baseSchema, newSchema);

    expect(diff.modified.columns.user).toHaveLength(1);
    expect(diff.modified.columns.user[0].column).toBe("email");
    expect(diff.modified.columns.user[0].changes).toEqual(
      expect.arrayContaining([
        {
          field: "notNull",
          oldValue: true,
          newValue: false,
        },
        {
          field: "type",
          oldValue: "text",
          newValue: "varchar",
        },
      ]),
    );
  });

  it("should detect added foreign keys", () => {
    const newSchema = JSON.parse(JSON.stringify(baseSchema));
    newSchema.entities[0].foreignKeys = {
      ...newSchema.entities[0].foreignKeys,
      updated_by: {
        foreignTable: "admin",
        foreignKey: "id",
      },
    };

    const diff = compareSchemas(baseSchema, newSchema);

    expect(diff.added.foreignKeys.user).toContain("updated_by");
    expect(diff.added.foreignKeys.user).toHaveLength(1);
  });

  it("should detect removed foreign keys", () => {
    const newSchema = JSON.parse(JSON.stringify(baseSchema));
    delete newSchema.entities[0].foreignKeys.created_by;

    const diff = compareSchemas(baseSchema, newSchema);

    expect(diff.removed.foreignKeys.user).toContain("created_by");
    expect(diff.removed.foreignKeys.user).toHaveLength(1);
  });

  it("should detect modified foreign keys", () => {
    const newSchema = JSON.parse(JSON.stringify(baseSchema));
    newSchema.entities[0].foreignKeys.created_by.foreignTable = "superadmin";

    const diff = compareSchemas(baseSchema, newSchema);

    expect(diff.modified.foreignKeys.user).toHaveLength(1);
    expect(diff.modified.foreignKeys.user[0].key).toBe("created_by");
    expect(diff.modified.foreignKeys.user[0].changes).toEqual(
      expect.arrayContaining([
        {
          field: "foreignTable",
          oldValue: "admin",
          newValue: "superadmin",
        },
      ]),
    );
  });

  it("should handle complex schema changes", () => {
    const newSchema = JSON.parse(JSON.stringify(baseSchema));

    // Add new table
    newSchema.entities.push({
      name: "post",
      columns: {
        id: { type: "integer", primaryKey: true },
      },
    });

    // Modify existing table
    newSchema.entities[0].columns.email.notNull = false;
    newSchema.entities[0].columns.password = { type: "text" };
    delete newSchema.entities[0].columns.created_at;

    const diff = compareSchemas(baseSchema, newSchema);

    expect(diff.added.tables).toContain("post");
    expect(diff.modified.columns.user).toBeDefined();
    expect(diff.added.columns.user).toContain("password");
    expect(diff.removed.columns.user).toContain("created_at");
  });

  it("should handle empty schemas", () => {
    const emptySchema: ChiselSchema = {
      dbName: "test",
      version: "",
      entities: [],
    };

    const diff = compareSchemas(emptySchema, emptySchema);

    expect(diff.added.tables).toHaveLength(0);
    expect(diff.removed.tables).toHaveLength(0);
    expect(Object.keys(diff.modified.columns)).toHaveLength(0);
    expect(Object.keys(diff.modified.foreignKeys)).toHaveLength(0);
  });
});

describe("Schema Comparison and Migration", () => {
  describe("compareSchemas", () => {
    const baseSchema: ChiselSchema = {
      dbName: "test_db",
      version: "",
      entities: [
        {
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
            },
            created_at: {
              type: "text",
            },
          },
          foreignKeys: {
            created_by: {
              foreignTable: "admin",
              foreignKey: "id",
            },
          },
        },
      ],
    };

    it("should detect no changes when schemas are identical", () => {
      const newSchema = JSON.parse(JSON.stringify(baseSchema));
      const diff = compareSchemas(baseSchema, newSchema);

      expect(diff.added.tables).toHaveLength(0);
      expect(diff.removed.tables).toHaveLength(0);
      expect(Object.keys(diff.modified.columns)).toHaveLength(0);
      expect(Object.keys(diff.modified.foreignKeys)).toHaveLength(0);
    });

    it("should detect added tables", () => {
      const newSchema = JSON.parse(JSON.stringify(baseSchema));
      newSchema.entities.push({
        name: "posts",
        columns: {
          id: {
            type: "integer",
            primaryKey: true,
            notNull: true,
          },
        },
      });

      const diff = compareSchemas(baseSchema, newSchema);

      expect(diff.added.tables).toContain("posts");
      expect(diff.added.tables).toHaveLength(1);
    });

    it("should detect removed tables", () => {
      const newSchema = JSON.parse(JSON.stringify(baseSchema));
      newSchema.entities = [];

      const diff = compareSchemas(baseSchema, newSchema);

      expect(diff.removed.tables).toContain("users");
      expect(diff.removed.tables).toHaveLength(1);
    });

    it("should detect added columns", () => {
      const newSchema = JSON.parse(JSON.stringify(baseSchema));
      newSchema.entities[0].columns.password = {
        type: "text",
        notNull: true,
      };

      const diff = compareSchemas(baseSchema, newSchema);

      expect(diff.added.columns.users).toContain("password");
      expect(diff.added.columns.users).toHaveLength(1);
    });

    it("should detect removed columns", () => {
      const newSchema = JSON.parse(JSON.stringify(baseSchema));
      delete newSchema.entities[0].columns.email;

      const diff = compareSchemas(baseSchema, newSchema);

      expect(diff.removed.columns.users).toContain("email");
      expect(diff.removed.columns.users).toHaveLength(1);
    });

    it("should detect column type modifications", () => {
      const newSchema = JSON.parse(JSON.stringify(baseSchema));
      newSchema.entities[0].columns.email.type = "varchar";

      const diff = compareSchemas(baseSchema, newSchema);

      expect(diff.modified.columns.users[0].column).toBe("email");
      expect(diff.modified.columns.users[0].changes).toContainEqual({
        field: "type",
        oldValue: "text",
        newValue: "varchar",
      });
    });

    it("should detect constraint modifications", () => {
      const newSchema = JSON.parse(JSON.stringify(baseSchema));
      newSchema.entities[0].columns.email.notNull = false;

      const diff = compareSchemas(baseSchema, newSchema);

      expect(diff.modified.columns.users[0].column).toBe("email");
      expect(diff.modified.columns.users[0].changes).toContainEqual({
        field: "notNull",
        oldValue: true,
        newValue: false,
      });
    });

    it("should detect foreign key changes", () => {
      const newSchema = JSON.parse(JSON.stringify(baseSchema));
      newSchema.entities[0].foreignKeys.created_by.foreignTable = "super_admin";

      const diff = compareSchemas(baseSchema, newSchema);

      expect(diff.modified.foreignKeys.users[0].key).toBe("created_by");
      expect(diff.modified.foreignKeys.users[0].changes).toContainEqual({
        field: "foreignTable",
        oldValue: "admin",
        newValue: "super_admin",
      });
    });
  });

  describe("handleSchemaChanges", () => {
    let tmpDir: string;
    const mockFiles = {
      journalPath: "",
      snapshotPath: "",
      sqlPath: "",
      dirPath: "",
    };

    beforeEach(async () => {
      // Create temporary directory structure
      tmpDir = path.join(__dirname, "tmp_test_" + Date.now());
      await fs.mkdir(path.join(tmpDir, "migrations", "_meta"), {
        recursive: true,
      });

      mockFiles.dirPath = tmpDir;
      mockFiles.journalPath = path.join(tmpDir, "_journal.json");
      mockFiles.snapshotPath = path.join(
        tmpDir,
        "migrations",
        "_meta",
        "_snapshot_0000.json",
      );
      mockFiles.sqlPath = path.join(tmpDir, "migrations");

      // Initialize with empty journal and snapshot
      await fs.writeFile(
        mockFiles.journalPath,
        JSON.stringify({
          version: 0.1,
          entries: [],
        }),
      );

      await fs.writeFile(
        mockFiles.snapshotPath,
        JSON.stringify({
          version: "1",
          name: "test_db",
          id: "00000000-0000-0000-0000-000000000000",
          prevId: "00000000-0000-0000-0000-000000000000",
          tables: {},
        }),
      );
    });

    afterEach(async () => {
      await fs.rm(tmpDir, { recursive: true, force: true });
    });

    it("should generate migration files for schema changes", async () => {
      const oldSchema: ChiselSchema = {
        dbName: "test_db",
        version: "",
        entities: [
          {
            name: "users",
            columns: {
              id: { type: "integer", primaryKey: true },
              name: { type: "text" },
            },
          },
        ],
      };

      const newSchema: ChiselSchema = {
        dbName: "test_db",
        version: "",
        entities: [
          {
            name: "users",
            columns: {
              id: { type: "integer", primaryKey: true },
              name: { type: "text" },
              email: { type: "text", notNull: true },
            },
          },
        ],
      };
      const diff = compareSchemas(oldSchema, newSchema);
      const result = handleSchemaChanges(diff, newSchema, mockFiles);

      expect(result).toBeDefined();
      expect(result.sqlCommands).toBeDefined();
      expect(result.sqlCommands.length).toBeGreaterThan(0);

      const migrationFile = await fs.readFile(
        path.join(mockFiles.sqlPath, `${result.migrationName}.sql`),
        "utf8",
      );
      expect(migrationFile).toContain("ALTER TABLE");

      const journalFile = await fs.readFile(mockFiles.journalPath, "utf8");
      expect(JSON.parse(journalFile).entries).toHaveLength(1);
    });

    it("should not generate migration files when no changes", async () => {
      const schema: ChiselSchema = {
        dbName: "test_db",
        version: "",
        entities: [
          {
            name: "users",
            columns: {
              id: { type: "integer", primaryKey: true },
            },
          },
        ],
      };
      const diff = compareSchemas(schema, schema);
      const result = handleSchemaChanges(diff, schema, mockFiles);

      expect(result).toBeUndefined();
    });
  });
});
