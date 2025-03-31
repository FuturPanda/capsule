import { Person } from '@capsulesh/shared-types';

export class PersonModel implements Person {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email?: string;
  phone?: string;
  occupation?: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
