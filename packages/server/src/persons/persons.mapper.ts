import { Injectable } from '@nestjs/common';
import { PersonModel } from 'src/_utils/models/root/person';
import { GetPersonDto } from './dto/response/get-person.dto';

@Injectable()
export class PersonsMapper {
  constructor() {}

  toGetPersonsDto(persons: PersonModel[]) {
    return persons.map((person) => this.toGetPersonDto(person));
  }

  toGetPersonDto(person: PersonModel): GetPersonDto {
    return {
      id: person.id,
      firstName: person.first_name,
      lastName: person.last_name,
      dateOfBirth: person.date_of_birth,
      gender: person.gender,
      email: person.email,
      phone: person.phone,
      address: person.address,
      occupation: person.occupation,
    };
  }
}
