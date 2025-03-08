export class CreateSessionDto {
  userId: number;
  email: string;
  redirectUri: string;
  scopes: string;
}
