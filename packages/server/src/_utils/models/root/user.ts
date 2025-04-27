export class UserModel {
  id: number;
  email: string;
  password: string;
  username: string | null;
  avatar_url: string | null;
  description: string | null;
  person_id?: number;
}
