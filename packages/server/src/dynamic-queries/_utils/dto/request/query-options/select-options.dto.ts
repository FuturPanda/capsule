import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SqlFunctionDto } from './sql-function.dto';
import { Optional } from 'class-validator-extended';

export class SelectOptionsDto {
  @Optional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @Optional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => SqlFunctionDto)
  functions?: Record<string, SqlFunctionDto>;
}
