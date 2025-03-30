import { Injectable } from '@nestjs/common';
import { QueryOptionsDto } from 'src/dynamic-queries/_utils/dto/request/query-options.dto';
import { CreateEventDto } from './dto/request/create-event.dto';
import { UpdateEventDto } from './dto/request/update-person.dto';
import { EventsMapper } from './events.mapper';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsMapper: EventsMapper,
    private readonly eventsRepository: EventsRepository,
  ) {}
  deleteEvent(id: number) {
    throw new Error('Method not implemented.');
  }
  updateEvent(id: number, updateTaskDto: UpdateEventDto) {
    throw new Error('Method not implemented.');
  }
  getOneEvent(queryParams: any) {
    throw new Error('Method not implemented.');
  }
  createEvent(createEventDto: CreateEventDto) {
    const event = this.eventsRepository.createEvent(createEventDto);
  }
  listEvents(queryOptions: QueryOptionsDto) {
    const events = this.eventsRepository.findAllEvents();
    return this.eventsMapper.toGetEventsDto(events);
  }
}
