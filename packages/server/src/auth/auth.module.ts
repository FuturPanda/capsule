import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './_utils/constants/jwt.constants';
import { JwtStrategy } from './_utils/guards/jwt.strategy';
import { RefreshTokenStrategy } from './_utils/guards/refresh-token.strategy';
import { AuthService } from './auth.service';
import { ApiKeysModule } from '../api-keys/api-keys.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    }),
    ApiKeysModule,
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
