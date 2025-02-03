import { ChiselId } from '@capsule/chisel';

export class GetUserProfileDto {
  id: ChiselId;
  username: string | null;
  email: string;
  avatarUrl: string | null;
  description: string | null;
}
