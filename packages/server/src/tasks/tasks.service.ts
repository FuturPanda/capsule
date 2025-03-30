import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskEvents } from 'src/_utils/decorators/event-emitter.decorator';
import { QueryOptionsDto } from 'src/dynamic-queries/_utils/dto/request/query-options.dto';
import { CreateTaskDto } from './dto/request/create-task.dto';
import { UpdateTaskDto } from './dto/request/update-task.dto';
import { TasksMapper } from './tasks.mapper';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tasksRepository: TasksRepository,
    private readonly tasksMapper: TasksMapper,
  ) {}

  @TaskEvents.emitCreated()
  async createTask(createTaskDto: CreateTaskDto) {
    const result = this.tasksRepository.createTask(createTaskDto);
    const createdTask = this.tasksRepository.findTaskById(result.id);
    return this.tasksMapper.toGetTaskDto(createdTask);
  }

  @TaskEvents.emitUpdated()
  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    console.log('updating ::: ', updateTaskDto);
    this.tasksRepository.updateTaskById(id, updateTaskDto);
    const updatedTask = this.tasksRepository.findTaskById(id);
    return this.tasksMapper.toGetTaskDto(updatedTask);
  }

  @TaskEvents.emitDeleted()
  async deleteTask(id: number) {
    this.tasksRepository.deleteTaskById(id);
    return id;
  }

  getPaginatedTasks(queryParams: any) {
    return this.tasksRepository.findAllTasks();
  }

  getOneTask(queryParams: any) {
    throw new Error('Method not implemented.');
  }

  listTasks(queryOptions: QueryOptionsDto) {
    const tasks = this.tasksRepository.findAllTasks(queryOptions);
    console.log('List tasksssss', tasks);
    if (!tasks) return;
    return this.tasksMapper.toGetTasksDto(tasks);
  }
}
