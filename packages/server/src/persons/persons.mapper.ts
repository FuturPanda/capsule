import { Injectable } from '@nestjs/common';
import { GetPersonDto } from './dto/response/get-person.dto';
import { PersonModel } from '../_utils/models/root/person';

@Injectable()
export class PersonsMapper {
  constructor() {}

  toGetPersonsDto(persons: PersonModel[]) {
    return persons.map((person) => this.toGetPersonDto(person));
  }

  toGetPersonDto = (person: PersonModel): GetPersonDto => ({
    id: person.id,
    firstName: person.first_name,
    lastName: person.last_name,
    dateOfBirth: person.date_of_birth,
    email: person.email ?? '',
    phone: person.phone ?? '',
    occupation: person.occupation ?? '',
  });
}
