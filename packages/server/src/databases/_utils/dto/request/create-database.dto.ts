import { TableOptions } from '@capsulesh/chisel';
import { IsOptional, IsString } from 'class-validator';

export class CreateDatabaseDto {
  @IsString()
  name: string;

  @IsOptional()
  entities: TableOptions[] = [];
}
