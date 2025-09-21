import { useState, useEffect } from 'react';
import { 
  Clock, Calendar, MapPin, Phone, Users, Plus, Search, 
  Filter, Edit, Trash2, Eye, Save, X, AlertCircle, 
  CheckCircle, Star, Copy, Share, Settings, MoreVertical
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  dayOfWeek: number; // 0-6 (Domingo a Sábado)
  time: string;
  duration: number; // em minutos
  location: string;
  address: string;
  pastor: string;
  ministryLeader?: string;
  capacity?: number;
  isRecurring: boolean;
  isActive: boolean;
  isFeatured: boolean;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  specialInstructions?: string;
  attendanceCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface ServiceFormData {
  name: string;
  description: string;
  dayOfWeek: number;
  time: string;
  duration: number;
  location: string;
  address: string;
  pastor: string;
  ministryLeader: string;
  capacity: string;
  isRecurring: boolean;
  isActive: boolean;
  isFeatured: boolean;
  contactPhone: string;
  contactEmail: string;
  notes: string;
  specialInstructions: string;
}

const CultosManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    dayOfWeek: 0,
    time: '',
    duration: 120,
    location: '',
    address: '',
    pastor: '',
    ministryLeader: '',
    capacity: '',
    isRecurring: true,
    isActive: true,
    isFeatured: false,
    contactPhone: '',
    contactEmail: '',
    notes: '',
    specialInstructions: ''
  });

  const daysOfWeek = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, filterDay, filterStatus]);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/v1/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Erro ao carregar cultos:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar lista de cultos' });
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.pastor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDay !== 'all') {
      filtered = filtered.filter(service => service.dayOfWeek === filterDay);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(service => 
        filterStatus === 'active' ? service.isActive : !service.isActive
      );
    }

    setFilteredServices(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      dayOfWeek: 0,
      time: '',
      duration: 120,
      location: '',
      address: '',
      pastor: '',
      ministryLeader: '',
      capacity: '',
      isRecurring: true,
      isActive: true,
      isFeatured: false,
      contactPhone: '',
      contactEmail: '',
      notes: '',
      specialInstructions: ''
    });
    setEditingService(null);
  };

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        dayOfWeek: service.dayOfWeek,
        time: service.time,
        duration: service.duration,
        location: service.location,
        address: service.address,
        pastor: service.pastor,
        ministryLeader: service.ministryLeader || '',
        capacity: service.capacity ? service.capacity.toString() : '',
        isRecurring: service.isRecurring,
        isActive: service.isActive,
        isFeatured: service.isFeatured,
        contactPhone: service.contactPhone || '',
        contactEmail: service.contactEmail || '',
        notes: service.notes || '',
        specialInstructions: service.specialInstructions || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(resetForm, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.time || !formData.pastor.trim()) {
      setMessage({ type: 'error', text: 'Nome, horário e pastor são obrigatórios' });
      return;
    }

    try {
      const url = editingService 
        ? `/api/v1/services/${editingService.id}`
        : '/api/v1/services';
      
      const method = editingService ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: editingService ? 'Culto atualizado com sucesso!' : 'Culto criado com sucesso!' 
        });
        loadServices();
        closeModal();
      } else {
        setMessage({ type: 'error', text: 'Erro ao salvar culto' });
      }
    } catch (error) {
      console.error('Erro ao salvar culto:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar culto' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(`/api/v1/services/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Culto deletado com sucesso!' });
        loadServices();
        setShowDeleteModal(false);
        setDeleteTarget(null);
      } else {
        setMessage({ type: 'error', text: 'Erro ao deletar culto' });
      }
    } catch (error) {
      console.error('Erro ao deletar culto:', error);
      setMessage({ type: 'error', text: 'Erro ao deletar culto' });
    }
  };

  const openDeleteModal = (service: Service) => {
    setDeleteTarget(service);
    setShowDeleteModal(true);
  };

  const toggleSelection = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    return `${mins}min`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-8 h-8" />
            Gestão de Cultos
          </h1>
          <p className="text-gray-600">
            {filteredServices.length} de {services.length} cultos
            {selectedServices.length > 0 && ` • ${selectedServices.length} selecionados`}
          </p>
        </div>
        
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Culto
        </button>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <AlertCircle className="w-5 h-5" />
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="ml-auto p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controles de filtro e busca */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, pastor, local..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            >
              <option value="all">Todos os dias</option>
              {daysOfWeek.map((day, index) => (
                <option key={index} value={index}>{day}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de cultos */}
      <div className="bg-white rounded-lg shadow">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {services.length === 0 ? 'Nenhum culto encontrado' : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-gray-600 mb-4">
              {services.length === 0 
                ? 'Comece criando o primeiro culto da igreja'
                : 'Tente ajustar os filtros de busca'
              }
            </p>
            {services.length === 0 && (
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Criar Primeiro Culto
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => toggleSelection(service.id)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                            {service.isFeatured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                            {!service.isActive && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                Inativo
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{service.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{daysOfWeek[service.dayOfWeek]} às {formatTime(service.time)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(service.duration)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{service.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{service.pastor}</span>
                        </div>
                      </div>

                      {service.address && (
                        <p className="text-sm text-gray-500">{service.address}</p>
                      )}

                      {(service.contactPhone || service.contactEmail) && (
                        <div className="flex gap-4 text-sm">
                          {service.contactPhone && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{service.contactPhone}</span>
                            </div>
                          )}
                          {service.contactEmail && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <span>📧</span>
                              <span>{service.contactEmail}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {service.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-800">{service.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openModal(service)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(service)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de criação/edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingService ? 'Editar Culto' : 'Novo Culto'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informações básicas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Informações Básicas</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Culto *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Culto Dominical"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descrição do culto"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dia da Semana
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.dayOfWeek}
                          onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                        >
                          {daysOfWeek.map((day, index) => (
                            <option key={index} value={index}>{day}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Horário *
                        </label>
                        <input
                          type="time"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duração (minutos)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="300"
                        step="15"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Local e responsáveis */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Local e Responsáveis</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Local *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Ex: Templo Principal"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Endereço
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Endereço completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pastor Responsável *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.pastor}
                        onChange={(e) => setFormData({ ...formData, pastor: e.target.value })}
                        placeholder="Nome do pastor"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Líder do Ministério
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.ministryLeader}
                        onChange={(e) => setFormData({ ...formData, ministryLeader: e.target.value })}
                        placeholder="Nome do líder do ministério"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacidade
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="Número máximo de pessoas"
                      />
                    </div>
                  </div>
                </div>

                {/* Contatos e configurações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Contatos</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="contato@igreja.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Configurações</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isRecurring}
                          onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Culto recorrente</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Culto ativo</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Destacar culto</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Observações</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas Gerais
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Observações sobre o culto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instruções Especiais
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                      placeholder="Instruções especiais para o culto"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {editingService ? 'Atualizar' : 'Criar'} Culto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Deletar Culto</h3>
                  <p className="text-gray-600">Esta ação não pode ser desfeita</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900">{deleteTarget.name}</h4>
                <p className="text-sm text-gray-600">
                  {daysOfWeek[deleteTarget.dayOfWeek]} às {formatTime(deleteTarget.time)}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CultosManager;