import * as fs from "fs";
import * as path from "path";
import { SnapshotType } from "../../src/lib/_utils/types/snapshot.type";
import { capitalize, generateTypesSync } from "../../src/lib/type-generation";
import { TableOptions } from "../../src";

jest.mock("fs");
jest.mock("path");

describe("Type Generation Utilities", () => {
  const mockFs = fs as jest.Mocked<typeof fs>;
  const mockPath = path as jest.Mocked<typeof path>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFs.existsSync.mockReturnValue(false);
    mockPath.join.mockImplementation((...paths) => paths.join("/"));
  });

  describe("generateTypesSync", () => {
    const baseSnapshot: SnapshotType = {
      version: "1",
      name: "test_db",
      id: "test-id",
      prevId: "prev-id",
      entities: [],
    };

    it("should create output directory if it does not exist", () => {
      const params = { dir: "output" };
      generateTypesSync(baseSnapshot, params);

      expect(mockFs.mkdirSync).toHaveBeenCalledWith("output/test_db", {
        recursive: true,
      });
    });

    it("should not create directory if it already exists", () => {
      mockFs.existsSync.mockReturnValue(true);
      const params = { dir: "output" };
      generateTypesSync(baseSnapshot, params);

      expect(mockFs.mkdirSync).not.toHaveBeenCalled();
    });

    it("should generate correct TypeScript class for simple entity", () => {
      const entity: TableOptions = {
        name: "user",
        columns: {
          id: { type: "integer", notNull: true },
          name: { type: "text", notNull: true },
          email: { type: "text" },
        },
      };

      const snapshot: SnapshotType = {
        ...baseSnapshot,
        entities: [entity],
      };

      generateTypesSync(snapshot, { dir: "output" });

      const expectedContent = `export class User {
  id: number;
  name: string;
  email?: string;
}`;

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        "output/test_db/user.ts",
        expectedContent,
      );
    });

    it("should handle unknown types", () => {
      const entity: TableOptions = {
        name: "data",
        columns: {
          id: { type: "integer", notNull: true },
          content: { type: "blob", notNull: true }, // Unknown type
        },
      };

      const snapshot: SnapshotType = {
        ...baseSnapshot,
        entities: [entity],
      };

      generateTypesSync(snapshot, { dir: "output" });

      const expectedContent = `export class Data {
  id: number;
  content: any;
}`;

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        "output/test_db/data.ts",
        expectedContent,
      );
    });

    it("should generate files for multiple entities", () => {
      const entities: TableOptions[] = [
        {
          name: "user",
          columns: {
            id: { type: "integer", notNull: true },
          },
        },
        {
          name: "post",
          columns: {
            id: { type: "integer", notNull: true },
            title: { type: "text", notNull: true },
          },
        },
      ];

      const snapshot: SnapshotType = {
        ...baseSnapshot,
        entities,
      };

      generateTypesSync(snapshot, { dir: "output" });

      expect(mockFs.writeFileSync).toHaveBeenCalledTimes(2);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        "output/test_db/user.ts",
        expect.any(String),
      );
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        "output/test_db/post.ts",
        expect.any(String),
      );
    });

    it("should properly capitalize entity names", () => {
      const entity: TableOptions = {
        name: "user_profile",
        columns: {
          id: { type: "integer", notNull: true },
        },
      };

      const snapshot: SnapshotType = {
        ...baseSnapshot,
        entities: [entity],
      };

      generateTypesSync(snapshot, { dir: "output" });

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        "output/test_db/user_profile.ts",
        expect.stringContaining("export class UserProfile"),
      );
    });

    it("should handle empty entities array", () => {
      generateTypesSync(baseSnapshot, { dir: "output" });

      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
      expect(mockFs.mkdirSync).toHaveBeenCalled(); // Directory should still be created
    });

    // Test error cases
    it("should handle file system errors", () => {
      mockFs.mkdirSync.mockImplementation(() => {
        throw new Error("Permission denied");
      });

      const entity: TableOptions = {
        name: "user",
        columns: {
          id: { type: "integer", notNull: true },
        },
      };

      expect(() =>
        generateTypesSync(
          { ...baseSnapshot, entities: [entity] },
          { dir: "output" },
        ),
      ).toThrow("Permission denied");
    });
  });
  describe("capitalize", () => {
    it("should capitalize single word", () => {
      expect(capitalize("user")).toBe("User");
      expect(capitalize("post")).toBe("Post");
    });

    it("should capitalize multiple words with underscores", () => {
      expect(capitalize("user_profile")).toBe("UserProfile");
      expect(capitalize("blog_post_comment")).toBe("BlogPostComment");
    });

    it("should handle already capitalized words", () => {
      expect(capitalize("User")).toBe("User");
      expect(capitalize("user_Profile")).toBe("UserProfile");
    });

    it("should handle empty string", () => {
      expect(capitalize("")).toBe("");
    });

    it("should handle single underscore", () => {
      expect(capitalize("_")).toBe("");
    });

    it("should handle multiple underscores", () => {
      expect(capitalize("user__profile")).toBe("UserProfile");
      expect(capitalize("__user__profile__")).toBe("UserProfile");
    });

    it("should handle single character words", () => {
      expect(capitalize("a_b_c")).toBe("ABC");
    });
  });
});
