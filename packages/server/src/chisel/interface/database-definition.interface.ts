import { TableInfoType } from '@capsulesh/shared-types';

export interface DatabaseDefinition {
  dbName: string;
  clientId: string;
  tables: TableInfoType[];
}
