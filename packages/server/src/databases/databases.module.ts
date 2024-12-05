import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { DatabasesRepository } from './databases.repository';
import { ChiselModule } from '../chisel/chisel.module';
import { Database } from '../_utils/models/root/database';
import { Entity } from '../_utils/models/root/entity';
import { EntityAttribute } from '../_utils/models/root/entity_attribute';

@Module({
  imports: [ChiselModule.forFeature(Database, Entity, EntityAttribute)],
  controllers: [DatabasesController],
  providers: [DatabasesService, DatabasesRepository],
  exports: [DatabasesService, DatabasesRepository],
})
export class DatabasesModule {}
