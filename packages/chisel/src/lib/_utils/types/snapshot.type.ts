export interface SnapshotType {
  version: string;
  name: string;
  id: string;
  prevId: string;
  tables: Record<string, SnapShotTableType>;
}

export interface SnapShotTableType {
  columns: Record<
    string,
    {
      type: string;
      primaryKey: boolean;
      notNull: boolean;
      autoIncrement: boolean;
    }
  >;
  indexes?: Record<string, string>;
  foreignKeys?: Record<string, { foreignTable: string; foreignKey: string }>;
  compositePrimaryKeys?: string[];
  uniqueConstraints?: string[];
}
