import { useState, useEffect } from 'react';
import { Event, Registration, RegistrationStatus } from '../types';
import { eventService, registrationService } from '../services';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await eventService.getEvents({ active: true });
      setEvents(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos');
      console.error('Erro ao carregar eventos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const updateEventRegistrations = async (eventId: string, count: number) => {
    try {
      // Find the event and update its registration count
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId
            ? { ...event, currentRegistrations: count }
            : event
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar contador de inscrições:', err);
    }
  };

  return {
    events,
    isLoading,
    error,
    updateEventRegistrations,
    refetch: fetchEvents
  };
};

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addRegistration = async (registrationData: Omit<Registration, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await registrationService.createRegistration({
        eventId: registrationData.eventId,
        name: registrationData.name,
        email: registrationData.email,
        phone: registrationData.phone,
        organization: registrationData.organization,
        dietaryRestrictions: registrationData.dietaryRestrictions,
        accessibilityNeeds: registrationData.accessibilityNeeds,
      });

      // Add to local state
      setRegistrations(prev => [...prev, response.registration]);
      
      return response.registration;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar inscrição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRegistrationStatus = async (id: string, status: RegistrationStatus) => {
    try {
      setError(null);
      const updatedRegistration = await registrationService.updateRegistrationStatus(id, { status });
      
      setRegistrations(prev =>
        prev.map(reg => (reg.id === id ? updatedRegistration : reg))
      );
      
      return updatedRegistration;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteRegistration = async (id: string) => {
    try {
      setError(null);
      await registrationService.deleteRegistration(id);
      
      setRegistrations(prev => prev.filter(reg => reg.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir inscrição';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const fetchRegistrations = async (query?: { eventId?: string; status?: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await registrationService.getRegistrations(query);
      setRegistrations(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar inscrições');
      console.error('Erro ao carregar inscrições:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registrations,
    isLoading,
    error,
    addRegistration,
    updateRegistrationStatus,
    deleteRegistration,
    fetchRegistrations
  };
};

// Export para compatibilidade com o código existente
export type { Event, Registration, RegistrationStatus } from '../types';
