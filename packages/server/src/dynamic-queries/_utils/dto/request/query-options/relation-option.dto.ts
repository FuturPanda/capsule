import { BaseRecordDto } from './base-record.dto';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { OrderByOptionsDto } from './order-by-options.dto';
import { Optional } from 'class-validator-extended';
import { WhereConditionDto } from './where-option.dto';
import { BadRequestException } from '@nestjs/common';

export class RelationOptionsDto extends BaseRecordDto<RelationInnerOptionsDto> {
  @Type(() => RelationInnerOptionsDto)
  override get data(): Record<string, RelationInnerOptionsDto> {
    return super.data;
  }

  override set data(value: Record<string, RelationInnerOptionsDto>) {
    super.data = value;
  }

  [key: string]: any;
}

class RelationInnerOptionsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  select?: string[];

  @Optional()
  @ValidateNested()
  @Transform(({ value }) => {
    if (typeof value !== 'object' || value === null) {
      return value;
    }
    const transformed: Record<string, WhereConditionDto> = {};
    console.log('INSIDE TRANSFORM', value);
    for (const [key, condition] of Object.entries(value)) {
      console.log(condition);
      const whereCondition = new WhereConditionDto();
      Object.assign(whereCondition, condition);

      const errors = validateSync(whereCondition);
      if (errors.length > 0) {
        throw new BadRequestException('Error : ', errors.toString());
      }

      transformed[key] = whereCondition;
    }

    return transformed;
  })
  where?: { [key: string]: WhereConditionDto };

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderByOptionsDto)
  orderBy?: OrderByOptionsDto;
}
