import { CreateTask } from '@capsulesh/shared-types';

export class CreateTaskDto implements CreateTask {
  assignee?: string;
  content?: string;
  dueDate: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  progress?: number;
  isCompleted?: boolean;
}
