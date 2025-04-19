import { EventEmitter2 } from '@nestjs/event-emitter';

interface EmitEventOptions {
  eventName: string;
  transformPayload?: (result: any, ...args: any[]) => any;
}
export function EmitEvent(options: EmitEventOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const eventEmitter: EventEmitter2 = this.eventEmitter;

      if (!eventEmitter) {
        console.warn(
          `EventEmitter not found in ${target.constructor.name}. Make sure to inject it.`,
        );
        return originalMethod.apply(this, args);
      }

      try {
        const result = await originalMethod.apply(this, args);

        let payload;
        try {
          payload = options.transformPayload
            ? options.transformPayload(result, ...args)
            : result;
        } catch (payloadError) {
          console.error(
            `Error transforming payload for event ${options.eventName}:`,
            payloadError,
          );
          payload = {
            error: 'Error transforming payload',
            rawResult: result,
          };
        }

        try {
          eventEmitter.emit(options.eventName, payload);
        } catch (emitError) {
          console.error(
            `Error emitting event ${options.eventName}:`,
            emitError,
          );
        }

        return result;
      } catch (error) {
        try {
          eventEmitter.emit(`${options.eventName}.error`, {
            error: error.message,
            timestamp: new Date(),
          });
        } catch (emitError) {
          console.error(`Error emitting error event:`, emitError);
        }

        throw error;
      }
    };

    return descriptor;
  };
}
export function createEntityEventDecorators(entityName: string) {
  const eventTypes = {
    CREATED: `${entityName}.created`,
    UPDATED: `${entityName}.updated`,
    DELETED: `${entityName}.deleted`,
  };

  const emitCreated = (
    transformPayload?: (result: any, ...args: any[]) => any,
  ) =>
    EmitEvent({
      eventName: eventTypes.CREATED,
      transformPayload:
        transformPayload ||
        ((entity) => ({
          [entityName]: entity,
          timestamp: new Date(),
        })),
    });

  const emitUpdated = (
    transformPayload?: (result: any, ...args: any[]) => any,
  ) =>
    EmitEvent({
      eventName: eventTypes.UPDATED,
      transformPayload:
        transformPayload ||
        ((entity) => ({
          [entityName]: entity,
        })),
    });

  const emitDeleted = (
    transformPayload?: (result: any, ...args: any[]) => any,
  ) =>
    EmitEvent({
      eventName: eventTypes.DELETED,
      transformPayload:
        transformPayload ||
        ((entity) => ({
          [entityName]: entity,
        })),
    });

  const withEntityEvents = (target: any) => {
    const methods = Object.getOwnPropertyNames(target.prototype);

    methods.forEach((method) => {
      if (method === 'create') {
        const descriptor = Object.getOwnPropertyDescriptor(
          target.prototype,
          method,
        );
        const newDescriptor = emitCreated()(
          target.prototype,
          method,
          descriptor,
        );
        Object.defineProperty(target.prototype, method, newDescriptor);
      }

      if (method === 'update') {
        const descriptor = Object.getOwnPropertyDescriptor(
          target.prototype,
          method,
        );
        const newDescriptor = emitUpdated()(
          target.prototype,
          method,
          descriptor,
        );
        Object.defineProperty(target.prototype, method, newDescriptor);
      }

      if (method === 'delete' || method === 'remove') {
        const descriptor = Object.getOwnPropertyDescriptor(
          target.prototype,
          method,
        );
        const newDescriptor = emitDeleted()(
          target.prototype,
          method,
          descriptor,
        );
        Object.defineProperty(target.prototype, method, newDescriptor);
      }
    });

    return target;
  };

  return {
    eventTypes,
    emitCreated,
    emitUpdated,
    emitDeleted,
    withEntityEvents,
  };
}

export const TaskEvents = createEntityEventDecorators('task');
