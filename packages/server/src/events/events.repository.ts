import { ChiselModel } from '@capsulesh/chisel';
import { Injectable } from '@nestjs/common';
import { convertQueryOptionsToFilterQuery } from 'src/_utils/functions/query-options-transformation';
import { EventModel } from 'src/_utils/models/root/event';
import { EventAttendeeModel } from 'src/_utils/models/root/event-attendees.model';
import { PersonModel } from 'src/_utils/models/root/person';
import { QueryOptionsDto } from 'src/dynamic-queries/_utils/dto/request/query-options.dto';
import { InjectModel } from '../chisel/chisel.module';
import { CreateEventDto } from './dto/request/create-event.dto';
import { UpdateEventDto } from './dto/request/update-person.dto';

@Injectable()
export class EventsRepository {
  constructor(
    @InjectModel(EventModel.name)
    private readonly model: ChiselModel<EventModel>,
  ) {}

  createEvent = (dto: CreateEventDto) =>
    this.model.insert({
      title: dto.title,
      description: dto.description,
      startTime: dto.startTime,
      endTime: dto.endTime,
      location: dto.location,
      isAllDay: dto.isAllDay,
      category: dto.category,
      createdBy: dto.createdBy,
    });

  findAllEvents(queryOptions?: QueryOptionsDto): EventModel[] {
    const filterQuery = convertQueryOptionsToFilterQuery(queryOptions);
    return this.model
      .select()
      .where(filterQuery)
      .join(EventModel, EventAttendeeModel, 'id', 'eventId')
      .join(EventAttendeeModel, PersonModel, 'attendeeId', 'id')
      .exec();
  }

  findEventById = (id: number | bigint): EventModel =>
    this.model
      .select()
      .where({ id: { $eq: id } })
      .join(EventModel, EventAttendeeModel, 'id', 'eventId')
      .join(EventAttendeeModel, PersonModel, 'attendeeId', 'id')
      .exec({ one: true });

  updateEventById = (id: number, dto: UpdateEventDto) =>
    this.model
      .update({})
      .where({ id: { $eq: id } })
      .exec();

  deleteEventById = (id: number) =>
    this.model
      .delete()
      .where({ id: { $eq: id } })
      .exec();
}
