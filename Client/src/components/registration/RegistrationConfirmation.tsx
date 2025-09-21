import { useState, useEffect } from 'react';
import { CheckCircle, Edit, Mail, Phone, Building, Utensils, Accessibility, Calendar, Clock, MapPin } from 'lucide-react';
import { useEvents, useRegistrations } from '../../hooks/useEventRegistration';
import { Registration } from '../../types';

interface RegistrationConfirmationProps {
  registrationId?: string;
}

const RegistrationConfirmation: React.FC<RegistrationConfirmationProps> = ({ registrationId }) => {
  const { events } = useEvents();
  const { registrations, updateRegistrationStatus } = useRegistrations();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    if (registrationId) {
      const foundRegistration = registrations.find(r => r.id === registrationId);
      setRegistration(foundRegistration || null);
    }
  }, [registrationId, registrations]);

  const handleCancelRegistration = () => {
    if (registration && window.confirm('Tem certeza que deseja cancelar sua inscrição?')) {
      updateRegistrationStatus(registration.id, 'CANCELLED');
      setRegistration({ ...registration, status: 'CANCELLED' });
    }
  };

  const handleUpdateRegistration = () => {
    if (registration) {
      const updatedRegistration = { ...registration, ...updatedData };
      setRegistration(updatedRegistration);
      setIsEditing(false);
    }
  };

  if (!registration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Inscrição não encontrada</h2>
          <p className="text-gray-600">
            Não foi possível encontrar uma inscrição com o ID fornecido.
          </p>
        </div>
      </div>
    );
  }

  const event = events.find(e => e.id === registration.eventId);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">
              {registration.status === 'CONFIRMED' ? 'Inscrição Confirmada!' : 'Status da Inscrição'}
            </h1>
            <p className="text-blue-100 text-center">
              {registration.status === 'CONFIRMED'
                ? 'Sua inscrição foi confirmada com sucesso!'
                : `Sua inscrição está ${registration.status === 'PENDING' ? 'pendente' : 'cancelada'}.`
              }
            </p>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Detalhes da Inscrição</h2>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      registration.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      registration.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {registration.status === 'CONFIRMED' ? 'Confirmada' :
                     registration.status === 'PENDING' ? 'Pendente' : 'Cancelada'}
                  </span>
                  <span className="text-sm text-gray-500">
                    ID: {registration.id}
                  </span>
                </div>
              </div>
            </div>

            {event && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Evento</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">{event.title}</h4>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">{event.time}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-gray-700">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Dados do Participante</h3>
                {registration.status !== 'CANCELLED' && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancelar Edição' : 'Editar Dados'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={registration.name}
                      onChange={(e) => setUpdatedData({...updatedData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{registration.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  {isEditing ? (
                    <input
                      type="email"
                      defaultValue={registration.email}
                      onChange={(e) => setUpdatedData({...updatedData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-500 mr-2" />
                      <p className="text-gray-900">{registration.email}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      defaultValue={registration.phone}
                      onChange={(e) => setUpdatedData({...updatedData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-500 mr-2" />
                      <p className="text-gray-900">{registration.phone}</p>
                    </div>
                  )}
                </div>

                {registration.organization && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organização</label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={registration.organization}
                        onChange={(e) => setUpdatedData({...updatedData, organization: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Building className="w-4 h-4 text-gray-500 mr-2" />
                        <p className="text-gray-900">{registration.organization}</p>
                      </div>
                    )}
                  </div>
                )}

                {registration.dietaryRestrictions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restrições Alimentares</label>
                    {isEditing ? (
                      <textarea
                        defaultValue={registration.dietaryRestrictions}
                        onChange={(e) => setUpdatedData({...updatedData, dietaryRestrictions: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                      />
                    ) : (
                      <div className="flex items-start">
                        <Utensils className="w-4 h-4 text-gray-500 mr-2 mt-1" />
                        <p className="text-gray-900">{registration.dietaryRestrictions}</p>
                      </div>
                    )}
                  </div>
                )}

                {registration.accessibilityNeeds && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Necessidades de Acessibilidade</label>
                    {isEditing ? (
                      <textarea
                        defaultValue={registration.accessibilityNeeds}
                        onChange={(e) => setUpdatedData({...updatedData, accessibilityNeeds: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                      />
                    ) : (
                      <div className="flex items-start">
                        <Accessibility className="w-4 h-4 text-gray-500 mr-2 mt-1" />
                        <p className="text-gray-900">{registration.accessibilityNeeds}</p>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {isEditing && (
                <div className="mt-6">
                  <button
                    onClick={handleUpdateRegistration}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </div>
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Adicionais</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Data da inscrição: {new Date(registration.createdAt).toLocaleDateString('pt-BR')}</p>
                {registration.status === 'CONFIRMED' && (
                  <p>Data de confirmação: {new Date().toLocaleDateString('pt-BR')}</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.print()}
                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Imprimir Comprovante
              </button>
              
              {registration.status !== 'CANCELLED' && (
                <button
                  onClick={handleCancelRegistration}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancelar Inscrição
                </button>
              )}
            </div>
          </div>
        </div>

        {registration.status !== 'CANCELLED' && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Próximos Passos</h3>
            <div className="text-blue-800">
              {registration.status === 'CONFIRMED' ? (
                <ul className="space-y-1">
                  <li>• Guarde este comprovante de inscrição</li>
                  <li>• Chegue 30 minutos antes do início do evento</li>
                  <li>• Traga um documento de identificação</li>
                  <li>• Em caso de dúvidas, entre em contato conosco</li>
                </ul>
              ) : (
                <p>
                  Sua inscrição está sendo analisada. Você receberá um e-mail de confirmação em breve.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationConfirmation;