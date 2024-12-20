import { Body, Controller, Post, Req } from '@nestjs/common';
import { MigrationsService } from './migrations.service';
import { CheckMigrationDto } from './_utils/dto/request/check-migration.dto';

@Controller('migrations')
export class MigrationsController {
  constructor(private readonly migrationsService: MigrationsService) {}

  @Post('/check')
  runMigration(
    @Req() request: Request,
    @Body() checkMigrationDto: CheckMigrationDto,
  ) {
    const apiKey = request.headers['client-id'];
    return this.migrationsService.runMigrations(apiKey, checkMigrationDto);
  }
}
