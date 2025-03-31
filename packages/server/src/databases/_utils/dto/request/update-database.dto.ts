import { TableOptions } from '@capsulesh/shared-types';

export class UpdateDatabaseDto {
  dbName: string;
  entities: TableOptions[];
}
