export class EventOperation {
  id?: string;
  timestamp: number;
  type: string;
  payload: any;
  author: string;
  status?: EventStatusEnum;
}

export enum EventStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum EventTypeEnum {
  CREATE_DATABASE = 'CREATE_DATABASE',
}
