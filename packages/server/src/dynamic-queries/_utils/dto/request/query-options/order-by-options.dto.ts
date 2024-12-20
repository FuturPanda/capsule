import { BaseRecordDto } from './base-record.dto';
import { T_OrderOpts } from '@capsule/chisel';
import { IsIn } from 'class-validator';
import { ORDER_OPTIONS } from '../../../constants/query-options.constant';

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
