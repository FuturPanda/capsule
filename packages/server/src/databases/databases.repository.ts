import { Injectable } from '@nestjs/common';
import { InjectModel } from '../chisel/chisel.module';
import { ChiselId, ChiselModel } from '@capsule/chisel';
import { Database } from '../_utils/models/root/database';
import { EntityAttribute } from '../_utils/models/root/entity_attribute';
import { DatabaseEntity } from '../_utils/models/root/entity';

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

  createDatabase = (name: string) => this.databaseModel.insert({ name: name });

  findAllDatabase = () =>
    this.entityAttributeModel
      .select({
        dbId: 'database.id',
        dbName: 'database.name',
        entityId: 'database_entity.id',
        entityName: 'database_entity.entity_name',
        attributeId: 'entity_attribute.id',
        attributeName: 'entity_attribute.name',
        attributeType: 'entity_attribute.type',
        isRequired: 'entity_attribute.is_required',
        isPrimaryKey: 'entity_attribute.is_primary_key',
      })
      .join(EntityAttribute, DatabaseEntity, 'database_entity_id', 'id')
      .join(DatabaseEntity, Database, 'database_id', 'id')
      .exec();

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
