import { TableOptions } from '@capsule/chisel';

export class UpdateDatabaseDto {
  dbName: string;
  entities: TableOptions[];
}
