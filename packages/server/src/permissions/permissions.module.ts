import { Module } from '@nestjs/common';
import { ApiKeyPermission } from '../_utils/models/root/api_key_permission';
import { DatabasePermission } from '../_utils/models/root/database_permission';
import { Permission } from '../_utils/models/root/permission';
import { ChiselModule } from '../chisel/chisel.module';
import { PermissionsRepository } from './permissions.repository';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [
    ChiselModule.forFeature(DatabasePermission, ApiKeyPermission, Permission),
  ],
  providers: [PermissionsService, PermissionsRepository],
  exports: [PermissionsService, PermissionsRepository],
})
export class PermissionsModule {}
