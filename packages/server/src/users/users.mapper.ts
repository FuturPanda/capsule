import { Injectable } from '@nestjs/common';
import { User } from 'src/models/root/user';
import { GetUserDto } from './_utils/dto/response/get-user.dto';

@Injectable()
export class UsersMapper {
  toGetUserDto = (user: User): GetUserDto => ({
    id: user.id,
    userName: null,
    email: user.email,
  });
}
