import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { OauthAuthorization } from 'src/_utils/models/root/oauth_authorization';
import { OauthClients } from 'src/_utils/models/root/oauth_clients';
import { OauthRefreshToken } from 'src/_utils/models/root/oauth_refresh_token';
import { ChiselModule } from 'src/chisel/chisel.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './_utils/constants/jwt.constants';
import { JwtStrategy } from './_utils/guards/jwt.strategy';
import { RefreshTokenStrategy } from './_utils/guards/refresh-token.strategy';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    ChiselModule.forFeature(
      OauthClients,
      OauthAuthorization,
      OauthRefreshToken,
    ),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    }),
    ApiKeysModule,
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy, AuthRepository],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
