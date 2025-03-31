export interface Task {
  id: number;
  content: string;
  due_date: string | null;
  assignee?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  progress?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  completed_at?: string;
}

export interface GetTask {
  id: number;
  content: string;
  assignee: string | null;
  dueDate: string | null;
  priority: string | null;
  progress: number | null;
  completedAt: string | null;
}

export interface CreateTask {
  assignee?: string;
  content?: string;
  dueDate: string | null;
  priority?: "low" | "medium" | "high" | "urgent";
  progress?: number;
  isCompleted?: boolean;
}

export interface UpdateTask {
  assignee?: string;
  content?: string;
  dueDate?: string | null;
  priority?: "low" | "medium" | "high" | "urgent";
  progress?: number;
  isCompleted?: boolean;
}
