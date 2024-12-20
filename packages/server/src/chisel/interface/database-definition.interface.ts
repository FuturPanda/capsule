import { TableInfoType } from '@capsule/chisel';

export interface DatabaseDefinition {
  dbName: string;
  clientId: string;
  tables: TableInfoType[];
}
