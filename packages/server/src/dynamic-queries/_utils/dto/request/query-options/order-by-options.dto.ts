import { ORDER_OPTIONS, T_OrderOpts } from '@capsulesh/shared-types';
import { IsIn } from 'class-validator';
import { BaseRecordDto } from './base-record.dto';

export class OrderByOptionsDto extends BaseRecordDto<T_OrderOpts> {
  @IsIn(ORDER_OPTIONS, { each: true })
  override get data(): Record<string, T_OrderOpts> {
    return super.data;
  }

  override set data(value: Record<string, T_OrderOpts>) {
    super.data = value;
  }

  [key: string]: any;
}
