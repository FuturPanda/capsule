import { CreatePerson } from '@capsulesh/shared-types';

export class CreatePersonDto implements CreatePerson {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'other' | 'prefer_not_to_say';
  email?: string;
  phone?: string;
  address?: string;
  occupation?: string;
  notes?: string;
}
