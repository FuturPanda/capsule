import { ChiselModel } from '@capsulesh/chisel';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '../chisel/chisel.module';
import {
  PermissionModel,
  RoleModel,
  RolePermissionModel,
  UserRoleModel,
} from '../_utils/models/root/role';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectModel(RoleModel.name)
    private readonly roleModel: ChiselModel<RoleModel>,
    @InjectModel(PermissionModel.name)
    private readonly permissionModel: ChiselModel<PermissionModel>,
    @InjectModel(RolePermissionModel.name)
    private readonly rolePermissionModel: ChiselModel<RolePermissionModel>,
    @InjectModel(UserRoleModel.name)
    private readonly userRoleModel: ChiselModel<UserRoleModel>,
  ) {}

  createRole(name: string) {
    return this.roleModel.insert({ name }, { ignoreExisting: true });
  }

  createPermission(name: string) {
    return this.permissionModel.insert({ name }, { ignoreExisting: true });
  }

  addPermissionToRole(roleId: number, permissionId: number) {
    return this.rolePermissionModel.insert(
      {
        role_id: roleId,
        permission_id: permissionId,
      },
      { ignoreExisting: true },
    );
  }

  giveRoleToUser(userId: number, roleId: number) {
    return this.userRoleModel.insert(
      {
        user_id: userId,
        role_id: roleId,
      },
      { ignoreExisting: true },
    );
  }

  getUserRoles(userId: number) {
    const userRoles = this.userRoleModel
      .select()
      .where({ user_id: { $eq: userId } })
      .join(RoleModel, UserRoleModel, 'id', 'role_id')
      .exec({ one: true });

    return userRoles ? userRoles.role_id : null;
  }
}
