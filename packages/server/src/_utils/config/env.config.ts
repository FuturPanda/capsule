import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsOptional, IsPort, IsString, validateSync } from 'class-validator';
import { exit } from 'process';

export class EnvironmentVariables {
  @IsPort()
  PORT = '3000';

  @IsString()
  OWNER_EMAIL: string;

  @IsString()
  OWNER_PASSWORD: string;

  @IsString()
  IS_CLOUD_PROVIDED: string = 'false';

  @IsOptional()
  @IsString()
  CLOUD_CAPSULE_CALLBACK_URL: string | null;

  @IsOptional()
  @IsString()
  CLOUD_CAPSULE_URL: string | null;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    new Logger(validateEnv.name).error(errors.toString());
    exit();
  }
  return validatedConfig;
}

export class EnvironmentService extends ConfigService<
  EnvironmentVariables,
  true
> {}
