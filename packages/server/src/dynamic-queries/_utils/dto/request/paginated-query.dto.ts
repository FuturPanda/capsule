import { IsBoolean, IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { Optional } from 'class-validator-extended';
import { Transform } from 'class-transformer';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginatedQueryDto {
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsBoolean()
  @Transform(({ obj, key }) => obj[key] === 'true')
  @Optional()
  disablePagination?: boolean;

  @IsString()
  @Optional()
  protected sortBy?: string;

  @IsNumber()
  @Min(1)
  private pageSize: number = 10;

  @IsEnum(SortDirection)
  private sortDirection: SortDirection = SortDirection.DESC;

  get skip() {
    return this.disablePagination ? 0 : (this.page - 1) * this.pageSize;
  }

  get limit() {
    return this.disablePagination ? 0 : this.pageSize;
  }
}
