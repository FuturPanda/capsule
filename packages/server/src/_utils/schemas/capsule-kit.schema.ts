import { ChiselSchema } from '@capsulesh/shared-types';

export const capsuleKitSchema: ChiselSchema = {
  dbName: 'capsule-kit',
  version: '0.01',
  entities: [
    {
      name: 'content',
      columns: {
        id: {
          type: 'integer',
          autoIncrement: true,
          notNull: true,
          primaryKey: true,
        },
        type: { type: 'text', notNull: true },
        payload: { type: 'text' },
      },
    },
  ],
};
