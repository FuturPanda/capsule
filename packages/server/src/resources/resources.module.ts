import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { ChiselModule } from '../chisel/chisel.module';
import { Database } from '../models/root/database';
import { Resource } from '../models/root/resource';
import { ResourcesRepository } from './resources.repository';

@Module({
  imports: [ChiselModule.forFeature(Database, Resource)],
  controllers: [ResourcesController],
  providers: [ResourcesService, ResourcesRepository],
})
export class ResourcesModule {}
