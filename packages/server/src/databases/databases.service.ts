import { Injectable } from '@nestjs/common';
import { CreateDatabaseDto } from './_utils/dto/request/create-database.dto';
import { DatabasesRepository } from './databases.repository';
import { ChiselService } from '../chisel/chisel.service';
import { TableInfoType } from '@capsulesh/chisel';

@Injectable()
export class DatabasesService {
  constructor(
    private readonly databasesRepository: DatabasesRepository,
    private readonly chiselService: ChiselService,
  ) {}

  async createDatabase(createDatabaseDto: CreateDatabaseDto) {
    /*    const newDatabase = ChiselDb.create({
					uri: DEFAULT_DB_PATH,
					dbName: createDatabaseDto.name,
				});
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

				return res;*/
  }

  getAllDatabases() {
    const res = this.databasesRepository.findAllDatabase();
    console.log('After find all ', res);

    if (res && res.length > 0) {
      const transformed = [];

      res.forEach((curr) => {
        let db = transformed.find((d) => d.id === curr.dbId);
        if (!db) {
          db = {
            id: curr.dbId,
            name: curr.dbName,
            entities: [],
          };
          transformed.push(db);
        }

        let entity = db.entities.find((e) => e.id === curr.entityId);
        if (!entity) {
          entity = {
            id: curr.entityId,
            name: curr.entityName,
            attributes: [],
          };
          db.entities.push(entity);
        }

        entity.attributes.push({
          id: curr.attributeId,
          name: curr.attributeName,
          type: curr.attributeType,
          isRequired: curr.isRequired,
          isPrimaryKey: curr.isPrimaryKey,
        });
      });

      console.log(transformed);
      return transformed;
    }
  }

  saveDatabaseInfo(dbName: string, tableInfos: TableInfoType[]) {
    console.log('Before savedb info');
    const { id: databaseId } = this.databasesRepository.createDatabase(dbName);
    for (const info of tableInfos) {
      const { id: entityId } = this.databasesRepository.createDatabaseEntity(
        info.tableName,
        databaseId,
      );
      for (const entity of info.columns) {
        this.databasesRepository.createEntityAttribute(
          entityId,
          entity.name,
          entity.type,
          entity.notNull ? 1 : 0,
          entity.primaryKey ? 1 : 0,
        );
      }
    }
  }
}
