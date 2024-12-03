import { Injectable } from '@nestjs/common';
import { SurrealService } from '../surreal/surreal.service';
import { EventOperation, EventStatusEnum } from './_utils/types/event.type';
import { CreateEventDto } from './_utils/dto/request/create-event.dto';

@Injectable()
export class EventsRepository {
  constructor(private readonly surrealService: SurrealService) {}

  saveEvent = (event: CreateEventDto) =>
    this.surrealService.insert(EventOperation, {
      timestamp: event.timestamp,
      type: event.type,
      payload: event.payload,
      author: event.author,
      status: EventStatusEnum.PENDING,
    });

  async deleteAll() {
    return this.surrealService.delete(EventOperation.name);
  }
}
