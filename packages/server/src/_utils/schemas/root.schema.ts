import { ChiselSchema } from '@capsule/chisel';
import { TestEnum } from '../../bootstrap/bootstrap.service';
import { ResourceTypeEnum } from '../../resources/resources.controller';

export enum UserTypeEnum {
  OWNER = 'OWNER',
  USER = 'USER',
  CLIENT = 'CLIENT',
}

export const rootSchema: ChiselSchema = {
  dbName: 'root',
  version: '0.01',
  entities: [
    {
      name: 'user',
      columns: {
        id: {
          type: 'integer',
          autoIncrement: true,
          notNull: true,
          primaryKey: true,
        },
        email: { type: 'text', notNull: true, unique: true },
        password: { type: 'text' },
        api_key: { type: 'text' },
        siret: { type: 'text' },
        schema: { type: 'text', mode: 'json' },
        type: { type: 'text', notNull: true, enum: UserTypeEnum },
      },
    },
    {
      name: 'user_resource_permission',
      columns: {
        client_id: { type: 'integer', notNull: true },
        permission_id: { type: 'integer', notNull: true },
        resource_id: { type: 'integer', notNull: true },
      },
      compositePrimaryKeys: ['client_id', 'permission_id', 'resource_id'],
    },
    {
      name: 'permission',
      columns: {
        id: {
          type: 'integer',
          autoIncrement: true,
          notNull: true,
          primaryKey: true,
        },
        name: { type: 'text', notNull: true, enum: TestEnum },
      },
    },
    {
      name: 'resource',
      columns: {
        id: {
          type: 'integer',
          notNull: true,
          unique: true,
          primaryKey: true,
          autoIncrement: true,
        },
        name: { type: 'text', notNull: true },
        created_at: { type: 'text' },
        updated_at: { type: 'text' },
        type: { type: 'text', notNull: true, enum: ResourceTypeEnum },
      },
    },
    {
      name: 'database',
      columns: {
        id: {
          type: 'integer',
          notNull: true,
          primaryKey: true,
          autoIncrement: true,
        },
        resources_id: { type: 'integer', notNull: true },
      },
      foreignKeys: {
        resource_id: { foreignTable: 'resource', foreignKey: 'id' },
      },
    },
    {
      name: 'entity',
      columns: {
        id: {
          type: 'integer',
          notNull: true,
          primaryKey: true,
          autoIncrement: true,
        },
        database_id: {
          type: 'integer',
          notNull: true,
        },
        name: { type: 'text', notNull: true },
      },
      foreignKeys: {
        database_id: { foreignKey: 'id', foreignTable: 'database' },
      },
    },
    {
      name: 'entity_attribute',
      columns: {
        id: {
          type: 'integer',
          notNull: true,
          primaryKey: true,
          autoIncrement: true,
        },
        entity_id: {
          type: 'integer',
          notNull: true,
        },
        name: { type: 'text', notNull: true },
        type: { type: 'text', notNull: true },
        is_required: { type: 'text', notNull: true },
        is_primary_key: { type: 'text', notNull: true },
      },
      foreignKeys: {
        entity_id: { foreignTable: 'entity', foreignKey: 'id' },
      },
    },
    {
      name: 'kv',
      columns: {
        id: {
          type: 'integer',
          notNull: true,
          primaryKey: true,
          autoIncrement: true,
        },
        resource_id: { type: 'integer', notNull: true },
        key: { type: 'text', notNull: true },
        value: { type: 'text', notNull: true },
      },
      foreignKeys: {
        resource_id: { foreignTable: 'resource', foreignKey: 'id' },
      },
    },
    {
      name: 'document',
      columns: {
        id: {
          type: 'integer',
          notNull: true,
          primaryKey: true,
          autoIncrement: true,
        },
        resource_id: { type: 'integer', notNull: true },
        content: { type: 'text', notNull: true, mode: 'json' },
      },
      foreignKeys: {
        resource_id: { foreignTable: 'resource', foreignKey: 'id' },
      },
    },
    {
      name: 'log',
      columns: {
        time: { type: 'integer', notNull: true, primaryKey: true },
        type: { type: 'text', notNull: true },
        value: { type: 'text', notNull: true, mode: 'json' },
      },
    },
  ],
};
