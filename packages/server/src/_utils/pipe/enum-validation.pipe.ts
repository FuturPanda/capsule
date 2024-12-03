import {
  BadRequestException,
  Injectable,
  PipeTransform,
  Scope,
  Type,
} from '@nestjs/common';

type EnumValidationOptions = {
  transformToUpperCase: boolean;
  paramName: string;
};

export function validateEnum<T extends { [key: string]: string }>(
  enumType: T,
  validationOptions: EnumValidationOptions = {
    transformToUpperCase: false,
    paramName: 'value',
  },
): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class EnumValidationPipe implements PipeTransform {
    transform(value: string): T[keyof T] {
      const processedValue = validationOptions.transformToUpperCase
        ? value.toUpperCase()
        : value;
      const enumValues = Object.values(enumType);
      if (!enumValues.includes(processedValue)) {
        throw new BadRequestException(
          `${validationOptions.paramName} '${value}' is invalid. Must be one of: ${enumValues.join(', ')}`,
        );
      }
      return processedValue as T[keyof T];
    }
  }

  return EnumValidationPipe;
}
