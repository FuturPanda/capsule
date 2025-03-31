import { ChiselId } from '@capsulesh/shared-types';

export class GetUserDto {
  id: ChiselId;
  username: string | null;
  email: string;
}
