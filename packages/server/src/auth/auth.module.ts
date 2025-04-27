import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './_utils/constants/jwt.constants';
import { JwtStrategy } from './_utils/guards/jwt.strategy';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { ChiselModule } from '../chisel/chisel.module';
import { ClientModel, OauthClients } from '../_utils/models/root/oauth_clients';
import {
  OauthRefreshToken,
  RefreshTokenModel,
} from '../_utils/models/root/oauth_refresh_token';
import { OauthAuthorization } from '../_utils/models/root/oauth_authorization';
import {
  AuthorizationModel,
  ResourceClientAuthorizationModel,
} from '../_utils/models/root/authorization';

@Module({
  imports: [
    UsersModule,
    ChiselModule.forFeature(
      OauthClients,
      OauthAuthorization,
      OauthRefreshToken,
      AuthorizationModel,
      RefreshTokenModel,
      ResourceClientAuthorizationModel,
      ClientModel,
    ),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, AuthRepository],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
