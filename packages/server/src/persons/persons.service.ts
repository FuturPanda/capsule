import { Injectable } from '@nestjs/common';
import { QueryOptionsDto } from 'src/dynamic-queries/_utils/dto/request/query-options.dto';
import { CreatePersonDto } from './dto/request/create-person.dto';
import { UpdatePersonDto } from './dto/request/update-person.dto';
import { PersonsMapper } from './persons.mapper';
import { PersonsRepository } from './persons.repository';

@Injectable()
export class PersonsService {
  constructor(
    private readonly personsRepository: PersonsRepository,
    private readonly personsMapper: PersonsMapper,
  ) {}

  getPaginatedPersons(queryParams: any) {
    throw new Error('Method not implemented.');
  }
  deletePerson(id: number) {
    throw new Error('Method not implemented.');
  }
  updatePerson(id: number, updateTaskDto: UpdatePersonDto) {
    throw new Error('Method not implemented.');
  }
  getOnePerson(queryParams: any) {
    throw new Error('Method not implemented.');
  }
  createPerson(createTaskDto: CreatePersonDto) {
    const newPerson = this.personsRepository.createPerson(createTaskDto);
    return newPerson; //this.personsMapper.toGetPersonDto(newPerson);
  }
  listPersons(queryOptions: QueryOptionsDto) {
    const persons = this.personsRepository.findAllPersons();
    if (!persons) return [];
    return this.personsMapper.toGetPersonsDto(persons);
  }
}
