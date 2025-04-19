import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from './_utils/dto/request/login-user.dto';
import { OauthQueryDto } from './_utils/dto/request/oauth.dto';
import { UpdateProfileDto } from './_utils/dto/request/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.loginUser(loginUserDto);
  }

  @Post('/refresh')
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.usersService.validateUserConnection(body.refreshToken);
  }

  @Get('owner')
  getOwnerPublicProfile() {
    return this.usersService.getOwnerPublicProfile();
  }

  @Put('owner')
  updateOwnerProfile(@Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateOwnerProfile(updateProfileDto);
  }

  @Get('login')
  @Render('login')
  async getLoginPage(
    @Query()
    query: OauthQueryDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    const tokenRecord = this.authService.validateRefreshToken(refreshToken);
    if (refreshToken && tokenRecord) {
      const consentUrl = await this.usersService.createConsentUrl(
        query.client_identifier,
        query.redirect_uri,
        query.scopes,
        tokenRecord.token,
      );
      response.redirect(consentUrl);
    }
    return {
      redirect_uri: query.redirect_uri,
      scopes: query.scopes,
      client_identifier: query.client_identifier,
      error: query.error ? 'Wrong email or password' : '',
      email: query.email,
    };
  }

  @Get('consent')
  @Render('consent')
  async getConsentPage(
    @Query() query: OauthQueryDto & { session_id: string },
    @Req() request: Request,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.usersService.manageConsentRequest(query, refreshToken);
  }

  @Post('oauth/login')
  @FormDataRequest()
  async loginOauthUser(
    @Body() loginUserDto: LoginUserDto,
    @Res() response: Response,
    @Query()
    query: OauthQueryDto,
  ) {
    const { refreshToken, redirectUrl, error } =
      await this.usersService.loginViaOauth(
        loginUserDto,
        query.client_identifier,
        query.redirect_uri,
        query.scopes,
      );
    if (error) {
      return response.redirect(redirectUrl);
    } else {
      response.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      return response.redirect(redirectUrl);
    }
  }

  @Post('oauth/consent')
  @FormDataRequest()
  async handleOauthConsent(
    @Req() request: Request,
    @Res() response: Response,
    @Body() body: { approved: string; sessionId: string },
  ) {
    const refreshToken = request.cookies['refresh_token'];
    const token = await this.usersService.handleOauthConsent(
      refreshToken,
      body,
    );
    return response.json(token);
  }

  @Post('oauth/single-use-token')
  async handleOauthSingleUseToken(
    @Body() body: { singleUseToken: string },
    @Res() response: Response,
  ) {
    const tokens = await this.usersService.handleOauthSingleUseTokenExchange(
      body.singleUseToken,
    );

    response.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return response.json(tokens);
  }
}
