import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDatabaseDto } from './_utils/dto/request/create-database.dto';
import { ResourcesRepository } from './resources.repository';
import { ChiselDb } from '@capsule/chisel';
import { UpdateDatabaseDto } from './_utils/dto/request/update-database.dto';

@Injectable()
export class ResourcesService {
  constructor(private readonly resourceRepository: ResourcesRepository) {}

  async createDatabase(createDatabaseDto: CreateDatabaseDto) {
    const newDatabase = await ChiselDb.SchemaFactory({
      uri: './databases',
      dbName: createDatabaseDto.name,
      entities: createDatabaseDto.entities,
    }).fromSchema();
    if (!newDatabase)
      throw new InternalServerErrorException('Error during Database Creation');
    const res = this.resourceRepository.createResource(createDatabaseDto.name);
    if (!res.success)
      throw new InternalServerErrorException('Error during resource creation');
    return this.resourceRepository.createDatabase(
      createDatabaseDto.name,
      res.id,
    );
  }

  updateDatabase(dbId: string, updateDatabaseDto: UpdateDatabaseDto) {
    const database = '';
  }

  deleteDatabase(dbId: string) {}
}
