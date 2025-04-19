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
import { Protect } from 'src/auth/_utils/guards/protect.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  listTasks(@Query() queryOptions: QueryOptionsDto) {
    return this.tasksService.listTasks(queryOptions);
  }

  @Protect()
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Protect()
  @Get('one')
  getOneTask(@Query() queryParams: any) {
    return this.tasksService.getOneTask(queryParams);
  }

  @Protect()
  @Patch(':id')
  updateTask(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Protect()
  @Delete(':id')
  deleteTask(@Param('id') id: number) {
    return this.tasksService.deleteTask(id);
  }

  @Protect()
  @Get('tasks/paginated')
  getPaginatedTasks(@Query() queryParams: any) {
    return this.tasksService.getPaginatedTasks(queryParams);
  }
}
