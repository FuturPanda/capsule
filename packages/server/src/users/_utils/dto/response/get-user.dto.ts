import { ChiselId } from '@capsulesh/chisel';

export class GetUserDto {
  id: ChiselId;
  username: string | null;
  email: string;
}
