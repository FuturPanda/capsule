import { CapsuleEventType } from "@capsulesh/shared-types";

export class EventEmitter {
  private events: Map<string, Array<(data: any) => void>> = new Map();

  on(event: CapsuleEventType, callback: (data: any) => void): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)?.push(callback);
    return () => {
      const callbacks = this.events.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  emit(event: string, data: any): void {
    console.log("In Emit !!! : ", event, data);
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }
}
