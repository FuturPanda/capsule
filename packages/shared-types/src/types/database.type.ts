export type DatabaseInfoType = {
  dbName: string;
  tables: TableInfoType[];
};

export type TableInfoType = {
  tableName: string;
  columns: ColInfoType[];
};

export type ColInfoType = {
  name: string;
  type: string;
  notNull: boolean;
  primaryKey: boolean;
};
