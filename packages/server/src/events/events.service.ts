import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  constructor() {}

  async getAllEvents(page: number, limit: number) {
    return {
      data: [
        {
          id: '1',
          title: 'Team Meeting',
          description: 'Weekly team sync',
          startDate: '2025-07-15T14:00:00Z',
          endDate: '2025-07-15T15:00:00Z',
          location: 'Conference Room A',
          attendees: ['user1', 'user2'],
          organizer: 'user1',
          status: 'scheduled',
          type: 'meeting',
          createdAt: '2025-07-10T10:00:00Z',
          updatedAt: '2025-07-10T10:00:00Z',
        },
      ],
      meta: {
        total: 1,
        page,
        limit,
        totalPages: 1,
      },
    };
  }

  async getEventById(id: string) {
    return {
      id,
      title: 'Team Meeting',
      description: 'Weekly team sync',
      startDate: '2025-07-15T14:00:00Z',
      endDate: '2025-07-15T15:00:00Z',
      location: 'Conference Room A',
      attendees: ['user1', 'user2'],
      organizer: 'user1',
      status: 'scheduled',
      type: 'meeting',
      createdAt: '2025-07-10T10:00:00Z',
      updatedAt: '2025-07-10T10:00:00Z',
    };
  }

  async getUpcomingEvents(page: number, limit: number) {
    return this.getAllEvents(page, limit);
  }

  async getCalendarEvents(startDate: string, endDate: string) {
    return [
      {
        id: '1',
        title: 'Team Meeting',
        startDate: '2025-07-15T14:00:00Z',
        endDate: '2025-07-15T15:00:00Z',
        type: 'meeting',
      },
    ];
  }

  async createEvent(createEventDto: any) {
    return {
      id: '2',
      ...createEventDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
