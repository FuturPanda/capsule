import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('events/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.tasksService.getAllTasks(page, limit);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Post(':id/complete')
  markAsCompleted(@Param('id') id: string) {
    return this.tasksService.markTaskAsCompleted(id);
  }

  @Get('assignee/:assigneeId')
  getTasksByAssignee(
    @Param('assigneeId') assigneeId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.tasksService.getTasksByAssignee(assigneeId, page, limit);
  }

  @Get('due-soon')
  getTasksDueSoon(@Query('days') days: number = 7) {
    return this.tasksService.getTasksDueSoon(days);
  }

  @Get('overdue')
  getOverdueTasks() {
    return this.tasksService.getOverdueTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: any) {
    return this.tasksService.createTask(createTaskDto);
  }
}
