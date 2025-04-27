import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserModel } from '../_utils/models/root/user';
import { UsersMapper } from '../users/users.mapper';
import { AuthRepository } from './auth.repository';
import { UsersRepository } from '../users/users.repository';
import { SurrealService } from '../surreal/surreal.service';
import { PERMISSIONS_ENUM } from '../roles/utils/permissions.enum';
import { RolesRepository } from '../roles/roles.repository';

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
      return this.usersMapper.toPublicProfile(user);
    }
    return null;
  }

  login(user: Omit<UserModel, 'password'>) {
    const userWithRoles = this.usersRepository.findUserWithRolesById(user.id);
    if (!userWithRoles) {
      throw new Error('User not found');
    }
    const payload = {
      email: user.email,
      sub: user.id,
      role: { id: userWithRoles.role_id, name: userWithRoles.role_name },
    };
    const refreshToken = this.createOpaqueRefreshToken(user);
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: refreshToken,
      user,
    };
  }

  async refreshToken(refreshToken: string) {
    const user = this.getUserDataFromToken(refreshToken);
    if (!user) throw new Error();
    const payload = { email: user.email, sub: user.id };
    const newAccessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    return {
      access_token: newAccessToken,
    };
  }

  private createOpaqueRefreshToken(
    user: Omit<UserModel, 'password'>,
    clientId?: number,
  ): string {
    const tokenValue = crypto.randomBytes(40).toString('hex');

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS);

    this.authRepository.createRefreshToken(
      user.id,
      tokenValue,
      validUntil,
      clientId,
    );

    return tokenValue;
  }

  validateRefreshToken(token: string) {
    console.log('invalidaterefreshtoken ::: ', token);
    const tokenRecord = this.authRepository.findToken(token);
    console.log('TOKEN RECORD : ', tokenRecord);
    if (
      !tokenRecord ||
      new Date() > new Date(tokenRecord.expires_at) ||
      tokenRecord.revoked_at
    ) {
      return null;
    }
    return tokenRecord;
  }

  generateThirdPartyTokens(
    clientIdentifier: string,
    scopes: string,
    user: Omit<UserModel, 'password'>,
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

  getUserDataFromToken(token: string): UserModel | null {
    try {
      const tokenRecord = this.authRepository.findToken(token);
      console.log('TOKEN RECORD : ', tokenRecord);
      if (
        !tokenRecord ||
        new Date() > new Date(tokenRecord.expires_at) ||
        tokenRecord.revoked_at
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
