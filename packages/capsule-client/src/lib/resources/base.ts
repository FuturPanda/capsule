import { ApiClient } from '../axios';
import { ListResponse, PaginationParams } from '../types';

export abstract class BaseResource<T, CreateParams, UpdateParams> {
  protected apiClient: ApiClient;
  protected basePath: string;

  constructor(apiClient: ApiClient, basePath: string) {
    this.apiClient = apiClient;
    this.basePath = basePath;
  }

  async list(params?: PaginationParams): Promise<ListResponse<T>> {
    return this.apiClient.get<ListResponse<T>>(this.basePath, params);
  }

  async get(id: string): Promise<T> {
    return this.apiClient.get<T>(`${this.basePath}/${id}`);
  }

  async create(data: CreateParams): Promise<T> {
    return this.apiClient.post<T>(this.basePath, data);
  }

  async update(id: string, data: UpdateParams): Promise<T> {
    return this.apiClient.patch<T>(`${this.basePath}/${id}`, data);
  }

  async delete(id: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>(`${this.basePath}/${id}`);
  }
}
