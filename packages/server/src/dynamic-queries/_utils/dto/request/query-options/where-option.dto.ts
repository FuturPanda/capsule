import { T_WhereOperator, WHERE_OPERATORS } from '@capsulesh/shared-types';
import { IsBoolean, IsIn, IsString } from 'class-validator';
import { Optional } from 'class-validator-extended';

export class WhereConditionDto {
  @IsString()
  @IsIn(WHERE_OPERATORS)
  operator: T_WhereOperator;

  @IsString()
  value: string;

  @Optional()
  @IsBoolean()
  not?: boolean;
}
