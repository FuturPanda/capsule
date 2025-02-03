import { ChiselId } from '@capsule/chisel';

export class GetUserDto {
  id: ChiselId;
  username: string | null;
  email: string;
}
