import { Injectable } from '@nestjs/common';
import { GetUserDto } from './_utils/dto/response/get-user.dto';
import { User } from '../_utils/models/root/user';

@Injectable()
export class UsersMapper {
  toGetUserDto = (user: User): GetUserDto => ({
    id: user.id,
    userName: null,
    email: user.email,
  });
}
