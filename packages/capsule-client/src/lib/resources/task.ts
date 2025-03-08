import { ApiClient } from "../axios";
import { ListResponse, PaginationParams } from "../types";
import { BaseResource } from "./base";
import { CreateEventParams, Event, UpdateEventParams } from "./event";

export interface Task extends Event {
  // Task extends Event and adds its own properties
  assignee?: string; // User ID of the person assigned to the task
  dueDate?: string; // ISO date string
  priority?: "low" | "medium" | "high" | "urgent";
  progress?: number; // 0-100 percentage
  completed?: boolean;
  completedAt?: string; // ISO date string
  checklist?: {
    // Optional sub-tasks
    id: string;
    description: string;
    completed: boolean;
  }[];
  // Override the type property to always be 'task'
  type: "task";
}

export interface CreateTaskParams extends CreateEventParams {
  assignee?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  progress?: number;
  completed?: boolean;
  checklist?: {
    description: string;
    completed?: boolean;
  }[];
}

export interface UpdateTaskParams extends UpdateEventParams {
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

export class Tasks extends BaseResource<
  Task,
  CreateTaskParams,
  UpdateTaskParams
> {
  constructor(apiClient: ApiClient) {
    // Tasks are stored as a subset of events in the API
    super(apiClient, "/events/tasks");
  }

  // Override the list method to ensure we only get tasks
  async list(params?: PaginationParams): Promise<ListResponse<Task>> {
    return this.apiClient.get<ListResponse<Task>>(this.basePath, params);
  }

  // Task-specific methods
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
