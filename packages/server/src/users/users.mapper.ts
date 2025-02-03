import { Injectable } from '@nestjs/common';
import { GetUserDto } from './_utils/dto/response/get-user.dto';
import { User } from '../_utils/models/root/user';
import { GetUserProfileDto } from './_utils/dto/response/get-profile.dto';

@Injectable()
export class UsersMapper {
  toGetUserDto = (user: User): GetUserDto => ({
    id: user.id,
    username: user.username,
    email: user.email,
  });

  toPublicProfile = (user: User): GetUserProfileDto => ({
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatar_url,
    description: user.description,
  });
}
