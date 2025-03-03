import { ChiselDb, TableInfoType } from '@capsulesh/chisel';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DEFAULT_DB_PATH } from 'src/_utils/constants/database.constant';
import { ChiselService } from '../chisel/chisel.service';
import { CreateDatabaseDto } from './_utils/dto/request/create-database.dto';
import { DatabasesRepository } from './databases.repository';

@Injectable()
export class DatabasesService {
  constructor(
    private readonly databasesRepository: DatabasesRepository,
    private readonly chiselService: ChiselService,
  ) {}

  async createDatabase(createDatabaseDto: CreateDatabaseDto, apiKey: string) {
    const newDatabase = ChiselDb.create({
      uri: `${DEFAULT_DB_PATH}/${apiKey}`,
      dbName: createDatabaseDto.name,
    });
    if (!newDatabase)
      throw new InternalServerErrorException('Error during Database Creation');
    console.log(
      'in database creation service ',
      createDatabaseDto.name,
      apiKey,
    );
    const res = this.databasesRepository.createDatabase(
      createDatabaseDto.name,
      apiKey,
    );

    // if (createDatabaseDto.entities.length > 0) {
    //   createDatabaseDto.entities.map((entity) => {
    //     const result = this.databasesRepository.createEntity(
    //       entity.name,
    //       res.id,
    //     );
    //     Object.entries(entity.columns).map(([key, value]) => {
    //       this.databasesRepository.createEntityAttribute(
    //         key,
    //         result.id,
    //         value.type,
    //         value.notNull === true ? 0 : 1,
    //         value.primaryKey === true ? 0 : 1,
    //       );
    //     });
    //   });
    // }

    return res;
  }

  getAllDatabases() {
    const res = this.databasesRepository.findAllDatabase();
    const dbs = res.map((db) => ({
      id: db.id,
      name: db.name,
      entities: this.chiselService.getConnection('', db.name).getDbDefinition(),
    }));
    console.log(JSON.stringify(dbs));
    return dbs;
    // if (dbs && dbs.length > 0) {
    //   const transformed = [];

    //   dbs.forEach((curr) => {
    //     let db = transformed.find((d) => d.id === curr.dbId);
    //     if (!db) {
    //       db = {
    //         id: curr.dbId,
    //         name: curr.dbName,
    //         entities: [],
    //       };
    //       transformed.push(db);
    //     }

    //     let entity = db.entities.find((e) => e.id === curr.entityId);
    //     if (!entity) {
    //       entity = {
    //         id: curr.entityId,
    //         name: curr.entityName,
    //         attributes: [],
    //       };
    //       db.entities.push(entity);
    //     }

    //     entity.attributes.push({
    //       id: curr.attributeId,
    //       name: curr.attributeName,
    //       type: curr.attributeType,
    //       isRequired: curr.isRequired,
    //       isPrimaryKey: curr.isPrimaryKey,
    //     });
    //   });

    //   console.log(transformed);
    //   return transformed;
    // }
  }

  saveDatabaseInfo(
    dbName: string,
    tableInfos: TableInfoType[],
    clientId: string,
  ) {
    const { id: databaseId } = this.databasesRepository.createDatabase(
      dbName,
      clientId,
    );
    // for (const info of tableInfos) {
    //   const { id: entityId } = this.databasesRepository.createDatabaseEntity(
    //     info.tableName,
    //     databaseId,
    //   );
    //   for (const entity of info.columns) {
    //     this.databasesRepository.createEntityAttribute(
    //       entityId,
    //       entity.name,
    //       entity.type,
    //       entity.notNull ? 1 : 0,
    //       entity.primaryKey ? 1 : 0,
    //     );
    //   }
    // }
  }
}
