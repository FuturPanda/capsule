export class User {
  id: number | bigint;
  email: string;
  password?: string;
  siret?: string;
  type: string;
}