import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, UserPlus } from 'lucide-react';
import { Event } from '../../types';

// Mock data for events
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Conferência Anual 2024',
    slug: 'conferencia-anual-2024',
    description: 'Grande evento anual com palestrantes renomados e momentos de adoração.',
    shortDescription: 'Conferência anual com palestrantes e adoração',
    date: '2024-03-15',
    time: '19:00',
    location: 'Auditório Principal',
    image: 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    category: 'Conferência',
    capacity: 200,
    currentRegistrations: 45,
    price: 0,
    isActive: true,
    isFeatured: true,
    tags: 'conferencia,palestras,adoracao',
    customFields: '{}',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Retiro de Casais',
    slug: 'retiro-de-casais',
    description: 'Fim de semana especial para fortalecer os relacionamentos matrimoniais.',
    shortDescription: 'Retiro para casais',
    date: '2024-04-20',
    time: '15:00',
    location: 'Chácara Bethel',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    category: 'Retiro',
    capacity: 50,
    currentRegistrations: 12,
    price: 150,
    isActive: true,
    isFeatured: false,
    tags: 'retiro,casais,relacionamento',
    customFields: '{}',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Acampamento Jovem',
    slug: 'acampamento-jovem',
    description: 'Acampamento especial para jovens com atividades, louvor e muito aprendizado.',
    shortDescription: 'Acampamento para jovens',
    date: '2024-02-10',
    time: '14:00',
    location: 'Camping Vale Verde',
    image: 'https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    category: 'Jovens',
    capacity: 100,
    currentRegistrations: 28,
    price: 80,
    isActive: true,
    isFeatured: true,
    tags: 'jovens,acampamento,atividades',
    customFields: '{}',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const Events = () => {
  const [events] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleRegistrationClick = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };

  const handleCloseForm = () => {
    setShowRegistrationForm(false);
    setSelectedEvent(null);
  };

  return (
    <section id="eventos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Próximos Eventos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participe dos nossos eventos e fortaleça sua fé em comunidade
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{event.shortDescription}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{event.currentRegistrations}/{event.capacity} inscritos</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-900">
                    {(event.price ?? 0) > 0 ? `R$ ${event.price ?? 0}` : 'Gratuito'}
                  </div>
                  <button
                    onClick={() => handleRegistrationClick(event)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Inscrever-se
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Registration Form Modal */}
        {showRegistrationForm && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Inscrição para {selectedEvent.title}</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome completo"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Confirmar Inscrição
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
