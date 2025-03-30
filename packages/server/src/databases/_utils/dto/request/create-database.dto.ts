import { IsOptional, IsString } from 'class-validator';
import { TableOptions } from '@capsulesh/shared-types';

export class CreateDatabaseDto {
  @IsString()
  name: string;

  @IsOptional()
  entities: TableOptions[] = [];
}
