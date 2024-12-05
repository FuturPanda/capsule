import { Injectable } from '@nestjs/common';
import { InjectModel } from '../chisel/chisel.module';
import { ChiselModel } from '@capsule/chisel';
import { Database } from '../_utils/models/root/database';
import { Entity } from '../_utils/models/root/entity';
import { EntityAttribute } from '../_utils/models/root/entity_attribute';

@Injectable()
export class DatabasesRepository {
  constructor(
    @InjectModel(Database.name)
    private readonly databaseModel: ChiselModel<Database>,
    @InjectModel(Entity.name) private readonly entityModel: ChiselModel<Entity>,
    @InjectModel(EntityAttribute.name)
    private readonly entityAttributeModel: ChiselModel<EntityAttribute>,
  ) {}

  createDatabase = (name: string) => this.databaseModel.insert({ name: name });
  findAllDatabase = () =>
    this.entityAttributeModel
      .select({
        dbId: 'database.id',
        dbName: 'database.name',
        entityId: 'entity.id',
        entityName: 'entity.name',
        attributeId: 'entity_attribute.id',
        attributeName: 'entity_attribute.name',
        attributeType: 'entity_attribute.type',
        isRequired: 'entity_attribute.is_required',
        isPrimaryKey: 'entity_attribute.is_primary_key',
      })
      .join(EntityAttribute, Entity, 'entity_id', 'id')
      .join(Entity, Database, 'database_id', 'id')
      .exec();

  createEntity = (name: string, databaseId: number) =>
    this.entityModel.insert({ database_id: databaseId, name: name });

  createEntityAttribute = (
    name: string,
    entityId: number,
    type: string,
    isRequired: number,
    isPrimaryKey: number,
  ) =>
    this.entityAttributeModel.insert({
      name: name,
      entity_id: entityId,
      type: type,
      is_required: isRequired,
      is_primary_key: isPrimaryKey,
    });
}
