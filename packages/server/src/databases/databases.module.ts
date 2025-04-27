import { Module } from '@nestjs/common';
import { ResourcesModule } from 'src/resources/resources.module';
import { DatabaseModel } from '../_utils/models/root/database';
import { ChiselModule } from '../chisel/chisel.module';
import { DatabasesController } from './databases.controller';
import { DatabasesMapper } from './databases.mapper';
import { DatabasesRepository } from './databases.repository';
import { DatabasesService } from './databases.service';

@Module({
  imports: [ChiselModule.forFeature(DatabaseModel), ResourcesModule],
  controllers: [DatabasesController],
  providers: [DatabasesService, DatabasesRepository, DatabasesMapper],
  exports: [DatabasesService, DatabasesRepository, DatabasesMapper],
})
export class DatabasesModule {}
