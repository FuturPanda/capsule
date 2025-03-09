export class OauthQueryDto {
  client_identifier: string;
  redirect_uri: string;
  scopes: string;
  error?: string;
  email?: string;
}
