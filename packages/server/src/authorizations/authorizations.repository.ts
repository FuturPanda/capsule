import { Injectable } from '@nestjs/common';
import { InjectModel } from '../chisel/chisel.module';
import { ChiselModel } from '@capsulesh/chisel';
import {
  AuthorizationModel,
  ResourceClientAuthorizationModel,
} from '../_utils/models/root/authorization';

@Injectable()
export class AuthorizationsRepository {
  constructor(
    @InjectModel(AuthorizationModel.name)
    private readonly permissionModel: ChiselModel<AuthorizationModel>,
    @InjectModel(ResourceClientAuthorizationModel.name)
    private readonly databasePermissionModel: ChiselModel<ResourceClientAuthorizationModel>,
  ) {}

  createPermissions = (rows: { name: string; type: string }[]) =>
    this.permissionModel.insertMany(rows);

  addPermissionToDatabase = (databaseId: number, permissionId: number) => ({});
  // this.databasePermissionModel.insert({
  //   database_id: databaseId,
  //   permission_id: permissionId,
  // });
}
