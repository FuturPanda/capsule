import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from './_utils/dto/request/login-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    console.log('before auth : ', user);
    return this.authService.login(user);
  }

  validateUserConnection(refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
