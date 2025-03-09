import { Injectable } from '@nestjs/common';
import { EventModel } from 'src/_utils/models/root/event';
import { PersonsMapper } from 'src/persons/persons.mapper';
import { GetEventDto } from './dto/response/get-person.dto';

@Injectable()
export class EventsMapper {
  constructor(private readonly personsMapper: PersonsMapper) {}

  toGetEventsDto(events: EventModel[]) {
    return events.map((event) => this.toGetEventDto(event));
  }

  toGetEventDto(event: EventModel): GetEventDto {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      isAllDay: event.isAllDay,
      attendees: [], //this.personsMapper.toGetPersonsDto(attendees),
      category: event.category,
      createdBy: event.created_by,
    };
  }
}
