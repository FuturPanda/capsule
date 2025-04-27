import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { ResourceModel } from '../_utils/models/root/resource';
import { ChiselModule } from '../chisel/chisel.module';
import { ResourcesRepository } from './resources.repository';

@Module({
  imports: [ChiselModule.forFeature(ResourceModel)],
  controllers: [ResourcesController],
  providers: [ResourcesService, ResourcesRepository],
  exports: [ResourcesService, ResourcesRepository],
})
export class ResourcesModule {}
