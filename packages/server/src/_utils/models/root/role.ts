import { PERMISSIONS_ENUM } from '../../../roles/utils/permissions.enum';

export class PermissionModel {
  id: number;
  name: PERMISSIONS_ENUM;
}

export class RoleModel {
  id: number;
  name?: string;
}

export class UserRoleModel {
  user_id: number;
  role_id: number;
}

export class RolePermissionModel {
  role_id: number;
  permission_id: number;
}
