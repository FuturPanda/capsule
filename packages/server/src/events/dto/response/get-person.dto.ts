import { GetEvent } from '@capsulesh/shared-types';
import { GetPersonDto } from 'src/persons/dto/response/get-person.dto';

export class GetEventDto implements GetEvent {
  id: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  isAllDay: boolean;
  attendees: GetPersonDto[];
  category: string;
  createdBy: string;
}
