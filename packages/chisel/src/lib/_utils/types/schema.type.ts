export type ColumnOptions = {
  type: "integer" | "text" | "blob" | "real" | "numeric" | "null";
  primaryKey?: boolean;
  autoIncrement?: boolean;
  notNull?: boolean;
  defaultValue?: string;
  mode?: "json";
  enum?: Record<string, any>;
  unique?: boolean;
  name?: string;
};

export type TableOptions = {
  name: string;
  columns: Record<string, ColumnOptions>;
  indexes?: Record<string, string>;
  foreignKeys?: Record<string, { foreignTable: string; foreignKey: string }>;
  compositePrimaryKeys?: string[];
  uniqueConstraints?: string[];
};

export type ChiselSchema = {
  dbName: string;
  entities: TableOptions[];
};
