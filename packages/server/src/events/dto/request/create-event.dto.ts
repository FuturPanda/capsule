import { CreateEvent } from '@capsulesh/shared-types';

export class CreateEventDto implements CreateEvent {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isAllDay?: boolean;
  attendees?: string[];
  category?: string;
  createdBy: string;
}
