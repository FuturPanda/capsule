import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateDatabaseDto } from './_utils/dto/request/create-database.dto';
import { DatabasesService } from './databases.service';

@Controller('databases')
export class DatabasesController {
  constructor(private readonly databasesService: DatabasesService) {}

  @Post()
  createDatabase(
    @Body() createDatabaseDto: CreateDatabaseDto,
    @Req() request: Request,
  ) {
    const apiKey = request.headers['client-id'];
    console.log('in database creation controller');
    return this.databasesService.createDatabase(createDatabaseDto, apiKey);
  }

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
