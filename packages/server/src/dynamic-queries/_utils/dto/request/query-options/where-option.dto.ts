import { IsBoolean, IsIn, IsString } from 'class-validator';
import { T_WhereOperator } from '@capsule/chisel';
import { WHERE_OPERATORS } from '../../../constants/query-options.constant';
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
