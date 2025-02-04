import { ColumnOptions, TableOptions } from "@capsulesh/chisel";

export type DataSource = {
  id: string;
  name: string;
  description: string;
  type: DataSourceTypeEnum;
  entities: Entity[];
  lastUpdatedAt: Date;
};

export interface Entity extends Partial<TableOptions> {
  id: string;
  name: string;
  fields: Record<string, ColumnOptions>;
}

export enum DataSourceTypeEnum {
  DATABASE = "DATABASE",
  AGREGATION = "AGREGATION",
}
