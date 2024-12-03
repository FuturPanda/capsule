import { Controller, Get, Post } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Post()
  processEvents() {
    console.log('event');
    return this.eventsService.createRandomEvents();
  }

  @Post('test')
  createRandomEvents() {
    console.log('event');
    return this.eventsService.createRandomEvents();
  }
}
