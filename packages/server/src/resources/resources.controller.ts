import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateDatabaseDto } from './_utils/dto/request/create-database.dto';
import { UpdateDatabaseDto } from './_utils/dto/request/update-database.dto';

export enum ResourceTypeEnum {
  DATABASE = 'DATABASE',
}

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post('database')
  createDatabase(@Body() createDatabaseDto: CreateDatabaseDto) {
    return this.resourcesService.createDatabase(createDatabaseDto);
  }

  @Put('database/:dbId')
  updateDatabase(
    @Param('dbId') dbId: string,
    @Body() updateDatabaseDto: UpdateDatabaseDto,
  ) {
    return this.resourcesService.updateDatabase(dbId, updateDatabaseDto);
  }

  @Delete('database')
  deleteResource(@Param('dbId') dbId: string) {
    return this.resourcesService.deleteDatabase(dbId);
  }
}
