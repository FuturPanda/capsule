import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersMapper: UsersMapper,
    private readonly jwtService: JwtService,
  ) {}
  /*
  createUser = (createUserDto: CreateUserDto) =>
    this.usersRepository.createUser(createUserDto).then((user) => this.usersMapper.toGetUserDto(user[0]));
  /*
  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.usersRepository.getUserByEmailOrThrow(loginUserDto.mail);
    //const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Unauthorized');
    const payload = { sub: user._id, username: user.mail };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: this.usersMapper.toGetUserDto(user),
    };
    return user;

  }*/
}
