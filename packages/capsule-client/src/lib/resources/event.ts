import { ApiClient } from '../axios';
import { ListResponse, PaginationParams } from '../types';
import { BaseResource } from './base';

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
  location?: string;
  attendees?: string[]; // Array of user/people IDs
  organizer?: string;   // User/person ID
  status?: 'scheduled' | 'canceled' | 'completed';
  type: string;  // Discriminator field to identify event type
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventParams {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  attendees?: string[];
  organizer?: string;
  status?: 'scheduled' | 'canceled' | 'completed';
  metadata?: Record<string, any>;
}

export interface UpdateEventParams {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  attendees?: string[];
  organizer?: string;
  status?: 'scheduled' | 'canceled' | 'completed';
  metadata?: Record<string, any>;
}

export class Events extends BaseResource<Event, CreateEventParams, UpdateEventParams> {
  constructor(apiClient: ApiClient) {
    super(apiClient, '/events');
  }

  async getUpcoming(params?: PaginationParams): Promise<ListResponse<Event>> {
    return this.apiClient.get<ListResponse<Event>>(`${this.basePath}/upcoming`, params);
  }

  async getCalendar(startDate: string, endDate: string): Promise<Event[]> {
    return this.apiClient.get<Event[]>(`${this.basePath}/calendar`, {
      startDate,
      endDate
    });
  }
}
