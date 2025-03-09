import { UpdatePerson } from '@capsulesh/shared-types';

export class UpdatePersonDto implements UpdatePerson {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string | null;
  gender?: 'male' | 'female' | 'non-binary' | 'other' | 'prefer_not_to_say';
  email?: string;
  phone?: string;
  address?: string;
  occupation?: string;
}
