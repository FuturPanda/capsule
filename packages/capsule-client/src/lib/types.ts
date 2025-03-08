export interface CapsuleConfig {
  apiKey: string;
  capsuleUrl: string;
  timeout?: number;
  oauth?: OAuthConfig;
  urlStorageKey?: string;
  validateUrl?: (url: string) => boolean | Promise<boolean>;
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
  expiresAt?: number;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri?: string;
}
