import { Event } from '@capsulesh/shared-types';

export class EventModel implements Event {
  id: number;
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  location?: string;
  is_all_day: boolean;
  category?: string;
  created_by: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
