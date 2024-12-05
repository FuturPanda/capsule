import { ChiselModel } from '@capsule/chisel';
import { Injectable } from '@nestjs/common';
import { UserTypeEnum } from '../_utils/schemas/root.schema';
import { InjectModel } from '../chisel/chisel.module';
import { CreateUserDto } from './_utils/dto/request/create-user.dto';
import { User } from '../_utils/models/root/user';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly model: ChiselModel<User>,
  ) {}

  createUserIfNotExists = (createUserDto: CreateUserDto, type: UserTypeEnum) =>
    this.model.insert(
      {
        email: createUserDto.email,
        password: createUserDto.password,
        siret: createUserDto.siret,
        type: type,
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
      .exec({ one: true }) as User | null;

  findOneById = (id: number) =>
    this.model
      .select()
      .where({ id: { $eq: id } })
      .exec({ one: true }) as User | null;
}
