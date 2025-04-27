import { ChiselModel } from '@capsulesh/chisel';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '../chisel/chisel.module';
import { CreateUserDto } from './_utils/dto/request/create-user.dto';
import { UserModel } from '../_utils/models/root/user';
import { RoleModel, UserRoleModel } from '../_utils/models/root/role';
import { UpdateProfileDto } from './_utils/dto/request/update-profile.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel.name) private readonly model: ChiselModel<UserModel>,
  ) {}

  createUserIfNotExists = (createUserDto: CreateUserDto) =>
    this.model.insert(
      {
        email: createUserDto.email,
        password: createUserDto.password,
      },
      { ignoreExisting: true },
    );

  getOwner = () =>
    this.model
      .select()
      .where({ type: { $eq: 'OWNER' } })
      .exec({ one: true });

  findOneByEmail = (email: string) =>
    this.model
      .select()
      .where({ email: { $eq: email } })
      .exec({ one: true }) as UserModel | null;

  findOneById = (id: number) =>
    this.model
      .select()
      .where({ id: { $eq: id } })
      .exec({ one: true }) as UserModel | null;

  findUserWithRolesById = (id: number) =>
    this.model
      .select({
        id: 'user.id',
        email: 'user.email',
        username: 'user.username',
        description: 'user.description',
        avatar_url: 'user.avatar_url',
        role_id: 'role.id',
        role_name: 'role.name',
      })
      .join(UserModel, UserRoleModel, 'id', 'user_id')
      .join(UserRoleModel, RoleModel, 'role_id', 'id')
      .where({ id: { $eq: id } })
      .exec({ one: true });

  updateUser = (id: number, updateProfileDto: UpdateProfileDto) =>
    this.model
      .update({
        ...(updateProfileDto.avatarUrl && {
          avatar_url: updateProfileDto.avatarUrl,
        }),
        ...(updateProfileDto.username && {
          username: updateProfileDto.username,
        }),
        ...(updateProfileDto.description && {
          description: updateProfileDto.description,
        }),
      })
      .where({ id: { $eq: id } })
      .exec({ one: true }) as UserModel;
}
