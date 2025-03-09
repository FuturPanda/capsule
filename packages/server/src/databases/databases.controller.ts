import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ScopesAndClientIdentifier,
  ScopesAndClientIdentifierType,
} from 'src/_utils/decorators/scopes.decorator';
import { CreateDatabaseDto } from './_utils/dto/request/create-database.dto';
import { DatabasesService } from './databases.service';

@Controller('databases')
export class DatabasesController {
  constructor(private readonly databasesService: DatabasesService) {}

  @Post()
  createDatabase(
    @Body() createDatabaseDto: CreateDatabaseDto,
    @ScopesAndClientIdentifier()
    { clientIdentifier }: ScopesAndClientIdentifierType,
  ) {
    return this.databasesService.createDatabase(
      createDatabaseDto,
      clientIdentifier,
    );
  }

  @Get()
  getAllDatabase(
    @ScopesAndClientIdentifier()
    { clientIdentifier }: ScopesAndClientIdentifierType,
  ) {
    return this.databasesService.getAllDatabases(clientIdentifier);
  }

  @Delete('database')
  deleteDatabase(@Param('dbId') dbId: number) {
    return this.databasesService.deleteDatabase(dbId);
  }
}
