import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDatabaseDto } from './_utils/dto/request/create-database.dto';
import { UpdateDatabaseDto } from './_utils/dto/request/update-database.dto';
import { ChiselDb } from '@capsule/chisel';
import { DatabasesRepository } from './databases.repository';
import { DEFAULT_DB_PATH } from '../_utils/constants/database.constant';
import { ChiselService } from '../chisel/chisel.service';

@Injectable()
export class DatabasesService {
  constructor(
    private readonly databasesRepository: DatabasesRepository,
    private readonly chiselService: ChiselService,
  ) {}

  async createDatabase(createDatabaseDto: CreateDatabaseDto) {
    const newDatabase = await ChiselDb.SchemaFactory({
      uri: DEFAULT_DB_PATH,
      dbName: createDatabaseDto.name,
      entities: createDatabaseDto.entities,
    }).fromSchema();
    if (!newDatabase)
      throw new InternalServerErrorException('Error during Database Creation');

    const res = this.databasesRepository.createDatabase(createDatabaseDto.name);
    if (createDatabaseDto.entities.length > 0) {
      createDatabaseDto.entities.map((entity) => {
        const result = this.databasesRepository.createEntity(
          entity.name,
          res.id,
        );
        Object.entries(entity.columns).map(([key, value]) => {
          this.databasesRepository.createEntityAttribute(
            key,
            result.id,
            value.type,
            value.notNull === true ? 0 : 1,
            value.primaryKey === true ? 0 : 1,
          );
        });
      });
    }

    return res;
  }

  getAllDatabases() {
    const res = this.databasesRepository.findAllDatabase();
    console.log(res);
    const transformed = res.reduce((acc, curr) => {
      if (!acc[curr.dbId]) {
        acc[curr.dbId] = {
          id: curr.dbId,
          name: curr.dbName,
          entities: {},
        };
      }

      if (!acc[curr.dbId].entities[curr.entityId]) {
        acc[curr.dbId].entities[curr.entityId] = {
          id: curr.entityId,
          name: curr.entityName,
          attributes: [],
        };
      }

      acc[curr.dbId].entities[curr.entityId].attributes.push({
        id: curr.attributeId,
        name: curr.attributeName,
        type: curr.attributeType,
        isRequired: curr.isRequired,
        isPrimaryKey: curr.isPrimaryKey,
      });

      return acc;
    }, {});

    return transformed;
  }

  updateDatabase(dbId: string, updateDatabaseDto: UpdateDatabaseDto) {}

  deleteDatabase(dbId: string) {}
}
