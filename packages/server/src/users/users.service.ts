import { Injectable, UnauthorizedException } from '@nestjs/common';

import { v4 } from 'uuid';
import { LoginUserDto } from './_utils/dto/request/login-user.dto';
import { OauthQueryDto } from './_utils/dto/request/oauth.dto';
import { UpdateProfileDto } from './_utils/dto/request/update-profile.dto';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { SurrealService } from '../surreal/surreal.service';
import { AuthorizationsService } from '../authorizations/authorizations.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly usersMapper: UsersMapper,
    private readonly authorizationService: AuthorizationsService,
    private readonly surrealService: SurrealService,
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

  async manageConsentRequest(
    query: OauthQueryDto & { session_id: string },
    refreshToken: string,
  ) {
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
    const scopes = this.authorizationService.getScopeDisplayInfo(
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
    client_identifier: string,
    redirect_uri: string,
    scopes: string,
    token: string,
  ) {
    try {
      const userData = this.authService.getUserDataFromToken(token);
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
      } else return '';
    } catch (error) {
      console.error('Error checking token:', error);
    }
  }

  createLoginUrl(
    client_identifier: string,
    redirect_uri: string,
    scopes: string,
    error?: string,
    email?: string,
  ): string {
    return `/api/v1/users/login?redirect_uri=${redirect_uri}&scopes=${scopes}&client_identifier=${client_identifier}&email=${email}&error=${error}`;
  }

  async loginViaOauth(
    loginUserDto: LoginUserDto,
    client_identifier: string,
    redirect_uri: string,
    scopes: string,
  ) {
    const output: {
      redirectUrl: string;
      refreshToken: string;
      error: any | null;
    } = {
      redirectUrl: '',
      refreshToken: '',
      error: null,
    };
    try {
      const loginResult = await this.loginUser(loginUserDto);
      console.log('Login result::: ', loginResult);
      if (loginResult && loginResult.user) {
        output.refreshToken = loginResult.refresh_token;
        const consentUrl = await this.createConsentUrl(
          client_identifier,
          redirect_uri,
          scopes,
          loginResult.refresh_token,
        );
        console.log('Consent URL::: ', consentUrl);

        output.redirectUrl = consentUrl ?? '';
      } else {
        throw new UnauthorizedException('Invalid Crédentials');
      }
    } catch (error) {
      output.error = error;
      output.redirectUrl = this.createLoginUrl(
        client_identifier,
        redirect_uri,
        scopes,
        error.message,
        loginUserDto.email,
      );
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
          `${sessionData.clientIdentifier.replace(/\s+/g, '').trim().toLowerCase()}::${sessionData.redirectUri.replace(/\s+/g, '').trim().toLowerCase()}`,
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
    console.log('IN EXCHANGE :::: updated record ::  ', updatedRecord);
    const sessionData = await this.surrealService.getSessionById(
      updatedRecord.sessionId,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = this.usersRepository.findOneById(
      sessionData.userId as number,
    );
    const tokens = this.authService.generateThirdPartyTokens(
      updatedRecord.identifier,
      sessionData.scopes,
      user,
    );
    await this.surrealService.deleteSession(sessionData.id);
    return tokens;
  }
}
