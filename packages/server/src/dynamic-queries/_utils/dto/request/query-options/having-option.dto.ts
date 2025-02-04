import { BaseRecordDto } from './base-record.dto';
import {
  HavingOptions,
  T_ComparisonOperator,
  T_HavingFunction,
} from '@capsulesh/chisel';
import { Type } from 'class-transformer';
import { IsIn } from 'class-validator';
import {
  COMPARISON_OPERATORS,
  HAVING_FUNCTIONS,
} from '../../../constants/query-options.constant';

export class HavingOptionsDto
  extends BaseRecordDto<HavingConditionDto>
  implements HavingOptions
{
  @Type(() => HavingConditionDto)
  override get data(): Record<string, HavingConditionDto> {
    return super.data;
  }

  override set data(value: Record<string, HavingConditionDto>) {
    super.data = value;
  }

  [key: string]: any;
}

class HavingConditionDto {
  @IsIn(HAVING_FUNCTIONS)
  function: T_HavingFunction;

  @IsIn(COMPARISON_OPERATORS)
  operator: T_ComparisonOperator;

  value: any;
}
