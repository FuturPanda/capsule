import { Module } from '@nestjs/common';
import { EventModel } from 'src/_utils/models/root/event';
import { EventAttendeeModel } from 'src/_utils/models/root/event-attendees.model';
import { ChiselModule } from 'src/chisel/chisel.module';
import { PersonsModule } from 'src/persons/persons.module';
import { EventsController } from './events.controller';
import { EventsMapper } from './events.mapper';
import { EventsRepository } from './events.repository';
import { EventsService } from './events.service';

@Module({
  imports: [
    ChiselModule.forFeature(EventAttendeeModel),
    ChiselModule.forFeature(EventModel),
    PersonsModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository, EventsMapper],
  exports: [EventsService, EventsRepository, EventsMapper],
})
export class EventsModule {}
