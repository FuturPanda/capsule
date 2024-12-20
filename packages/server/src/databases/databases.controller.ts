import { Controller, Get } from '@nestjs/common';
import { DatabasesService } from './databases.service';

@Controller('databases')
export class DatabasesController {
  constructor(private readonly databasesService: DatabasesService) {}

  // @Post()
  //  createDatabase(@Body() createDatabaseDto: CreateDatabaseDto) {
  //    return this.databasesService.createDatabase(createDatabaseDto);
  //  }

  @Get()
  getAllDatabase() {
    return this.databasesService.getAllDatabases();
  }

  /* @Put('database/:dbId')
   updateDatabase(
     @Param('dbId') dbId: string,
     @Body() updateDatabaseDto: UpdateDatabaseDto,
   ) {
     return this.databasesService.updateDatabase(dbId, updateDatabaseDto);
   }
 
   @Delete('database')
   deleteDatabase(@Param('dbId') dbId: string) {
     return this.databasesService.deleteDatabase(dbId);
   }*/
}
