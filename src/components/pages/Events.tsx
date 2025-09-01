import { useState } from 'react';
import { Calendar, MapPin, Clock, Users, UserPlus } from 'lucide-react';
import RegistrationForm from '../registration/RegistrationForm';
import { useEvents, useRegistrations, Event } from '../../hooks/useEventRegistration';
import { RegistrationFormData } from '../../types';

const Events = () => {
  const { events, updateEventRegistrations } = useEvents();
  const { addRegistration } = useRegistrations();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const handleRegistrationClick = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };

  const handleRegistrationSubmit = (registrationData: RegistrationFormData) => {
    if (selectedEvent) {
      addRegistration({
        ...registrationData,
        status: 'confirmed' as const
      });

      // Atualizar contagem de inscrições do evento
      updateEventRegistrations(selectedEvent.id, selectedEvent.currentRegistrations + 1);

      // Fechar modal e mostrar confirmação
      setShowRegistrationForm(false);
      setSelectedEvent(null);

      alert(`Inscrição confirmada! Você receberá um e-mail de confirmação em ${registrationData.email}`);
    }
  };

  const handleCloseRegistrationForm = () => {
    setShowRegistrationForm(false);
    setSelectedEvent(null);
  };

  return (
    <section id="eventos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Próximos Eventos
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Participe dos nossos eventos especiais e viva momentos únicos de comunhão e crescimento espiritual
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event: Event, index: number) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-blue-800" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-blue-800" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-blue-800" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-blue-800" />
                    <span>{event.currentRegistrations} / {event.capacity} inscritos</span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => handleRegistrationClick(event)}
                    disabled={event.currentRegistrations >= event.capacity}
                    className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {event.currentRegistrations >= event.capacity ? 'Esgotado' : 'Inscrever-se'}
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300">
                    Saiba Mais
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-blue-800 text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Não Perca Nenhum Evento!</h3>
          <p className="text-lg mb-6">Cadastre-se para receber informações sobre nossos próximos eventos</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-6 py-3 rounded-full font-semibold transition-all duration-300">
              Cadastrar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Inscrição */}
      {showRegistrationForm && selectedEvent && (
        <RegistrationForm
          event={selectedEvent}
          onClose={handleCloseRegistrationForm}
          onSubmit={handleRegistrationSubmit}
        />
      )}
    </section>
  );
};

export default Events;