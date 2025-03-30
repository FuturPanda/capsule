import { Injectable } from '@nestjs/common';
import { Task } from 'src/_utils/models/root/task';

@Injectable()
export class TasksMapper {
  constructor() {}

  toGetTasksDto(tasks: Task[]) {
    return tasks.map((task) => this.toGetTaskDto(task));
  }

  toGetTaskDto(task: Task) {
    return {
      id: task.id,
      assignee: task.assignee,
      content: task.content,
      dueDate: task.due_date,
      priority: task.priority,
      progress: task.progress,
      isCompleted: task.is_completed,
      completedAt: task.completed_at,
    };
  }
}
