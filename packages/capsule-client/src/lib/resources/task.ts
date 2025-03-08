import { ApiClient } from "../axios";
import { ListResponse, PaginationParams } from "../types";
import { BaseResource } from "./base";
import { CreateEventParams, Event, UpdateEventParams } from "./event";

export interface Task extends Event {
  assignee?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  progress?: number;
  completed?: boolean;
  completedAt?: string;
  type: "task";
}

export interface CreateTaskDto extends CreateEventParams {
  assignee?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  progress?: number;
  completed?: boolean;
}

export interface UpdateTaskDto extends UpdateEventParams {
  assignee?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  progress?: number;
  completed?: boolean;
  completedAt?: string;
  checklist?: {
    id?: string;
    description?: string;
    completed?: boolean;
  }[];
}

export class Tasks extends BaseResource<Task, CreateTaskDto, UpdateTaskDto> {
  constructor(apiClient: ApiClient) {
    super(apiClient, "/events/tasks");
  }

  async list(params?: PaginationParams): Promise<ListResponse<Task>> {
    return this.apiClient.get<ListResponse<Task>>(this.basePath, params);
  }

  async markAsCompleted(id: string): Promise<Task> {
    return this.apiClient.post<Task>(`${this.basePath}/${id}/complete`);
  }

  async getByAssignee(
    assigneeId: string,
    params?: PaginationParams,
  ): Promise<ListResponse<Task>> {
    return this.apiClient.get<ListResponse<Task>>(
      `${this.basePath}/assignee/${assigneeId}`,
      params,
    );
  }

  async getDueSoon(days: number = 7): Promise<Task[]> {
    return this.apiClient.get<Task[]>(`${this.basePath}/due-soon`, { days });
  }

  async getOverdue(): Promise<Task[]> {
    return this.apiClient.get<Task[]>(`${this.basePath}/overdue`);
  }
}
