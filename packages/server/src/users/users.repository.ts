import { ChiselModel } from '@capsule/chisel';
import { Injectable } from '@nestjs/common';
import { User } from 'src/models/root/user';
import { UserTypeEnum } from '../_utils/schemas/root.schema';
import { InjectModel } from '../chisel/chisel.module';
import { CreateUserDto } from './_utils/dto/request/create-user.dto';

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
        api_key: createUserDto.apiKey,
        siret: createUserDto.siret,
        schema: createUserDto.schema,
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
