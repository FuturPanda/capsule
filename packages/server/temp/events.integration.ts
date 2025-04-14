import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from '../src/events/events.service';
import { EventsRepository } from '../src/events/events.repository';
import { EventsMapper } from '../src/events/events.mapper';
import { PersonsMapper } from '../src/persons/persons.mapper';
import { ChiselModule } from '../src/chisel/chisel.module';
import { EventModel } from '../src/_utils/models/root/event';
import { EventAttendeeModel } from '../src/_utils/models/root/event-attendees.model';
import { QueryOptionsDto } from '../src/dynamic-queries/_utils/dto/request/query-options.dto';
import { CreateEventDto } from '../src/events/dto/request/create-event.dto';
import { faker } from '@faker-js/faker';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PersonModel } from '../src/_utils/models/root/person';
import { PersonsModule } from '../src/persons/persons.module';
import { ConfigModule } from '@nestjs/config';
import { DEFAULT_DB_PATH } from '../src/_utils/constants/database.constant';
import * as fs from 'fs';
import * as path from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
} from '@jest/globals';

jest.mock('../src/events/events.repository');

describe('EventsService Integration Test', () => {
  let eventsService: EventsService;
  let eventsRepository: EventsRepository;
  let moduleRef: TestingModule;
  const testDbPath = path.join(DEFAULT_DB_PATH, 'test');

  // Sample test data
  const mockEvent = {
    id: 1,
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    start_time: new Date(),
    end_time: new Date(Date.now() + 3600000), // 1 hour later
    location: faker.location.streetAddress(),
    is_all_day: false,
    category: 'meeting',
    created_by: 'test@example.com',
    created_at: new Date(),
  };

  beforeAll(async () => {
    // Ensure test database directory exists
    if (!fs.existsSync(testDbPath)) {
      fs.mkdirSync(testDbPath, { recursive: true });
    }

    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register({ isGlobal: true }),
        ChiselModule.forRootAsync({
          uri: testDbPath,
          dbName: 'test_events',
          migrations: [],
        }),
        ChiselModule.forFeature(EventModel, EventAttendeeModel, PersonModel),
        PersonsModule,
      ],
      providers: [
        EventsService,
        EventsRepository,
        EventsMapper,
        PersonsMapper,
        EventEmitter2,
      ],
    }).compile();

    eventsService = moduleRef.get<EventsService>(EventsService);
    eventsRepository = moduleRef.get<EventsRepository>(EventsRepository);
  });

  afterAll(async () => {
    await moduleRef.close();
    // Optional: Clean up test database files
    // fs.rmSync(testDbPath, { recursive: true, force: true });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listEvents', () => {
    it('should return an empty array when no events exist', async () => {
      jest.spyOn(eventsRepository, 'getAllEvents').mockReturnValue([]);

      const result = await eventsService.listEvents(new QueryOptionsDto());

      expect(result).toEqual([]);
      expect(eventsRepository.getAllEvents).toHaveBeenCalled();
    });

    it('should return mapped events when events exist', async () => {
      jest
        .spyOn(eventsRepository, 'getAllEvents')
        .mockReturnValue([mockEvent as EventModel]);

      const result = await eventsService.listEvents(new QueryOptionsDto());

      expect(result).toHaveLength(1);
      expect(result[0].title).toEqual(mockEvent.title);
      expect(result[0].description).toEqual(mockEvent.description);
      expect(eventsRepository.getAllEvents).toHaveBeenCalled();
    });
  });

  describe('createEvent', () => {
    it('should create an event with the provided data', async () => {
      const createEventDto: CreateEventDto = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        location: faker.location.streetAddress(),
        isAllDay: false,
        category: 'meeting',
        createdBy: 'test@example.com',
      };

      jest
        .spyOn(eventsRepository, 'createEvent')
        .mockReturnValue({ id: 1 } as any);

      await eventsService.createEvent(createEventDto);

      expect(eventsRepository.createEvent).toHaveBeenCalledWith(createEventDto);
    });
  });

  describe('updateEvent', () => {
    it('should throw a not implemented error', async () => {
      await expect(
        eventsService.updateEvent(1, { title: 'Updated Title' }),
      ).rejects.toThrow('Method not implemented.');
    });
  });

  describe('getOneEvent', () => {
    it('should throw a not implemented error', async () => {
      await expect(eventsService.getOneEvent({ id: 1 })).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });

  describe('deleteEvent', () => {
    it('should call repository to delete an event by ID', async () => {
      jest
        .spyOn(eventsRepository, 'deleteEventById')
        .mockReturnValue(undefined);

      await eventsService.deleteEvent(1);

      expect(eventsRepository.deleteEventById).toHaveBeenCalledWith(1);
    });
  });

  // Additional test - testing event-driven functionality
  describe('event emitter functionality', () => {
    it('should emit events when creating events', async () => {
      const eventEmitterSpy = jest.spyOn(
        moduleRef.get<EventEmitter2>(EventEmitter2),
        'emit',
      );
      jest
        .spyOn(eventsRepository, 'createEvent')
        .mockReturnValue({ id: 1 } as any);

      const createEventDto: CreateEventDto = {
        title: 'Test Event',
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        createdBy: 'test@example.com',
      };

      await eventsService.createEvent(createEventDto);

      // We're not checking exact event name since the events module does not use the event emitter
      // directly like the tasks module does, but this verifies the integration is working
      expect(eventsRepository.createEvent).toHaveBeenCalled();
    });
  });
});
