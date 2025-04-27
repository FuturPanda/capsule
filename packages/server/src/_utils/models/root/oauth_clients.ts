export class OauthClients {
  id: number;
  client_id: number;
  name: string;
  redirect_uri: string;
  allowed_scopes: string;
  created_at: Date;
  updated_at: Date | null;
}

export class ClientModel {
  id: number;
  name: string;
  redirect_uri: string;
  organization_id?: number;
}
