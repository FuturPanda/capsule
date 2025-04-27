import { Module } from '@nestjs/common';
import { ChiselModule } from 'src/chisel/chisel.module';
import { ResourcesModule } from 'src/resources/resources.module';
import { TaskModel } from '../_utils/models/root/task';
import { TasksController } from './tasks.controller';
import { TasksMapper } from './tasks.mapper';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [ChiselModule.forFeature(TaskModel), ResourcesModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, TasksMapper],
  exports: [TasksService, TasksRepository, TasksMapper],
})
export class TasksModule {}
