import { Injectable } from '@nestjs/common';
import { InjectModel } from '../chisel/chisel.module';
import { Permission } from '../_utils/models/root/permission';
import { ChiselModel } from '@capsulesh/chisel';
import { ApiKeyPermission } from '../_utils/models/root/api_key_permission';
import { DatabasePermission } from '../_utils/models/root/database_permission';

@Injectable()
export class PermissionsRepository {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: ChiselModel<Permission>,
    @InjectModel(ApiKeyPermission.name)
    private readonly apiKeyPermissionModel: ChiselModel<ApiKeyPermission>,
    @InjectModel(DatabasePermission.name)
    private readonly databasePermissionModel: ChiselModel<DatabasePermission>,
  ) {}

  createPermissions = (rows: { name: string; type: string }[]) =>
    this.permissionModel.insertMany(rows);

  addPermissionToApiKey = (permissionId: number, apiKeyId: string) =>
    this.apiKeyPermissionModel.insert({
      permission_id: permissionId,
      api_key_id: apiKeyId,
    });
  addPermissionToDatabase = (databaseId: number, permissionId: number) =>
    this.databasePermissionModel.insert({
      database_id: databaseId,
      permission_id: permissionId,
    });
}
