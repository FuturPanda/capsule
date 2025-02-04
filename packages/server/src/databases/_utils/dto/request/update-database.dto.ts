import { TableOptions } from '@capsulesh/chisel';

export class UpdateDatabaseDto {
  dbName: string;
  entities: TableOptions[];
}
