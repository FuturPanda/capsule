import { Module } from '@nestjs/common';
import { Task } from 'src/_utils/models/root/task';
import { ChiselModule } from 'src/chisel/chisel.module';
import { TasksController } from './tasks.controller';
import { TasksMapper } from './tasks.mapper';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [ChiselModule.forFeature(Task)],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, TasksMapper],
  exports: [TasksService, TasksRepository, TasksMapper],
})
export class TasksModule {}
