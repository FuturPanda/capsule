import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  constructor() {}

  async getAllTasks(page: number, limit: number) {
    return {
      data: [
        {
          id: '1',
          title: 'Complete project proposal',
          description: 'Finalize the project proposal document',
          dueDate: '2025-07-20T23:59:59Z',
          assignee: 'user1',
          priority: 'high',
          progress: 50,
          completed: false,
          type: 'task',
          createdAt: '2025-07-10T10:00:00Z',
          updatedAt: '2025-07-12T15:30:00Z',
        },
      ],
      meta: {
        total: 1,
        page,
        limit,
        totalPages: 1,
      },
    };
  }

  async getTaskById(id: string) {
    return {
      id,
      title: 'Complete project proposal',
      description: 'Finalize the project proposal document',
      dueDate: '2025-07-20T23:59:59Z',
      assignee: 'user1',
      priority: 'high',
      progress: 50,
      completed: false,
      type: 'task',
      createdAt: '2025-07-10T10:00:00Z',
      updatedAt: '2025-07-12T15:30:00Z',
    };
  }

  async markTaskAsCompleted(id: string) {
    return {
      id,
      title: 'Complete project proposal',
      description: 'Finalize the project proposal document',
      dueDate: '2025-07-20T23:59:59Z',
      assignee: 'user1',
      priority: 'high',
      progress: 100,
      completed: true,
      completedAt: new Date().toISOString(),
      type: 'task',
      createdAt: '2025-07-10T10:00:00Z',
      updatedAt: new Date().toISOString(),
    };
  }

  async getTasksByAssignee(assigneeId: string, page: number, limit: number) {
    return {
      data: [
        {
          id: '1',
          title: 'Complete project proposal',
          description: 'Finalize the project proposal document',
          dueDate: '2025-07-20T23:59:59Z',
          assignee: assigneeId,
          priority: 'high',
          progress: 50,
          completed: false,
          type: 'task',
          createdAt: '2025-07-10T10:00:00Z',
          updatedAt: '2025-07-12T15:30:00Z',
        },
      ],
      meta: {
        total: 1,
        page,
        limit,
        totalPages: 1,
      },
    };
  }

  async getTasksDueSoon(days: number) {
    return [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Finalize the project proposal document',
        dueDate: '2025-07-20T23:59:59Z',
        assignee: 'user1',
        priority: 'high',
        progress: 50,
        completed: false,
        type: 'task',
      },
    ];
  }

  async getOverdueTasks() {
    return [
      {
        id: '2',
        title: 'Submit expense report',
        description: 'Submit monthly expense report',
        dueDate: '2025-07-05T23:59:59Z',
        assignee: 'user1',
        priority: 'medium',
        progress: 25,
        completed: false,
        type: 'task',
      },
    ];
  }

  async createTask(createTaskDto: any) {
    return {
      id: '3',
      ...createTaskDto,
      type: 'task',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
