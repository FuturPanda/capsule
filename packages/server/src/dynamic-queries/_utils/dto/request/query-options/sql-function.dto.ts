import { IsIn, IsOptional, IsString } from 'class-validator';
import { T_SqlFunction } from '@capsule/chisel';
import { SQL_FUNCTIONS } from '../../../constants/query-options.constant';

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
