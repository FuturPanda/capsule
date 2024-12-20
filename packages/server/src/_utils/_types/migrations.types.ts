export interface MigrationOperation {
  type: string;
  tableName?: string;
  columns?: Array<{
    name: string;
    type: string;
    constraints?: {
      nullable?: boolean;
      primaryKey?: boolean;
      unique?: boolean;
    };
    [key: string]: any;
  }>;

  [key: string]: any;
}

export interface Migration {
  changeSetId: string;
  author: string;
  operations: MigrationOperation[];
}
