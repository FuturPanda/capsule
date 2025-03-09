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
import { ApiTags } from '@nestjs/swagger';
import { QueryOptionsDto } from 'src/dynamic-queries/_utils/dto/request/query-options.dto';
import { CreateEventDto } from './dto/request/create-event.dto';
import { UpdateEventDto } from './dto/request/update-person.dto';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  listEvents(@Query() queryOptions: QueryOptionsDto) {
    return this.eventsService.listEvents(queryOptions);
  }

  @Post()
  createEvent(@Body() createTaskDto: CreateEventDto) {
    return this.eventsService.createEvent(createTaskDto);
  }

  @Get('one')
  getOneEvent(@Query() queryParams: any) {
    return this.eventsService.getOneEvent(queryParams);
  }

  @Patch(':id')
  updateEvent(@Param('id') id: number, @Body() updateTaskDto: UpdateEventDto) {
    return this.eventsService.updateEvent(id, updateTaskDto);
  }

  @Delete(':id')
  deleteEvent(@Param('id') id: number) {
    return this.eventsService.deleteEvent(id);
  }
}
