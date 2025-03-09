export class Session {
  id: string;
  userId: number | bigint;
  userEmail: string;
  token: string;
  redirectUri: string;
  scopes: string;
  ttl: number;
  createdAt: Date;
  updatedAt: Date;

  [key: string]: any;
}
