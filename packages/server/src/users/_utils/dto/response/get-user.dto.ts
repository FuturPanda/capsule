import { ChiselId } from '@capsule/chisel';

export class GetUserDto {
  id: ChiselId;
  userName: string | null;
  email: string;
}
