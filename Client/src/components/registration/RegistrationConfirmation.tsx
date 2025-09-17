import { useState, useEffect } from 'react';
import { CheckCircle, Edit, Mail, Phone, Building, Utensils, Accessibility, Calendar, MapPin, Clock } from 'lucide-react';
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
  const [editForm, setEditForm] = useState({
    phone: '',
    organization: '',
    dietaryRestrictions: '',
    accessibilityNeeds: ''
  });

  useEffect(() => {
    if (registrationId) {
      const found = registrations.find(r => r.id === registrationId);
      if (found) {
        setRegistration(found);
        setEditForm({
          phone: found.phone,
          organization: found.organization || '',
          dietaryRestrictions: found.dietaryRestrictions || '',
          accessibilityNeeds: found.accessibilityNeeds || ''
        });
      }
    } else {
      // Para demonstração, pegar a última inscrição
      const lastRegistration = registrations[registrations.length - 1];
      if (lastRegistration) {
        setRegistration(lastRegistration);
        setEditForm({
          phone: lastRegistration.phone,
          organization: lastRegistration.organization || '',
          dietaryRestrictions: lastRegistration.dietaryRestrictions || '',
          accessibilityNeeds: lastRegistration.accessibilityNeeds || ''
        });
      }
    }
  }, [registrationId, registrations]);

  const getEventDetails = (eventId: string) => {
    return events.find(e => e.id === eventId);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria implementada a lógica para atualizar a inscrição
    // Por enquanto, apenas fechar o modo de edição
    setIsEditing(false);
    alert('Informações atualizadas com sucesso!');
  };

  const handleCancelRegistration = () => {
    if (registration && window.confirm('Tem certeza que deseja cancelar sua inscrição?')) {
      updateRegistrationStatus(registration.id, 'cancelled');
      setRegistration({ ...registration, status: 'cancelled' });
    }
  };

  if (!registration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Inscrição não encontrada</h1>
          <p className="text-gray-600">Verifique se o link está correto ou entre em contato conosco.</p>
        </div>
      </div>
    );
  }

  const event = getEventDetails(registration.eventId);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de Confirmação */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {registration.status === 'confirmed' ? 'Inscrição Confirmada!' : 'Status da Inscrição'}
          </h1>
          <p className="text-lg text-gray-600">
            {registration.status === 'confirmed'
              ? 'Sua participação está garantida neste evento.'
              : `Sua inscrição está ${registration.status === 'pending' ? 'pendente' : 'cancelada'}.`
            }
          </p>
        </div>

        {/* Card do Evento */}
        {event && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detalhes do Evento</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>

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
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Informações da Inscrição</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>ID da Inscrição:</strong> {registration.id}</p>
                  <p><strong>Data da Inscrição:</strong> {new Date(registration.createdAt).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Status:</strong>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {registration.status === 'confirmed' ? 'Confirmada' :
                       registration.status === 'pending' ? 'Pendente' : 'Cancelada'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informações do Participante */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Suas Informações</h2>
            {registration.status !== 'cancelled' && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditing ? 'Cancelar Edição' : 'Editar'}
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Dados Pessoais</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-24">Nome:</span>
                    <span className="text-gray-900">{registration.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-900">{registration.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-900">{registration.phone}</span>
                  </div>
                  {registration.organization && (
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-900">{registration.organization}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Informações Adicionais</h3>
                <div className="space-y-3">
                  {registration.dietaryRestrictions && (
                    <div className="flex items-start">
                      <Utensils className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-700">Restrições Alimentares:</span>
                        <p className="text-gray-900">{registration.dietaryRestrictions}</p>
                      </div>
                    </div>
                  )}
                  {registration.accessibilityNeeds && (
                    <div className="flex items-start">
                      <Accessibility className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-700">Necessidades de Acessibilidade:</span>
                        <p className="text-gray-900">{registration.accessibilityNeeds}</p>
                      </div>
                    </div>
                  )}
                  {!registration.dietaryRestrictions && !registration.accessibilityNeeds && (
                    <p className="text-gray-500 italic">Nenhuma informação adicional fornecida.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 mr-2" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4 mr-2" />
                    Organização
                  </label>
                  <input
                    type="text"
                    value={editForm.organization}
                    onChange={(e) => setEditForm({...editForm, organization: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Utensils className="h-4 w-4 mr-2" />
                  Restrições Alimentares
                </label>
                <select
                  value={editForm.dietaryRestrictions}
                  onChange={(e) => setEditForm({...editForm, dietaryRestrictions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="vegetariano">Vegetariano</option>
                  <option value="vegano">Vegano</option>
                  <option value="sem-gluten">Sem Glúten</option>
                  <option value="alergia-nozes">Alergia a Nozes</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Accessibility className="h-4 w-4 mr-2" />
                  Necessidades de Acessibilidade
                </label>
                <textarea
                  value={editForm.accessibilityNeeds}
                  onChange={(e) => setEditForm({...editForm, accessibilityNeeds: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva suas necessidades especiais"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Ações */}
        {registration.status !== 'cancelled' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ações da Inscrição</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Imprimir Confirmação
              </button>
              <button
                onClick={() => window.location.href = `mailto:contato@igreja.com?subject=Informações sobre inscrição ${registration.id}`}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Entrar em Contato
              </button>
              <button
                onClick={handleCancelRegistration}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Cancelar Inscrição
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationConfirmation;
