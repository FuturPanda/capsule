import { ColumnOptions } from "@capsule/chisel";

export type Database = {
  id: string;
  name: string;
  size: string;
  entities: Entity[];
  lastUpdatedAt: Date;
};

export interface Entity {
  id: string;
  name: string;
  fields: Record<string, ColumnOptions | undefined>;
  rows: unknown[];
}

export enum DataSourceTypeEnum {
  DATABASE = "DATABASE",
  AGREGATION = "AGREGATION",
}

export type GetAttributesDto = {
  id: string;
  name: string;
  type: string;
  isRequired: number;
  isPrimaryKey: number;
};

export type GetEntitiesDto = {
  id: string;
  name: string;
  attributes: GetAttributesDto[];
};
export type GetDatabaseDto = {
  id: string;
  name: string;
  entities: GetEntitiesDto[];
};
