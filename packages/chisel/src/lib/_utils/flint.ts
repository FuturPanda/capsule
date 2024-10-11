import * as fs from "fs";
import * as path from "path";

export interface IFlintParams {
  dir?: string;
}

export interface SnapshotType {
  version: string;
  name: string;
  id: string;
  prevId: string;
  tables: Record<string, SnapShotTableType>;
}

export interface SnapShotTableType {
  columns: {
    [columnName: string]: {
      type: string;
      primaryKey: boolean;
      notNull: boolean;
      autoIncrement: boolean;
    };
  };
  indexes: {};
  foreignKeys: {};
  compositePrimaryKeys: {};
  uniqueConstraints: {};
}

export type ColumnOptions = {
  type: "integer" | "text" | "blob" | "real" | "numeric" | "null";
  primaryKey?: boolean;
  autoIncrement?: boolean;
  notNull?: boolean;
  defaultValue?: string;
  mode?: "json";
  enum?: Record<string, any>;
  unique?: boolean;
};

export type EntityOptions = {
  name: string;
  columns: Record<string, ColumnOptions>;
  indexes?: Record<string, string>;
  foreignKeys?: Record<string, { foreignTable: string; foreignKey: string }>;
  compositePrimaryKeys?: string[];
  uniqueConstraints?: string[];
};

export type DatabaseSchema = {
  dbName: string;
  entities: EntityOptions[];
};
const typeMapping: Record<string, string> = {
  integer: "number",
  text: "string",
  /**
   * TODO :
   *
   *  Add Mapping for all SQLITE types
   **/
};

function mapDbTypeToTsType(dbType: string): string {
  return typeMapping[dbType] || "any";
}

function generateClass(name: string, table: SnapShotTableType): string {
  const lines: string[] = [];
  lines.push(`export class ${capitalize(name)} {`);

  for (const [columnName, column] of Object.entries(table.columns)) {
    const tsType = mapDbTypeToTsType(column.type);
    const optional = !column.notNull ? "?" : "";
    lines.push(`  ${columnName}${optional}: ${tsType};`);
  }

  lines.push("}");
  return lines.join("\n");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function generateTypes(snapshot: SnapshotType, params: IFlintParams) {
  const outputDir =
    (params.dir ? path.resolve(__dirname, params.dir) : __dirname) +
    `/types/${snapshot.name}`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  console.log(`in generate types : `, snapshot);

  await Promise.all(
    Object.entries(snapshot.tables).map(([name, table]) => {
      console.log(table);
      const tsInterface = generateClass(name, table);
      const filePath = path.join(outputDir, `${name}.ts`);
      console.log(`Generating ${filePath}`);
      return fs.promises.writeFile(filePath, tsInterface);
    }),
  );
}

function generateTypesSync(snapshot: SnapshotType, params: IFlintParams) {
  const outputDir = path.join(`${params.dir}`, `/${snapshot.name}`);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  console.log(`in generate types : `, snapshot);

  Object.entries(snapshot.tables).map(([name, table]) => {
    console.log(table);
    const tsInterface = generateClass(name, table);
    const filePath = path.join(outputDir, `${name}.ts`);
    console.log(`Generating ${filePath}`);
    return fs.writeFileSync(filePath, tsInterface);
  });
}

export { generateTypes, generateTypesSync };
