import { ChiselSchema } from '@capsule/chisel';
import { TestEnum } from '../../bootstrap/bootstrap.service';

export enum UserTypeEnum {
  OWNER = 'OWNER',
  USER = 'USER',
  CLIENT = 'CLIENT',
}

export const rootSchema: ChiselSchema = {
  dbName: 'root',
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
      name: 'database',
      columns: {
        resource_id: { type: 'integer', notNull: true, primaryKey: true },
        name: { type: 'text', notNull: true },
        schema: { type: 'text', notNull: true, mode: 'json' },
      },
    },
    {
      name: 'kv',
      columns: {
        resource_id: { type: 'integer', notNull: true, primaryKey: true },
        key: { type: 'text', notNull: true },
        value: { type: 'text', notNull: true },
      },
    },
    {
      name: 'document',
      columns: {
        resource_id: { type: 'integer', notNull: true, primaryKey: true },
        value: { type: 'text', notNull: true, mode: 'json' },
      },
    },
  ],
};
