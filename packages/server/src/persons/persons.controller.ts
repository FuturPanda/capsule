import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { QueryOptionsDto } from 'src/dynamic-queries/_utils/dto/request/query-options.dto';
import { CreatePersonDto } from './dto/request/create-person.dto';
import { UpdatePersonDto } from './dto/request/update-person.dto';
import { PersonsService } from './persons.service';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Get()
  listPersons(@Query() queryOptions: QueryOptionsDto) {
    console.log('Query params::::::', JSON.stringify(queryOptions));
    return this.personsService.listPersons(queryOptions);
  }

  @Post()
  createPerson(@Body() createTaskDto: CreatePersonDto) {
    return this.personsService.createPerson(createTaskDto);
  }

  @Get('one')
  getOnePerson(@Query() queryParams: any) {
    return this.personsService.getOnePerson(queryParams);
  }

  @Patch(':id')
  updatePerson(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdatePersonDto,
  ) {
    return this.personsService.updatePerson(id, updateTaskDto);
  }

  @Delete(':id')
  deletePerson(@Param('id') id: number) {
    return this.personsService.deletePerson(id);
  }
}
