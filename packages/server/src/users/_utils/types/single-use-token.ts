import { RecordId } from 'surrealdb';

export class SingleUseToken {
  id: RecordId;
  identifier: string;
  token: string;
  created_at: Date;
  expires_at: Date;
  used: boolean;
}
