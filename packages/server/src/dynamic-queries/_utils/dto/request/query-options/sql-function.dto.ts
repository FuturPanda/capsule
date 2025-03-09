import { SQL_FUNCTIONS, T_SqlFunction } from '@capsulesh/shared-types';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class SqlFunctionDto {
  @IsString()
  @IsIn(SQL_FUNCTIONS)
  function: T_SqlFunction;

  @IsString()
  field: string;

  @IsOptional()
  @IsString()
  alias?: string;
}
