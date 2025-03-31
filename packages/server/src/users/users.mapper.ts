import { Injectable } from '@nestjs/common';
import { GetUserDto } from './_utils/dto/response/get-user.dto';
import { GetUserProfileDto } from './_utils/dto/response/get-profile.dto';
import { UserModel } from '../_utils/models/root/user';

@Injectable()
export class UsersMapper {
  toGetUserDto = (user: UserModel): GetUserDto => ({
    id: user.id,
    username: user.username,
    email: user.email,
  });

  toPublicProfile = (user: UserModel): GetUserProfileDto => ({
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatar_url,
    description: user.description,
  });
}
