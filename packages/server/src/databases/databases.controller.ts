import { ChiselSchema } from '@capsule/chisel';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DatabasesService } from './databases.service';

@ApiTags('Databases')
@Controller('databases')
export class DatabasesController {
  constructor(private readonly databasesService: DatabasesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all databases' })
  getDatabases() {}

  @Post()
  @ApiOperation({ summary: 'Create a new databases.' })
  createDatabase(@Body() databaseSchema: ChiselSchema) {
    return this.databasesService.createDatabase(databaseSchema);
  }
}
