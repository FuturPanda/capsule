import { Person } from '@capsulesh/shared-types';

export class PersonModel implements Person {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: 'male' | 'female' | 'non-binary' | 'other' | 'prefer_not_to_say';
  email?: string;
  phone?: string;
  address?: string;
  occupation?: string;
  notes?: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
