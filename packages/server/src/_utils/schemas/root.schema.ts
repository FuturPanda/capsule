import { ChiselSchema } from '@capsulesh/chisel';
import { ApiKeyTypeEnum } from '../../api-keys/_utils/enum/api-key-type.enum';

export enum UserTypeEnum {
  OWNER = 'OWNER',
  USER = 'USER',
  CLIENT = 'CLIENT',
}

export enum PermissionTypeEnum {
  DATABASE_LEVEL_PERMISSION = 'DATABASE_LEVEL_PERMISSION',
  ACTION_LEVEL_PERMISSION = 'ACTION_LEVEL_PERMISSION',
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
        siret: { type: 'text' },
        type: { type: 'text', notNull: true, enum: UserTypeEnum },
      },
    },
    {
      name: 'api_key',
      columns: {
        value: {
          type: 'text',
          notNull: true,
          primaryKey: true,
        },
        type: {
          type: 'text',
          notNull: true,
          enum: ApiKeyTypeEnum,
        },
      },
    },
    {
      name: 'api_key_permission',
      columns: {
        api_key_id: { type: 'text', notNull: true },
        permission_id: { type: 'integer', notNull: true },
      },
      compositePrimaryKeys: ['api_key_id', 'permission_id'],
      foreignKeys: {
        api_key_id: { foreignTable: 'api_key', foreignKey: 'value' },
        permission_id: { foreignTable: 'permission', foreignKey: 'id' },
      },
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
        name: { type: 'text', notNull: true },
        type: { type: 'text' },
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
        name: { type: 'text', notNull: true, unique: true },
      },
    },
    {
      name: 'database_permission',
      columns: {
        database_id: { type: 'integer', notNull: true },
        permission_id: { type: 'integer', notNull: true },
      },
      compositePrimaryKeys: ['database_id', 'permission_id'],
      foreignKeys: {
        database_id: { foreignTable: 'database', foreignKey: 'id' },
        permission_id: { foreignTable: 'permission', foreignKey: 'id' },
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
        is_required: { type: 'integer', notNull: true },
        is_primary_key: { type: 'integer', notNull: true },
      },
      foreignKeys: {
        entity_id: { foreignTable: 'entity', foreignKey: 'id' },
      },
    },
  ],
};
