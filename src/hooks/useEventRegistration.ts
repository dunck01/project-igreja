import { useState, useEffect } from 'react';
import { Event, Registration } from '../types';
import { STORAGE_KEYS } from '../constants';

// Eventos iniciais
const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Conferência de Avivamento',
    date: '15-17 de Dezembro',
    time: '19:30',
    location: 'Templo Principal',
    description: 'Três noites especiais com pregadores convidados e ministração especial',
    image: 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    category: 'Conferência',
    capacity: 200,
    currentRegistrations: 0
  },
  {
    id: '2',
    title: 'Retiro de Casais',
    date: '25-26 de Janeiro',
    time: '15:00',
    location: 'Chácara Bethel',
    description: 'Fim de semana especial para fortalecer os relacionamentos matrimoniais',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    category: 'Retiro',
    capacity: 50,
    currentRegistrations: 0
  },
  {
    id: '3',
    title: 'Acampamento Jovem',
    date: '10-12 de Fevereiro',
    time: '14:00',
    location: 'Camping Vale Verde',
    description: 'Acampamento especial para jovens com atividades, louvor e muito aprendizado',
    image: 'https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    category: 'Jovens',
    capacity: 100,
    currentRegistrations: 0
  },
  {
    id: '4',
    title: 'Dia da Família',
    date: '20 de Abril',
    time: '10:00',
    location: 'Parque da Cidade',
    description: 'Dia especial de confraterniza��o com toda a fam�lia da igreja',
    image: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    category: 'Fam�lia',
    capacity: 300,
    currentRegistrations: 0
  }
];

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Carregar eventos do localStorage ou usar iniciais
    const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      setEvents(initialEvents);
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(initialEvents));
    }
  }, []);

  const updateEventRegistrations = (eventId: string, newCount: number) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, currentRegistrations: newCount }
          : event
      )
    );
  };

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    }
  }, [events]);

  return { events, updateEventRegistrations };
};

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    const storedRegistrations = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (storedRegistrations) {
      setRegistrations(JSON.parse(storedRegistrations));
    }
  }, []);

  const addRegistration = (registration: Omit<Registration, 'id' | 'createdAt'>) => {
    const newRegistration: Registration = {
      ...registration,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setRegistrations(prev => [...prev, newRegistration]);
    return newRegistration;
  };

  const updateRegistrationStatus = (id: string, status: Registration['status']) => {
    setRegistrations(prev =>
      prev.map(reg =>
        reg.id === id ? { ...reg, status } : reg
      )
    );
  };

  const deleteRegistration = (id: string) => {
    setRegistrations(prev => prev.filter(reg => reg.id !== id));
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  }, [registrations]);

  return {
    registrations,
    addRegistration,
    updateRegistrationStatus,
    deleteRegistration
  };
};
export type { Event };

