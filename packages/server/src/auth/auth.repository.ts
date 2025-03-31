import { ChiselModel } from '@capsulesh/chisel';
import { Injectable } from '@nestjs/common';
import { OauthAuthorization } from 'src/_utils/models/root/oauth_authorization';
import { OauthClients } from 'src/_utils/models/root/oauth_clients';
import { OauthRefreshToken } from 'src/_utils/models/root/oauth_refresh_token';
import { InjectModel } from 'src/chisel/chisel.module';
import { ClientModel } from '../_utils/models/root/oauth_clients';
import {
  AuthorizationModel,
  ResourceClientAuthorizationModel,
} from '../_utils/models/root/authorization';
import { RefreshTokenModel } from '../_utils/models/root/oauth_refresh_token';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(OauthClients.name)
    private readonly oauthClientsModel: ChiselModel<OauthClients>,
    @InjectModel(OauthRefreshToken.name)
    private readonly oauthRefreshTokenModel: ChiselModel<OauthRefreshToken>,
    @InjectModel(OauthAuthorization.name)
    private readonly oauthAuthorizationModel: ChiselModel<OauthAuthorization>,

    @InjectModel(ClientModel.name)
    private readonly clientModel: ChiselModel<ClientModel>,
    @InjectModel(AuthorizationModel.name)
    private readonly authorizationModel: ChiselModel<AuthorizationModel>,
    @InjectModel(ResourceClientAuthorizationModel.name)
    private readonly resourceClientAuthorizationModel: ChiselModel<ResourceClientAuthorizationModel>,
    @InjectModel(RefreshTokenModel.name)
    private readonly refreshTokenModel: ChiselModel<RefreshTokenModel>,
  ) {}

  createRefreshToken = (
    userId: number,
    value: string,
    expiryDate: Date,
    clientId?: number,
  ) =>
    this.refreshTokenModel.insert({
      token: value,
      user_id: userId,
      client_id: clientId,
      expires_at: expiryDate.toString(),
    });

  findToken = (value: string): RefreshTokenModel =>
    this.refreshTokenModel
      .select()
      .where({ token: { $eq: value } })
      .exec({ one: true });

  revokeRefreshToken = (tokenId: number | bigint) =>
    this.refreshTokenModel
      .update({ revoked_at: Date.now().toString() })
      .where({ id: { eq: tokenId } })
      .exec();
}
