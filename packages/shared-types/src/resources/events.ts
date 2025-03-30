import { GetPerson } from "./persons";

export interface Event {
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

export interface GetEvent {
  id: number;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  location: string | null;
  isAllDay: boolean;
  attendees: GetPerson[] | null;
  category: string | null;
  createdBy: string;
}

export interface CreateEvent {
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

export interface UpdateEvent {
  title?: string;
  description?: string | null;
  startTime?: Date;
  endTime?: Date;
  location?: string | null;
  isAllDay?: boolean;
  attendees?: string[];
  category?: string | null;
}
