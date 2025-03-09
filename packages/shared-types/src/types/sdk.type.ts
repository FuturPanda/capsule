import { Task } from "../resources/tasks";
import { FilterQuery } from "./queries.type";

export interface TaskQueryBuilder<K extends keyof Task> {
  where: (conditions: FilterQuery<Task>) => TaskQueryExecutor<K>;
  one(): Promise<Pick<Task, K> | null>;
  list(): Promise<Pick<Task, K>[]>;
  paginated(params?: PaginationParams): Promise<PaginatedResult<Pick<Task, K>>>;
}

export interface TaskQueryExecutor<K extends keyof Task> {
  one(): Promise<Pick<Task, K> | null>;
  list(): Promise<Pick<Task, K>[]>;
  paginated(params?: PaginationParams): Promise<PaginatedResult<Pick<Task, K>>>;
}

export interface QueryBuilder<T, K extends keyof T> {
  where: (conditions: FilterQuery<T>) => QueryExecutor<T, K>;
  one(): Promise<Pick<T, K> | null>;
  list(): Promise<Pick<T, K>[]>;
  paginated(params?: PaginationParams): Promise<PaginatedResult<Pick<T, K>>>;
}

export interface QueryExecutor<T, K extends keyof T> {
  one(): Promise<Pick<T, K> | null>;
  list(): Promise<Pick<T, K>[]>;
  paginated(params?: PaginationParams): Promise<PaginatedResult<Pick<T, K>>>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export type ModelType =
  | "tasks"
  | "people"
  | "organizations"
  | "events"
  | "documents"
  | "users";

export interface OAuthConfig {
  identifier: string;
  scopes?: OAuthScopes[];
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

export interface ListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
