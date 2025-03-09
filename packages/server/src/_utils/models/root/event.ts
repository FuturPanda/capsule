import { Event } from '@capsulesh/shared-types';

export class EventModel implements Event {
  id: number;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isAllDay: boolean;
  category?: string;
  created_by: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
