export interface CapsuleConfig extends OAuthConfig {
  redirectUri?: string;
  capsuleUrl?: string;
  databaseMigrations?: Migration[];
}

export interface OAuthConfig {
  identifier: string;
  scopes?: OAuthScopes[];
}
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ListResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type CapsuleResourceType =
  | "people"
  | "organizations"
  | "events"
  | "tasks"
  | "documents"
  | "users";

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export enum OAuthScopes {
  PROFILE_READ = "profile:read",
  PROFILE_WRITE = "profile:write",
  EMAIL_READ = "email:read",
  EMAIL_WRITE = "email:write",
  TASKS_READ = "tasks:read",
  TASKS_WRITE = "tasks:write",
  EVENTS_READ = "events:read",
  EVENTS_WRITE = "events:write",
  DATABASE_OWNER = "database:owner",
}

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
