import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ColumnConstraints {
  @IsOptional()
  @IsBoolean()
  primaryKey?: boolean;

  @IsOptional()
  @IsBoolean()
  nullable?: boolean;
}

export class Column {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsBoolean()
  autoIncrement?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => ColumnConstraints)
  constraints?: ColumnConstraints;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  enumValues?: string[];

  @IsOptional()
  @IsString()
  defaultValue?: string;
}

export class MigrationOperation {
  @IsString()
  type: string;

  @IsString()
  tableName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Column)
  columns: Column[];
}

export class Properties {
  @IsString()
  now: string;

  @IsBoolean()
  autoIncrement: boolean;
}

export class Migration {
  @IsString()
  version: string;

  @IsString()
  changeSetId: string;

  @IsString()
  author: string;

  @IsString()
  description: string;

  @IsString()
  database: string;

  @ValidateNested()
  @Type(() => Properties)
  properties: Properties;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MigrationOperation)
  operations: MigrationOperation[];
}

export class CheckMigrationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Migration)
  migrations: Migration[];
}
