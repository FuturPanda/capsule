import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'src/users/users.repository';
import { User } from '../_utils/models/root/user';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { UsersMapper } from '../users/users.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly apiKeysService: ApiKeysService,
    private readonly usersMapper: UsersMapper,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.usersRepository.findOneByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return this.usersMapper.toPublicProfile(user);
    }
    return null;
  }

  login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
      user,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = { email: payload.email, sub: payload.sub };
      return {
        access_token: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
