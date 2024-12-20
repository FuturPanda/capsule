import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Optional } from 'class-validator-extended';
import { ValidateNested, validateSync } from 'class-validator';
import { Transform } from 'class-transformer';
import { ClassType } from '../_types/generics';

export function KeyValue<T extends object>(
  filterQuery: ClassType<T>,
  options?: KeyValueDecoratorOpts,
) {
  return applyDecorators(
    Optional(),
    ValidateNested(),
    Transform(({ value }) => {
      if (typeof value !== 'object' || value === null) {
        return value;
      }
      const transformed: Record<string, T> = {};
      for (const [key, condition] of Object.entries(value)) {
        const typedCondition = new filterQuery();
        Object.assign(typedCondition, condition);

        const errors = validateSync(typedCondition);
        if (errors.length > 0) {
          throw new BadRequestException('Error : ', errors.toString());
        }

        transformed[key] = typedCondition;
      }

      return transformed;
    }),
  );
}

export class KeyValueDecoratorOpts {}
