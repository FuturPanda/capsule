import { Body, Controller, Post } from '@nestjs/common';
import {
    ScopesAndClientIdentifier,
    ScopesAndClientIdentifierType,
} from 'src/_utils/decorators/scopes.decorator';
import { CheckMigrationDto } from './_utils/dto/request/check-migration.dto';
import { MigrationsService } from './migrations.service';

@Controller('migrations')
export class MigrationsController {
  constructor(private readonly migrationsService: MigrationsService) {}

  @Post('/check')
  runMigration(
    @ScopesAndClientIdentifier()
    { clientIdentifier }: ScopesAndClientIdentifierType,
    @Body() checkMigrationDto: CheckMigrationDto,
  ) {

    return this.migrationsService.runMigrations(
      clientIdentifier,
      checkMigrationDto,
    );
  }
}
