import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  Logger,
  MessageEvent,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { Observable, Subject, filter } from 'rxjs';

export interface EventData<T = any> {
  type: string;
  timestamp: Date;
  payload: T;
  scope?: string[];
}

export interface ChiselMessage<T = any> extends MessageEvent {
  data: EventData<T>;
}

@Injectable()
export class ReactivityService implements OnModuleInit {
  private readonly logger = new Logger(ReactivityService.name);
  private eventSubject = new Subject<ChiselMessage>();
  private connectedClients = 0;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    this.eventEmitter.onAny((eventType: string, payload) => {
      this.logger.log(`Event emitted: ${eventType}`);
      this.logger.debug('Payload:', JSON.stringify(payload, null, 2));

      this.emitEvent(eventType, payload);
    });

    this.logger.log('Event logger initialized');
  }

  emitEvent<T>(type: string, payload: T, scope?: string[]) {
    const event: EventData<T> = {
      type,
      timestamp: new Date(),
      payload,
      scope,
    };

    this.eventSubject.next({ data: event });
  }

  getSseConnectionObservable(
    clientIdentifier: string,
    clientScopes: string[],
  ): Observable<ChiselMessage> {
    this.connectedClients++;
    this.logger.log(`New SSE client connected. Total clients: `);
    this.cacheManager.set(clientIdentifier, clientScopes);

    return new Observable<ChiselMessage>((subscriber) => {
      const subscription = this.eventSubject
        .pipe(
          filter((event) => {
            if (!event.data.scope || event.data.scope.length === 0) {
              // TODO : proper filtering security
              return true;
            }
            return event.data.scope.some((scope) =>
              clientScopes.includes(scope),
            );
          }),
        )
        .subscribe(subscriber);

      return () => {
        subscription.unsubscribe();
        this.connectedClients--;
        this.logger.log(
          `SSE client disconnected. Remaining clients: ${this.connectedClients}`,
        );
        this.cacheManager
          .del(clientIdentifier)
          .catch((err) =>
            this.logger.error(`Failed to remove client from cache: ${err}`),
          );
      };
    });
  }
}
