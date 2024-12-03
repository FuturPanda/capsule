// test/integration/events.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EventsModule } from '../../src/events/events.module';
import { EventsService } from '../../src/events/events.service';
import { EventsRepository } from '../../src/events/events.repository';
import {
  EventStatusEnum,
  EventTypeEnum,
} from '../../src/events/_utils/types/event.type';
import { SurrealModule } from '../../src/surreal/surreal.module';
import { SurrealService } from '../../src/surreal/surreal.service';

describe('Events Integration', () => {
  let module: TestingModule;
  let eventsService: EventsService;
  let eventRepository: EventsRepository;
  let surrealService: SurrealService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        EventsModule,
        SurrealModule.forRoot({
          path: 'surrealkv://surrealdb',
          namespace: 'my_namespace',
          database: 'my_database',
          username: 'root',
          password: 'root',
        }),
      ],
    }).compile();
    surrealService = module.get<SurrealService>(SurrealService);
    eventsService = module.get<EventsService>(EventsService);
    eventRepository = module.get<EventsRepository>(EventsRepository);
  });

  beforeEach(async () => {
    await surrealService.onModuleInit();
    await eventRepository.deleteAll();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('Event Processing Flow', () => {
    it('should process an event through the complete lifecycle', async () => {
      const event = await eventsService.saveEvent({
        type: EventTypeEnum.CREATE_DATABASE,
        payload: {
          userId: '123',
          name: 'John Doe',
        },
        author: 'CAPSULE-KIT',
        timestamp: Date.now(),
      });
      console.log(event);
      expect(event[0].status).toBe(EventStatusEnum.PENDING);

      // await eventsService.processEvent(event.id);

      // Verify final state
      // const processedEvent = await eventRepository.findById(event.id);
      // expect(processedEvent).toBeDefined();
      // expect(processedEvent.status).toBe(EventStatus.COMPLETED);
    });

    it('should handle failed event processing', async () => {
      // Create an event that will fail processing
      // const event = await eventsService.saveEvent({
      //   type: 'UNKNOWN_EVENT_TYPE',
      //   payload: {},
      // });
      // Attempt to process the event
      // await expect(eventsService.processEvent(event.id)).rejects.toThrow(
      //   'Unhandled event type',
      // );
      // Verify the event is marked as failed
      // const failedEvent = await eventRepository.findById(event.id);
      // expect(failedEvent.status).toBe(EventStatus.FAILED);
    });

    it('should process multiple events in order', async () => {
      // Create multiple events
      // const events = await Promise.all([
      //   eventsService.saveEvent({
      //     type: 'USER_CREATED',
      //     payload: { userId: '1' },
      //   }),
      //   eventsService.saveEvent({
      //     type: 'USER_CREATED',
      //     payload: { userId: '2' },
      //   }),
      //   eventsService.saveEvent({
      //     type: 'USER_CREATED',
      //     payload: { userId: '3' },
      //   }),
      // ]);
      // Process all events
      // await Promise.all(
      //   events.map((event) => eventsService.processEvent(event.id)),
      // );
      // Verify all events were processed
      // const processedEvents = await eventRepository.findByIds(
      //   events.map((e) => e.id),
      // );
      // processedEvents.forEach((event) => {
      //   expect(event.status).toBe(EventStatus.COMPLETED);
      // });
    });
  });

  describe('Event Queue Consumer', () => {
    it('should handle incoming queue messages', async () => {
      // Simulate a queue message
      const queueMessage = {
        type: 'USER_CREATED',
        payload: {
          userId: '123',
          name: 'John Doe',
        },
      };

      // Process the message through your queue consumer
      // await eventsService.handleQueueMessage(queueMessage);

      // Verify the event was saved and processed
      // const events = await eventRepository.findByType('USER_CREATED');
      // expect(events).toHaveLength(1);
      // expect(events[0].status).toBe(EventStatus.COMPLETED);
      // expect(events[0].payload).toEqual(queueMessage.payload);
    });
  });
});
