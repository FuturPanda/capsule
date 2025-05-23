import { ChiselDb } from '@capsulesh/chisel';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DEFAULT_DB_PATH } from 'src/_utils/constants/database.constant';
import { ResourceTypeEnum } from 'src/_utils/models/root/resource';
import { ResourcesRepository } from 'src/resources/resources.repository';
import { ChiselService } from '../chisel/chisel.service';
import { CreateDatabaseDto } from './_utils/dto/request/create-database.dto';
import { DatabasesMapper } from './databases.mapper';
import { DatabasesRepository } from './databases.repository';

@Injectable()
export class DatabasesService {
  constructor(
    private readonly databasesRepository: DatabasesRepository,
    private readonly databasesMapper: DatabasesMapper,
    private readonly chiselService: ChiselService,
    private readonly resourcesRepository: ResourcesRepository,
  ) {}

  async createDatabase(
    createDatabaseDto: CreateDatabaseDto,
    clientIdentifier: string,
  ) {
    const newDatabase = ChiselDb.create({
      uri: `${DEFAULT_DB_PATH}/${clientIdentifier}`,
      dbName: createDatabaseDto.name,
    });
    if (!newDatabase)
      throw new InternalServerErrorException('Error during Database Creation');
    console.log(
      'in database creation service ',
      createDatabaseDto.name,
      clientIdentifier,
    );
    const res = this.saveDatabaseInfo(createDatabaseDto.name, clientIdentifier);

    if (createDatabaseDto.entities.length > 0) {
      const operations =
        this.databasesMapper.toMigrationOperations(createDatabaseDto);
      newDatabase.applyOperations(operations);
    }
    return res;
  }

  getAllDatabases(clientIdentifier: string) {
    const res = this.databasesRepository.findAllDatabase();
    console.log(res);
    if (!res) return;
    const dbs = res.map((db) => ({
      id: db.id,
      name: db.name,
      clientId: db.client_id,
      entities: this.chiselService
        .getConnection(db.client_id, db.name)
        .getDbDefinition(),
    }));
    console.log(JSON.stringify(dbs));
    return dbs;
  }

  saveDatabaseInfo(dbName: string, clientId: string) {
    const database = this.databasesRepository.findDatabaseByName(dbName);
    if (database) return database;
    const resource = this.resourcesRepository.createResource(
      dbName,
      ResourceTypeEnum.DATABASE,
    );
    if (!resource.id) {
      throw new Error('error during resource creation');
    }
    return this.databasesRepository.createDatabase(
      resource.id,
      dbName,
      clientId,
    );
  }

  deleteDatabase(dbId: number) {
    return this.databasesRepository.deleteDatabase(dbId);
  }
}
