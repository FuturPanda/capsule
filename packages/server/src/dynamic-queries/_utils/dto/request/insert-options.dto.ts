import { InsertOptions, OnConflictActionEnum } from '@capsulesh/shared-types';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsObject,
  IsString,
} from 'class-validator';
import { Optional } from 'class-validator-extended';

export class OnConflictOptsDto {
  @IsArray()
  @Optional()
  @IsString({ each: true })
  columns: string[];

  @IsArray()
  @Optional()
  @IsString({ each: true })
  update?: string[];

  @Optional()
  @IsEnum(OnConflictActionEnum)
  action?: OnConflictActionEnum;
}

export class InsertOptionsDto implements InsertOptions {
  @IsArray()
  @ArrayMinSize(1)
  data: Record<string, any>[];

  @Optional()
  @IsObject()
  conflict?: OnConflictOptsDto;

  @IsArray()
  @Optional()
  @IsString({ each: true })
  returning?: string[];
}
