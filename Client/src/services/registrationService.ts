import { httpClient, PaginatedResponse } from './httpClient';
import { Registration, RegistrationFormData } from '../types';

export interface RegistrationsQuery {
  page?: number;
  limit?: number;
  eventId?: string;
  status?: string;
  search?: string;
}

export interface CreateRegistrationData extends RegistrationFormData {}

export interface UpdateRegistrationStatusData {
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'WAITLIST';
}

class RegistrationService {
  async createRegistration(registrationData: CreateRegistrationData): Promise<{
    message: string;
    registration: Registration;
  }> {
    return httpClient.post('/registrations', registrationData);
  }

  async getRegistrations(query: RegistrationsQuery = {}): Promise<PaginatedResponse<Registration>> {
    const params: Record<string, string> = {};
    
    if (query.page) params.page = query.page.toString();
    if (query.limit) params.limit = query.limit.toString();
    if (query.eventId) params.eventId = query.eventId;
    if (query.status) params.status = query.status;
    if (query.search) params.search = query.search;

    return httpClient.get<PaginatedResponse<Registration>>('/registrations', params);
  }

  async getRegistrationById(id: string): Promise<Registration> {
    return httpClient.get<Registration>(`/registrations/${id}`);
  }

  async updateRegistrationStatus(
    id: string, 
    statusData: UpdateRegistrationStatusData
  ): Promise<Registration> {
    return httpClient.put<Registration>(`/registrations/${id}/status`, statusData);
  }

  async deleteRegistration(id: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`/registrations/${id}`);
  }

  async exportRegistrations(eventId?: string): Promise<Blob> {
    const params: Record<string, string> = {};
    if (eventId) params.eventId = eventId;

    // For CSV export, we need to handle the response differently
    const url = `/registrations/export${eventId ? `?eventId=${eventId}` : ''}`;
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${httpClient['baseURL']}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export registrations');
    }

    return response.blob();
  }

  // Helper methods
  async getRegistrationsByEvent(eventId: string): Promise<Registration[]> {
    const response = await this.getRegistrations({ eventId, limit: 1000 });
    return response.data;
  }

  async getRegistrationsByStatus(status: string): Promise<Registration[]> {
    const response = await this.getRegistrations({ status, limit: 1000 });
    return response.data;
  }
}

export const registrationService = new RegistrationService();
