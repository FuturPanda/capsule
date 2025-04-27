import { Injectable } from '@nestjs/common';
import { TaskModel } from '../_utils/models/root/task';

@Injectable()
export class TasksMapper {
  constructor() {}

  toGetTasksDto(tasks: TaskModel[]) {
    return tasks.map((task) => this.toGetTaskDto(task));
  }

  toGetTaskDto(task: TaskModel) {
    return {
      id: task.id,
      content: task.content,
      dueDate: task.due_date,
      priority: task.priority,
      progress: task.progress,
      isCompleted: !!task.completed_at,
      completedAt: task.completed_at,
    };
  }
}
