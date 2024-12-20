import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { DatabasesRepository } from './databases.repository';
import { ChiselModule } from '../chisel/chisel.module';
import { Database } from '../_utils/models/root/database';
import { EntityAttribute } from '../_utils/models/root/entity_attribute';
import { DatabasesMapper } from './databases.mapper';
import { DatabaseEntity } from '../_utils/models/root/entity';

@Module({
  imports: [ChiselModule.forFeature(Database, EntityAttribute, DatabaseEntity)],
  controllers: [DatabasesController],
  providers: [DatabasesService, DatabasesRepository, DatabasesMapper],
  exports: [DatabasesService, DatabasesRepository, DatabasesMapper],
})
export class DatabasesModule {}
