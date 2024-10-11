import { IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateUserDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  password?: string;

  @IsString()
  email: string;

  @IsString()
  @Optional()
  apiKey?: string;

  @IsString()
  @Optional()
  siret?: string;

  @IsString()
  @Optional()
  schema?: string;
}
