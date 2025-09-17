import { httpClient, PaginatedResponse } from './httpClient';
import { Event } from '../types';

export interface EventsQuery {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  active?: boolean;
}

export interface CreateEventData {
  title: string;
  description: string;
  shortDescription?: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  price?: number;
  isFeatured?: boolean;
  tags?: string[];
}

export interface UpdateEventData extends Partial<CreateEventData> {}

class EventService {
  async getEvents(query: EventsQuery = {}): Promise<PaginatedResponse<Event>> {
    const params: Record<string, string> = {};
    
    if (query.page) params.page = query.page.toString();
    if (query.limit) params.limit = query.limit.toString();
    if (query.category) params.category = query.category;
    if (query.featured !== undefined) params.featured = query.featured.toString();
    if (query.active !== undefined) params.active = query.active.toString();

    return httpClient.get<PaginatedResponse<Event>>('/events', params);
  }

  async getEventBySlug(slug: string): Promise<Event> {
    return httpClient.get<Event>(`/events/slug/${slug}`);
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    return httpClient.post<Event>('/events', eventData);
  }

  async updateEvent(id: string, eventData: UpdateEventData): Promise<Event> {
    return httpClient.put<Event>(`/events/${id}`, eventData);
  }

  async deleteEvent(id: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`/events/${id}`);
  }

  async getEventRegistrations(eventId: string, page = 1, limit = 10) {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
    };
    
    return httpClient.get(`/events/${eventId}/registrations`, params);
  }

  // Helper methods for frontend
  async getFeaturedEvents(): Promise<Event[]> {
    const response = await this.getEvents({ featured: true, limit: 6 });
    return response.data;
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    const response = await this.getEvents({ category, limit: 20 });
    return response.data;
  }
}

export const eventService = new EventService();
