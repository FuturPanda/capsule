import {
  IsArray,
  IsObject,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { Optional } from 'class-validator-extended';
import { Transform } from 'class-transformer';
import { WhereConditionDto } from './query-options/where-option.dto';
import { BadRequestException } from '@nestjs/common';
import { UpdateOptions } from '@capsulesh/shared-types';

export class UpdateOptionsDto implements UpdateOptions {
  @IsObject()
  data: Record<string, any>;

  @Optional()
  @ValidateNested()
  @Transform(({ value }) => {
    if (typeof value !== 'object' || value === null) {
      return value;
    }
    const transformed: Record<string, WhereConditionDto> = {};
    for (const [key, condition] of Object.entries(value)) {
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

  @IsArray()
  @Optional()
  @IsString({ each: true })
  returning?: string[];
}
