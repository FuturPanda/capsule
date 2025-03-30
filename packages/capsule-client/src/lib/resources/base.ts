import {
  FilterQuery,
  PaginatedResult,
  PaginationParams,
  QueryBuilder,
  QueryOptions,
} from "@capsulesh/shared-types";
import { ApiClient } from "../axios";
import { QuerySerializer } from "../query-serializer";

export abstract class BaseResource<T, CreateParams, UpdateParams> {
  protected apiClient: ApiClient;
  protected basePath: string;
  private querySerializer: QuerySerializer;

  constructor(apiClient: ApiClient, basePath: string) {
    this.apiClient = apiClient;
    this.basePath = basePath;
    this.querySerializer = new QuerySerializer();
  }

  async list(params?: PaginationParams): Promise<any> {
    console.log("Listing resources...");
    return this.apiClient.get<any>(this.basePath, params);
  }

  async create(data: CreateParams): Promise<T> {
    return this.apiClient.post<T>(this.basePath, data);
  }

  async update(id: number, data: UpdateParams): Promise<T> {
    return this.apiClient.patch<T>(`${this.basePath}/${id}`, data);
  }

  async delete(id: number): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>(
      `${this.basePath}/${id}`,
    );
  }

  select<T, K extends keyof T>(keys?: K | K[]): QueryBuilder<T, K> {
    const selectedFields = keys
      ? Array.isArray(keys)
        ? keys
        : [keys]
      : undefined;
    const apiClient = this.apiClient;
    const basePath = this.basePath;
    const querySerializer = this.querySerializer;
    const queryOptions: QueryOptions = {};
    queryOptions.select = selectedFields
      ? { fields: selectedFields as unknown as string[] }
      : undefined;

    const queryParams = {
      select: selectedFields,
    };

    return {
      where: (conditions: FilterQuery<T>) => {
        const whereQueryParams = {
          ...queryParams,
          where: conditions,
        };

        return {
          async one(): Promise<Pick<T, K> | null> {
            return apiClient.get<Pick<T, K> | null>(
              `${basePath}/one`,
              querySerializer.serializeQuery(whereQueryParams),
            );
          },

          async list(): Promise<Pick<T, K>[]> {
            return apiClient.get<Pick<T, K>[]>(
              basePath,
              querySerializer.serializeQuery(whereQueryParams),
            );
          },

          async paginated(
            params?: PaginationParams,
          ): Promise<PaginatedResult<Pick<T, K>>> {
            return apiClient.get<PaginatedResult<Pick<T, K>>>(
              `${basePath}/paginated`,
              {
                ...querySerializer.serializeQuery(whereQueryParams),
                ...querySerializer.serializeQuery(params),
              },
            );
          },
        };
      },

      async one(): Promise<Pick<T, K> | null> {
        return apiClient.get<Pick<T, K> | null>(
          `${basePath}/one`,
          querySerializer.serializeQuery(queryParams),
        );
      },

      async list(): Promise<Pick<T, K>[]> {
        return apiClient.get<Pick<T, K>[]>(
          basePath,
          querySerializer.serializeQuery(queryParams),
        );
      },

      async paginated(
        params?: PaginationParams,
      ): Promise<PaginatedResult<Pick<T, K>>> {
        return apiClient.get<PaginatedResult<Pick<T, K>>>(
          `${basePath}/paginated`,
          {
            ...querySerializer.serializeQuery(queryParams),
            ...querySerializer.serializeQuery(params),
          },
        );
      },
    };
  }
}
