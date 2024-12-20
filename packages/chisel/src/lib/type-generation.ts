import * as fs from "fs";
import * as path from "path";
import { SnapshotType } from "./_utils/types/snapshot.type";
import { TableOptions } from "./_utils/types/schema.type";

export interface IFlintParams {
  dir?: string;
}

const typeMapping: Record<string, string> = {
  integer: "number | bigint",
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

function generateClass(entity: TableOptions): string {
  const lines: string[] = [];
  lines.push(`export class ${capitalize(entity.name)} {`);

  for (const [columnName, column] of Object.entries(entity.columns)) {
    const tsType = mapDbTypeToTsType(column.type);
    const optional = !column.notNull ? "?" : "";
    lines.push(`  ${columnName}${optional}: ${tsType};`);
  }

  lines.push("}");
  return lines.join("\n");
}

export function capitalize(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function generateTypesSync(snapshot: SnapshotType, params: IFlintParams) {
  const outputDir = path.join(`${params.dir}`, `${snapshot.name}`);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  console.log(`in generate types : `, snapshot);

  snapshot.entities.map((entity) => {
    console.log(entity);
    const tsInterface = generateClass(entity);
    const filePath = path.join(outputDir, `${entity.name}.ts`);
    console.log(`Generating ${filePath}`);
    return fs.writeFileSync(filePath, tsInterface);
  });
}

export { generateTypesSync };
