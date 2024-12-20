import { UserTypeEnum } from '../../../../_utils/schemas/root.schema';

export class RegisterUserDto {
  email: string;
  password: string;
  type: UserTypeEnum;
}
