import { QueryOptions } from '@capsulesh/shared-types';
import { Type } from 'class-transformer';
import { IsBoolean, ValidateNested } from 'class-validator';
import { Optional } from 'class-validator-extended';
import { KeyValue } from '../../../../_utils/decorators/key-value.decorator';
import { PaginatedQueryDto } from './paginated-query.dto';
import { GroupByOptionsDto } from './query-options/group-by-options.dto';
import { HavingOptionsDto } from './query-options/having-option.dto';
import { OrderByOptionsDto } from './query-options/order-by-options.dto';
import { RelationOptionsDto } from './query-options/relation-option.dto';
import { SelectOptionsDto } from './query-options/select-options.dto';
import { WhereConditionDto } from './query-options/where-option.dto';

export class QueryOptionsDto implements QueryOptions {
  @Optional()
  @ValidateNested()
  @Type(() => SelectOptionsDto)
  select?: SelectOptionsDto;

  @KeyValue(WhereConditionDto)
  where?: { [key: string]: WhereConditionDto };

  @Optional()
  @ValidateNested()
  @Type(() => OrderByOptionsDto)
  orderBy?: OrderByOptionsDto;

  @Optional()
  @ValidateNested()
  @Type(() => PaginatedQueryDto)
  pagination?: PaginatedQueryDto;

  @Optional()
  @ValidateNested()
  @Type(() => RelationOptionsDto)
  relations?: RelationOptionsDto;

  @Optional()
  @ValidateNested()
  @Type(() => GroupByOptionsDto)
  groupBy?: GroupByOptionsDto;

  @Optional()
  @ValidateNested()
  @Type(() => HavingOptionsDto)
  having?: HavingOptionsDto;

  @Optional()
  @IsBoolean()
  distinct?: boolean;
}
