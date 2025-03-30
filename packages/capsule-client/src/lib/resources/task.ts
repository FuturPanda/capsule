import { CreateTask, Task, UpdateTask } from "@capsulesh/shared-types";
import { ApiClient } from "../axios";
import { EventEmitter } from "../event-emitter";
import { BaseResource } from "./base";

export class Tasks extends BaseResource<Task, CreateTask, UpdateTask> {
  //private querySerializer: QuerySerializer;
  private cachedTasks: Task[] = [];
  private eventEmitter: EventEmitter;

  constructor(apiClient: ApiClient, eventEmitter: EventEmitter) {
    super(apiClient, "/tasks");
    //this.querySerializer = new QuerySerializer();
    this.eventEmitter = eventEmitter;
  }

  async create(data: CreateTask): Promise<Task> {
    const newTask = await this.apiClient.post<Task>(this.basePath, data);
    this.cachedTasks.push(newTask);
    return newTask;
  }

  async update(id: number, data: UpdateTask): Promise<Task> {
    console.log(data);
    const updatedTask = await this.apiClient.patch<Task>(
      `${this.basePath}/${id}`,
      data,
    );

    const index = this.cachedTasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.cachedTasks[index] = { ...this.cachedTasks[index], ...updatedTask };
    }

    return updatedTask;
  }

  async delete(id: number): Promise<{ success: boolean }> {
    const result = await this.apiClient.delete<{ success: boolean }>(
      `${this.basePath}/${id}`,
    );

    if (result.success) {
      this.cachedTasks = this.cachedTasks.filter((task) => task.id !== id);
    }

    return result;
  }

  getCachedTasks(): Task[] {
    return [...this.cachedTasks];
  }

  /*

  select<K extends keyof Task>(keys?: K | K[]): TaskQueryBuilder<K> {
    const selectedFields = keys
      ? Array.isArray(keys)
        ? keys
        : [keys]
      : undefined;
    const apiClient = this.apiClient;
    const basePath = this.basePath;
    const querySerializer = this.querySerializer;
    const queryOptions: QueryOptions = {};
    queryOptions.select = { fields: selectedFields };
    return {
      where: (conditions: FilterQuery<Task>) => {
        const queryParams = {
          select: selectedFields,
          where: conditions,
        };
        console.log("In sdk in where :::", queryParams);

        return {
          async one(): Promise<Pick<Task, K> | null> {
            return apiClient.get<Pick<Task, K> | null>(
              `${basePath}/one`,
              querySerializer.serializeQuery(queryParams),
            );
          },

          async list(): Promise<Pick<Task, K>[]> {
            return apiClient.get<Pick<Task, K>[]>(
              basePath,
              querySerializer.serializeQuery(queryParams),
            );
          },

          async paginated(
            params?: PaginationParams,
          ): Promise<PaginatedResult<Pick<Task, K>>> {
            return apiClient.get<PaginatedResult<Pick<Task, K>>>(
              `${basePath}/paginated`,
              {
                ...querySerializer.serializeQuery(queryParams),
                ...querySerializer.serializeQuery(params),
              },
            );
          },
        };
      },

      async one(): Promise<Pick<Task, K> | null> {
        return apiClient.get<Pick<Task, K> | null>(`${basePath}/one`, {
          select: selectedFields,
        });
      },

      async list(): Promise<Pick<Task, K>[]> {
        return apiClient.get<Pick<Task, K>[]>(basePath, {
          select: selectedFields,
        });
      },

      async paginated(
        params?: PaginationParams,
      ): Promise<PaginatedResult<Pick<Task, K>>> {
        return apiClient.get<PaginatedResult<Pick<Task, K>>>(
          `${basePath}/paginated`,
          { select: selectedFields, ...querySerializer.serializeQuery(params) },
        );
      },
    };
  }
  */
}
