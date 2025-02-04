import { TableInfoType } from '@capsulesh/chisel';

export interface DatabaseDefinition {
  dbName: string;
  clientId: string;
  tables: TableInfoType[];
}
