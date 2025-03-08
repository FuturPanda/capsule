import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { SurrealService } from 'src/surreal/surreal.service';
import { v4 } from 'uuid';
import { LoginUserDto } from './_utils/dto/request/login-user.dto';
import { UpdateProfileDto } from './_utils/dto/request/update-profile.dto';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly usersMapper: UsersMapper,
    private readonly permissionService: PermissionsService,
    private readonly surrealService: SurrealService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    console.log(user);
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

  async manageConsentRequest(query: any, refreshToken: string) {
    if (!query.session_id) {
      throw new UnauthorizedException('Invalid session');
    }
    const sessionData = await this.surrealService.getSessionById(
      query.session_id,
    );
    if (!sessionData) {
      throw new UnauthorizedException('Session expired');
    }
    this.authService.validateRefreshToken(refreshToken);
    const userData = this.authService.getUserDataFromToken(refreshToken);

    if (!userData || userData.id !== sessionData.userId) {
      throw new UnauthorizedException('User authentication mismatch');
    }
    const scopes = this.permissionService.getScopeDisplayInfo(
      sessionData.scopes as string,
    );
    return {
      clientName: query.client_identifier,
      userEmail: userData.email,
      clientIdentifier: query.client_identifier,
      sessionId: sessionData.id,
      scopes: scopes,
      redirectUri: query.redirect_uri,
    };
  }

  manageAuthorization() {}

  async createConsentUrl(
    refreshToken: string,
    client_identifier: string,
    redirect_uri: string,
    scopes: string,
  ): Promise<string> | null {
    try {
      const tokenRecord = this.authService.validateRefreshToken(refreshToken);
      const userData = this.authService.getUserDataFromToken(tokenRecord.token);
      if (userData) {
        const sessionToken = v4();
        const session = await this.surrealService.createSession(
          sessionToken,
          {
            userId: userData.id as number,
            email: userData.email,
            redirectUri: redirect_uri,
            scopes: scopes,
            clientIdentifier: client_identifier,
          },
          10 * 60,
        );
        const consentUrl = `/api/v1/users/consent?client_identifier=${client_identifier}&redirect_uri=${encodeURIComponent(redirect_uri)}&scopes=${encodeURIComponent(scopes)}&session_id=${session.id}`;
        return consentUrl;
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  }

  async loginViaOauth(
    loginUserDto: LoginUserDto,
    client_identifier: string,
    redirect_uri: string,
    scopes: string,
  ) {
    const output: { consentUrl: string; refreshToken: string } = {
      consentUrl: '',
      refreshToken: '',
    };
    try {
      const loginResult = await this.loginUser(loginUserDto);
      if (loginResult && loginResult.user) {
        output.refreshToken = loginResult.refresh_token;
        const consentUrl = await this.createConsentUrl(
          loginResult.refresh_token,
          client_identifier,
          redirect_uri,
          scopes,
        );

        output.consentUrl = consentUrl;
      } else {
        throw new UnauthorizedException('Invalid Crédentials');
      }
    } catch (error) {
      throw new Error('Error logging in via OAuth');
    }
    return output;
  }

  async handleOauthConsent(
    refreshToken: string,
    body: { approved: string; sessionId: string },
  ) {
    const sessionData = await this.surrealService.getSessionById(
      body.sessionId,
    );
    if (!sessionData) {
      throw new UnauthorizedException('Session expired');
    }

    const tokenRecord = this.authService.validateRefreshToken(refreshToken);
    const userData = this.authService.getUserDataFromToken(refreshToken);
    if (!userData || userData.id !== sessionData.userId || !tokenRecord) {
      throw new UnauthorizedException('User authentication mismatch');
    }

    if (body.approved === 'true') {
      const singleUseTokenRecord =
        await this.surrealService.createSingleUseToken(
          sessionData.clientIdentifier,
          sessionData.id,
        );
      return { singleUseToken: singleUseTokenRecord.token };
    } else {
      throw new UnauthorizedException('Consent denied');
    }
  }

  async handleOauthSingleUseTokenExchange(singleUseToken: string) {
    const singleUseTokenRecord =
      await this.surrealService.getSingleUseToken(singleUseToken);
    if (!singleUseTokenRecord) {
      throw new UnauthorizedException('Invalid single-use token');
    }
    if (singleUseTokenRecord.used) {
      throw new UnauthorizedException('Token already used');
    }
    if (singleUseTokenRecord.expires_at < new Date()) {
      throw new UnauthorizedException('Token expired');
    }
    const updatedRecord = await this.surrealService.updateSingleUseToken(
      singleUseTokenRecord.id,
    );
    const sessionData = await this.surrealService.getSessionById(
      updatedRecord.sessionId,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = this.usersRepository.findOneById(
      sessionData.userId as number,
    );
    const tokens = this.authService.generateThirdPartyTokens(
      updatedRecord.clientIdentifier,
      sessionData.scopes,
      user,
    );
    await this.surrealService.deleteSession(sessionData.id);
    return tokens;
  }
}
