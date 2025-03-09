import { ChiselModel } from '@capsulesh/chisel';
import { Injectable } from '@nestjs/common';
import { OauthAuthorization } from 'src/_utils/models/root/oauth_authorization';
import { OauthClients } from 'src/_utils/models/root/oauth_clients';
import { OauthRefreshToken } from 'src/_utils/models/root/oauth_refresh_token';
import { InjectModel } from 'src/chisel/chisel.module';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(OauthClients.name)
    private readonly oauthClientsModel: ChiselModel<OauthClients>,

    @InjectModel(OauthRefreshToken.name)
    private readonly oauthRefreshTokenModel: ChiselModel<OauthRefreshToken>,

    @InjectModel(OauthAuthorization.name)
    private readonly oauthAuthorizationModel: ChiselModel<OauthAuthorization>,
  ) {}

  createRefreshToken = (
    userId: number,
    value: string,
    expiryDate: Date,
    clientId?: string,
  ) =>
    this.oauthRefreshTokenModel.insert({
      token: value,
      user_id: userId,
      client_id: clientId,
      expires_at: expiryDate.toString(),
    });

  findToken = (value: string) =>
    this.oauthRefreshTokenModel
      .select()
      .where({ token: { $eq: value } })
      .exec({ one: true });

  revokeRefreshToken = (tokenId: number | bigint) =>
    this.oauthRefreshTokenModel
      .update({ revoked_at: Date.now().toString() })
      .where({ id: { eq: tokenId } });
}
