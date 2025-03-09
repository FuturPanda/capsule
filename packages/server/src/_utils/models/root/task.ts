export class Task {
  id: number;
  content: string;
  assignee?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  progress?: number;
  is_completed?: boolean;
  completed_at?: string;
}
