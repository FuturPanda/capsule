import { ChiselId, ChiselModel } from '@capsulesh/chisel';
import { Injectable } from '@nestjs/common';
import { Database } from '../_utils/models/root/database';
import { DatabaseEntity } from '../_utils/models/root/entity';
import { EntityAttribute } from '../_utils/models/root/entity_attribute';
import { InjectModel } from '../chisel/chisel.module';

@Injectable()
export class DatabasesRepository {
  constructor(
    @InjectModel(Database.name)
    private readonly databaseModel: ChiselModel<Database>,
    @InjectModel(EntityAttribute.name)
    private readonly entityAttributeModel: ChiselModel<EntityAttribute>,
    @InjectModel(DatabaseEntity.name)
    private readonly databaseEntityModel: ChiselModel<DatabaseEntity>,
  ) {}

  createDatabase = (name: string, clientId: string) => {
    return this.databaseModel.insert(
      { name: name, client_id: clientId },
      { ignoreExisting: true },
    );
  };

  findAllDatabase = () => this.databaseModel.select().exec();

  createDatabaseEntity = (entityName: string, databaseId: ChiselId) =>
    this.databaseEntityModel.insert(
      {
        database_id: databaseId,
        entity_name: entityName,
      },
      { ignoreExisting: true },
    );

  createEntityAttribute = (
    entityId: ChiselId,
    name: string,
    type: string,
    isRequired: number,
    isPrimaryKey: number,
  ) =>
    this.entityAttributeModel.insert({
      database_entity_id: entityId,
      name: name,
      type: type,
      is_required: isRequired,
      is_primary_key: isPrimaryKey,
    });
}
