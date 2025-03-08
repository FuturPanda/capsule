import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { SurrealService } from 'src/surreal/surreal.service';
import { UsersRepository } from 'src/users/users.repository';
import { User } from '../_utils/models/root/user';
import { UsersMapper } from '../users/users.mapper';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;
  private readonly THIRD_PARTY_TOKEN_EXPIRY_DAYS = 7;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly usersMapper: UsersMapper,
    private readonly authRepository: AuthRepository,
    private readonly surrealService: SurrealService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.usersRepository.findOneByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      this.logger.log(`User ${email} has been found`);
      return this.usersMapper.toPublicProfile(user);
    }
    return null;
  }

  login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id };
    const refreshToken = this.createOpaqueRefreshToken(user);
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: refreshToken,
      user,
    };
  }

  async refreshToken(refreshToken: string) {
    const user = this.getUserDataFromToken(refreshToken);
    const payload = { email: user.email, sub: user.id };
    const newAccessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    return {
      access_token: newAccessToken,
    };
  }

  private createOpaqueRefreshToken(user: Omit<User, 'password'>): string {
    const tokenValue = crypto.randomBytes(40).toString('hex');

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS);

    this.authRepository.createRefreshToken(user.id, tokenValue, validUntil);

    return tokenValue;
  }

  validateRefreshToken(token: string) {
    const tokenRecord = this.authRepository.findToken(token);
    console.log('TOKEN RECORD : ', tokenRecord);
    if (
      !tokenRecord ||
      new Date() > tokenRecord.validUntil ||
      tokenRecord.deletedAt
    ) {
      throw new Error('Invalid or expired refresh token');
    }
    return tokenRecord;
  }

  generateThirdPartyTokens(
    clientIdentifier: string,
    scopes: string,
    user: User,
  ) {
    const validUntil = new Date();
    validUntil.setDate(
      validUntil.getDate() + this.THIRD_PARTY_TOKEN_EXPIRY_DAYS,
    );
    const payload = {
      clientIdentifier,
      scopes,
    };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.createOpaqueRefreshToken(user),
      user,
    };
  }

  getUserDataFromToken(token: string): User | null {
    try {
      const tokenRecord = this.authRepository.findToken(token);
      console.log('TOKEN RECORD : ', tokenRecord);
      if (
        !tokenRecord ||
        new Date() > tokenRecord.validUntil ||
        tokenRecord.deletedAt
      ) {
        return null;
      }
      const user = this.usersRepository.findOneById(tokenRecord.user_id);
      console.log('USER : ', user);
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
