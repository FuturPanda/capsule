import { ChiselModel } from '@capsulesh/chisel';
import { Injectable } from '@nestjs/common';
import { convertQueryOptionsToFilterQuery } from 'src/_utils/functions/query-options-transformation';
import { Task } from 'src/_utils/models/root/task';
import { QueryOptionsDto } from 'src/dynamic-queries/_utils/dto/request/query-options.dto';
import { InjectModel } from '../chisel/chisel.module';
import { CreateTaskDto } from './dto/request/create-task.dto';
import { UpdateTaskDto } from './dto/request/update-task.dto';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectModel(Task.name) private readonly model: ChiselModel<Task>,
  ) {}

  createTask = (dto: CreateTaskDto) =>
    this.model.insert({
      content: dto.content,
      ...(dto.assignee && { assignee: dto.assignee }),
      ...(dto.dueDate && { due_date: dto.dueDate }),
      ...(dto.priority && { priority: dto.priority }),
      ...(dto.progress && { progress: dto.progress }),
      ...(dto.isCompleted && { is_completed: dto.isCompleted, progress: 100 }),
    });

  findAllTasks(queryOptions?: QueryOptionsDto): Task[] {
    const filterQuery = convertQueryOptionsToFilterQuery(queryOptions);
    return this.model.select().where(filterQuery).exec();
  }

  findTaskById = (id: number | bigint): Task =>
    this.model
      .select()
      .where({ id: { $eq: id } })
      .exec({ one: true });

  updateTaskById = (id: number, dto: UpdateTaskDto) =>
    this.model
      .update({
        ...(dto.content && { content: dto.content }),
        ...(dto.assignee && { assignee: dto.assignee }),
        ...(dto.dueDate && { due_date: dto.dueDate }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.progress && { progress: dto.isCompleted ? 100 : dto.progress }),
        is_completed: dto.isCompleted,
      })
      .where({ id: { $eq: id } })
      .exec();

  deleteTaskById = (id: number) =>
    this.model
      .delete()
      .where({ id: { $eq: id } })
      .exec();
}
