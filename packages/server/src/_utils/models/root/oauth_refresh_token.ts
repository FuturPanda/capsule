export class OauthRefreshToken {
  id: number;
  token: string;
  client_id?: string;
  user_id: number;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}

export class RefreshTokenModel {
  id: number;
  token: string;
  client_id?: number;
  user_id?: number;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}
