import { UpdateEvent } from '@capsulesh/shared-types';

export class UpdateEventDto implements UpdateEvent {
  title?: string;
  description?: string | null;
  startTime?: Date;
  endTime?: Date;
  location?: string | null;
  isAllDay?: boolean;
  attendees?: string[];
  category?: string | null;
}
