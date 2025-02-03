import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from './_utils/dto/request/login-user.dto';
import { UsersRepository } from './users.repository';
import { UsersMapper } from './users.mapper';
import { UpdateProfileDto } from './_utils/dto/request/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly usersMapper: UsersMapper,
  ) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    return this.authService.login(user);
  }

  validateUserConnection(refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  getOwnerPublicProfile() {
    const user = this.usersRepository.getOwner();
    return this.usersMapper.toPublicProfile(user);
  }

  updateOwnerProfile(updateProfileDto: UpdateProfileDto) {
    const user = this.usersRepository.updateUser(1, updateProfileDto);
    return this.usersMapper.toPublicProfile(user);
  }
}
