export class DatabaseInfoType {
  dbName: string;
  tables: TableInfoType[];
}

export class TableInfoType {
  tableName: string;
  columns: ColInfoType[];
}

export class ColInfoType {
  name: string;
  type: string;
  notNull: boolean;
  primaryKey: boolean;
}
