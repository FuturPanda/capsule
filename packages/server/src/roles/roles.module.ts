import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import {
  RoleModel,
  RolePermissionModel,
  PermissionModel,
  UserRoleModel,
} from '../_utils/models/root/role';
import { ChiselModule } from '../chisel/chisel.module';
import { RolesRepository } from './roles.repository';

@Module({
  imports: [
    ChiselModule.forFeature(
      RoleModel,
      RolePermissionModel,
      PermissionModel,
      UserRoleModel,
    ),
  ],
  providers: [RolesService, RolesRepository],
  exports: [RolesService, RolesRepository],
})
export class RolesModule {}
