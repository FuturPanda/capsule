import { DeleteOptions } from '@capsulesh/shared-types';
import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { Optional } from 'class-validator-extended';
import { WhereConditionDto } from './query-options/where-option.dto';

export class DeleteOptionsDto implements DeleteOptions {
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
