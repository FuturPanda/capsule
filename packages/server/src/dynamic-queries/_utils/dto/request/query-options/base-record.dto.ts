import { IsObject, ValidateNested } from 'class-validator';

export class BaseRecordDto<T> {
  @IsObject()
  @ValidateNested({ each: true })
  protected _data: Record<string, T> = {};

  get data(): Record<string, T> {
    return this._data;
  }

  set data(value: Record<string, T>) {
    this._data = value;
  }
}
