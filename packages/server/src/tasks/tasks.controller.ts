import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { QueryOptionsDto } from 'src/dynamic-queries/_utils/dto/request/query-options.dto';
import { CreateTaskDto } from './dto/request/create-task.dto';
import { UpdateTaskDto } from './dto/request/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  listTasks(@Query() queryOptions: QueryOptionsDto) {
    console.log('Query params::::::', JSON.stringify(queryOptions));
    return this.tasksService.listTasks(queryOptions);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('one')
  getOneTask(@Query() queryParams: any) {
    return this.tasksService.getOneTask(queryParams);
  }

  @Patch(':id')
  updateTask(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: number) {
    return this.tasksService.deleteTask(id);
  }

  @Get('tasks/paginated')
  getPaginatedTasks(@Query() queryParams: any) {
    return this.tasksService.getPaginatedTasks(queryParams);
  }
}
