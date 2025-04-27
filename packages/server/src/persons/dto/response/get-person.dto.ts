import { GetPerson } from '@capsulesh/shared-types';

export class GetPersonDto implements GetPerson {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  occupation: string;
}
