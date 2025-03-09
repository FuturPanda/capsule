import { UpdateTask } from '@capsulesh/shared-types';
import { IsOptional } from 'class-validator';

export class UpdateTaskDto implements UpdateTask {
  assignee?: string;
  content?: string;
  @IsOptional()
  dueDate?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  progress?: number;
  isCompleted?: boolean;
}
