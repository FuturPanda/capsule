export interface SchemaDiff {
  added: {
    tables: string[];
    columns: Record<string, string[]>;
    foreignKeys: Record<string, string[]>;
  };
  modified: {
    columns: Record<
      string,
      Array<{
        column: string;
        changes: {
          field: string;
          oldValue: any;
          newValue: any;
        }[];
      }>
    >;
    foreignKeys: Record<
      string,
      Array<{
        key: string;
        changes: {
          field: string;
          oldValue: any;
          newValue: any;
        }[];
      }>
    >;
  };
  removed: {
    tables: string[];
    columns: Record<string, string[]>;
    foreignKeys: Record<string, string[]>;
  };
}

export interface MigrationFiles {
  journalPath: string;
  snapshotPath: string;
  dirPath: string;
}
