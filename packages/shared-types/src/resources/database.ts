import { ColumnOptions } from "../types/schema.type";

export type Database = {
  id: string;
  name: string;
  size: string;
  last_updated_at: Date;
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

export interface GetAttributes {
  id: string;
  name: string;
  type: string;
  isRequired: number;
  isPrimaryKey: number;
}

export interface GetEntities {
  id: string;
  tableName: string;
  columns: GetAttributes[];
}
export interface GetDatabase {
  id: string;
  name: string;
  entities: GetEntities[];
}

export interface CreateDatabase {
  name: string;
  entities: CreateEntity[];
}

export interface CreateEntity {
  name: string;
  fields: Record<string, ColumnOptions | undefined>;
}
