import { useState } from 'react';
import { Users, Download, Search, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useEvents, useRegistrations } from '../../hooks/useEventRegistration';
import { Registration, Event } from '../../types';

const AdminDashboard = () => {
  const { events } = useEvents();
  const { registrations, updateRegistrationStatus, deleteRegistration } = useRegistrations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');

  // Filtrar inscrições baseado nos critérios
  const filteredRegistrations = registrations.filter((registration: Registration) => {
    const matchesSearch = registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || registration.status.toLowerCase() === statusFilter;
    const matchesEvent = eventFilter === 'all' || registration.eventId === eventFilter;

    return matchesSearch && matchesStatus && matchesEvent;
  });

  const getEventTitle = (eventId: string) => {
    const event = events.find((e: Event) => e.id === eventId);
  return event ? event.title : 'Evento não encontrado';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleStatusChange = (registrationId: string, newStatus: Registration['status']) => {
    updateRegistrationStatus(registrationId, newStatus);
  };

  const handleDeleteRegistration = (registrationId: string) => {
  if (window.confirm('Tem certeza que deseja excluir esta inscrição?')) {
      deleteRegistration(registrationId);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Nome', 'E-mail', 'Telefone', 'Organização', 'Evento', 'Status', 'Data de Inscrição', 'Restrições Alimentares', 'Necessidades de Acessibilidade'],
      ...filteredRegistrations.map((reg: Registration) => [
        reg.name,
        reg.email,
        reg.phone,
        reg.organization || '',
        getEventTitle(reg.eventId),
        reg.status,
        new Date(reg.createdAt).toLocaleDateString('pt-BR'),
        reg.dietaryRestrictions || '',
        reg.accessibilityNeeds || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'inscricoes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRegistrations = registrations.length;
  const confirmedRegistrations = registrations.filter((r: Registration) => r.status === 'CONFIRMED').length;
  const pendingRegistrations = registrations.filter((r: Registration) => r.status === 'PENDING').length;
  const cancelledRegistrations = registrations.filter((r: Registration) => r.status === 'CANCELLED').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
          <p className="text-gray-600">Gerencie as inscrições dos eventos</p>
        </div>

  {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Inscrições</p>
                <p className="text-2xl font-bold text-gray-900">{totalRegistrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmadas</p>
                <p className="text-2xl font-bold text-gray-900">{confirmedRegistrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{pendingRegistrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-gray-900">{cancelledRegistrations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="confirmed">Confirmadas</option>
              <option value="pending">Pendentes</option>
              <option value="cancelled">Canceladas</option>
            </select>

            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Eventos</option>
              {events.map((event: Event) => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>

            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </button>
          </div>
        </div>

  {/* Tabela de Inscrições */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.map((registration: Registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{registration.name}</div>
                        {registration.organization && (
                          <div className="text-sm text-gray-500">{registration.organization}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.email}</div>
                      <div className="text-sm text-gray-500">{registration.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getEventTitle(registration.eventId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                        {getStatusIcon(registration.status)}
                        <span className="ml-1 capitalize">{registration.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(registration.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <select
                          value={registration.status}
                          onChange={(e) => handleStatusChange(registration.id, e.target.value as Registration['status'])}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="confirmed">Confirmar</option>
                          <option value="pending">Pendente</option>
                          <option value="cancelled">Cancelar</option>
                        </select>
                        <button
                          onClick={() => handleDeleteRegistration(registration.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma inscrição encontrada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
