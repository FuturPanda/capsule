export interface MigrationOperation {
  type: string;
  tableName?: string;
  columns?: Column[];
  foreignKeys?: ForeignKey[];
  primaryKey?: ColumnNamesArray;
  indexes?: ColumnNamesArray;
  uniqueConstraints?: string[];

  [key: string]: any;
}

export interface ForeignKey {
  baseColumnName: string;
  referencedTableName: string;
  referencedColumnName: string;
  constraintName: string;
}

export interface ColumnNamesArray {
  columnNames: string[];
}

export interface Column {
  name: string;
  type: string;
  autoIncrement?: boolean;
  constraints?: {
    primaryKey?: boolean;
    nullable?: boolean;
    unique?: boolean;
  };
  enumValues?: string[];
  defaultValue?: DefaultSqliteEnum | string | { sql: string };

  [key: string]: any;
}

export interface Migration {
  changeSetId: string;
  author: string;
  operations: MigrationOperation[];
}

export enum DefaultSqliteEnum {
  CURRENT_TIMESTAMP = "CURRENT_TIMESTAMP",
  NULL = "NULL",
  TRUE = "TRUE",
  FALSE = "FALSE",
}
