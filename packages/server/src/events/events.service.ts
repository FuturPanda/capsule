import { Injectable } from '@nestjs/common';
import { SurrealService } from '../surreal/surreal.service';
import { surql } from 'surrealdb';
import { EventsRepository } from './events.repository';
import { CreateEventDto } from './_utils/dto/request/create-event.dto';

enum EventTypeEnum {
  CREATE_DATABASE = 'CREATE_DATABASE',
  CREATE_TABLE = 'CREATE_TABLE',
}

const CAPSULE_KIT_CLIENT = 'CAPSULE_KIT_CLIENT';
const FUTUR_PANDA_DEV = 'FUTUR_PANDA_DEV';

@Injectable()
export class EventsService {
  constructor(
    private readonly surrealService: SurrealService,
    private readonly eventsRepository: EventsRepository,
  ) {}

  async createRandomEvents() {
    const q = surql`
      CREATE |event:100| CONTENT {
        type: rand::enum(${Object.values(EventTypeEnum)}),
        client:rand::enum(${CAPSULE_KIT_CLIENT}, ${FUTUR_PANDA_DEV}),
        data: {
          id: rand::int(0,220),
          updatedValue: rand::string(10, 73)
        } ,
        time: {
          created_at: rand::time(1611847404, 1706455404),
          updated_at: rand::time(1651155804, 1716906204)
        }
      };
    `;
    return this.surrealService.query(q);
  }

  async saveEvent(event: CreateEventDto) {
    return this.eventsRepository.saveEvent(event);
  }

  async processEvents() {}

  getAllEvents() {}
}
