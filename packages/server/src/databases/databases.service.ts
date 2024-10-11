import { ChiselSchema } from '@capsule/chisel';
import { Injectable } from '@nestjs/common';
import { DatabasesRepository } from './databases.repository';

@Injectable()
export class DatabasesService {
  constructor(private readonly databasesRepository: DatabasesRepository) {}

  async createDatabase(schema: ChiselSchema) {
    //this.databasesRepository.createDatabase(createDatabaseDto.schema);
    /*const newDb = await ChiselDb.SchemaFactory({
      filePath: __dirname,
      dir: '../../../apps/capsule-back/src',
    }).fromSchema(schema);
    return;

     */
  }
}
