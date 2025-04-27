import { Task } from '@capsulesh/shared-types';

export class TaskModel implements Task {
  id: number | bigint;
  content: string;
  due_date: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  progress?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  completed_at?: string;
  completed_by?: number;
}

export class AssigneeTaskModel {
  person_id: number;
  task_id: number;
}
