export class User {
  id: number;
  username: string | null;
  email: string;
  password?: string;
  type: string;
  avatar_url: string | null;
  description: string | null;
}
