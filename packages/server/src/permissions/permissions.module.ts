import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { ChiselModule } from '../chisel/chisel.module';
import { DatabasePermission } from '../_utils/models/root/database_permission';
import { ApiKeyPermission } from '../_utils/models/root/api_key_permission';
import { Permission } from '../_utils/models/root/permission';
import { PermissionsRepository } from './permissions.repository';

@Module({
  imports: [
    ChiselModule.forFeature(DatabasePermission, ApiKeyPermission, Permission),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository],
  exports: [PermissionsService, PermissionsRepository],
})
export class PermissionsModule {}
