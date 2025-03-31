import { ChiselModel } from '@capsulesh/chisel';
import { Injectable } from '@nestjs/common';
import { convertQueryOptionsToFilterQuery } from 'src/_utils/functions/query-options-transformation';
import { PersonModel } from 'src/_utils/models/root/person';
import { QueryOptionsDto } from 'src/dynamic-queries/_utils/dto/request/query-options.dto';
import { InjectModel } from '../chisel/chisel.module';
import { CreatePersonDto } from './dto/request/create-person.dto';
import { UpdatePersonDto } from './dto/request/update-person.dto';

@Injectable()
export class PersonsRepository {
  constructor(
    @InjectModel(PersonModel.name)
    private readonly model: ChiselModel<PersonModel>,
  ) {}

  createPerson = (dto: CreatePersonDto) =>
    this.model.insert(
      {
        ...(dto.firstName && { first_name: dto.firstName }),
        ...(dto.lastName && { last_name: dto.lastName }),
        ...(dto.dateOfBirth && { date_of_birth: dto.dateOfBirth }),
        ...(dto.gender && { gender: dto.gender }),
        ...(dto.email && { email: dto.email }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.address && { address: dto.address }),
        ...(dto.occupation && { occupation: dto.occupation }),
      },
      { returning: true },
    );

  findAllPersons(queryOptions?: QueryOptionsDto): PersonModel[] {
    const filterQuery = convertQueryOptionsToFilterQuery(queryOptions);
    return this.model.select().where(filterQuery).exec();
  }

  findPersonById = (id: number | bigint): PersonModel =>
    this.model
      .select()
      .where({ id: { $eq: id } })
      .exec({ one: true });

  updatePersonById = (id: number, dto: UpdatePersonDto) =>
    this.model
      .update({
        ...(dto.firstName && { first_name: dto.firstName }),
        ...(dto.lastName && { last_name: dto.lastName }),
        ...(dto.dateOfBirth && { date_of_birth: dto.dateOfBirth }),
        ...(dto.gender && { gender: dto.gender }),
        ...(dto.email && { email: dto.email }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.address && { address: dto.address }),
        ...(dto.occupation && { occupation: dto.occupation }),
        updated_at: new Date(),
      })
      .where({ id: { $eq: id } })
      .exec();

  deletePersonById = (id: number) =>
    this.model
      .delete()
      .where({ id: { $eq: id } })
      .exec();
}
