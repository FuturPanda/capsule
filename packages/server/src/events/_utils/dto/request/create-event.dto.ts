import { EventTypeEnum } from '../../types/event.type';

export class CreateEventDto {
  type: EventTypeEnum;
  timestamp: number;
  payload: any;
  author: string;
}
