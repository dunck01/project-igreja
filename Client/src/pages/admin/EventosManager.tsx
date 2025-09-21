import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Calendar, CalendarPlus, Users, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

const EventosManager = () => {
  return (
    <Routes>
      <Route path="/" element={<EventosLista />} />
      <Route path="/novo" element={<NovoEvento />} />
      <Route path="/inscricoes" element={<GestaoInscricoes />} />
      <Route path="/:id/edit" element={<EditarEvento />} />
    </Routes>
  );
};

const EventosLista = () => {
  const navigate = useNavigate();
  // Estado para controlar modais e ações
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [eventos, setEventos] = useState([
    {
      id: 1,
      title: 'Conferência de Jovens 2025',
      date: '2025-10-15',
      time: '19:00',
      location: 'Santuário Principal',
      inscricoes: 145,
      capacity: 200,
      status: 'Ativo'
    },
    {
      id: 2,
      title: 'Retiro de Casais',
      date: '2025-11-22',
      time: '08:00',
      location: 'Hotel Fazenda',
      inscricoes: 32,
      capacity: 50,
      status: 'Ativo'
    }
  ]);

  // Handlers para ações
  const handleView = (eventoId: number) => {
    // Abrir modal de detalhes ou navegar para página de visualização
    alert(`Visualizando evento ID: ${eventoId}\n\nEsta funcionalidade abriria um modal com detalhes completos do evento.`);
  };

  const handleEdit = (eventoId: number) => {
    // Navegar para página de edição
    navigate(`/admin/eventos/${eventoId}/edit`);
  };

  const handleDelete = async (eventoId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?\n\nEsta ação não pode ser desfeita.')) {
      try {
        // Simular chamada da API
        console.log('Excluindo evento:', eventoId);
        
        // Remover da lista local
        setEventos(prev => prev.filter(evento => evento.id !== eventoId));
        
        alert('Evento excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir evento. Tente novamente.');
      }
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Implementar busca
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-600">Gerencie eventos e suas inscrições</p>
        </div>
        <a
          href="/admin/eventos/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <CalendarPlus className="h-4 w-4 mr-2" />
          Novo Evento
        </a>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button 
              onClick={toggleFilters}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento) => (
              <div key={evento.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {evento.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    evento.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {evento.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(evento.date).toLocaleDateString('pt-BR')} às {evento.time}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {evento.inscricoes}/{evento.capacity} inscrições
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleView(evento.id)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </button>
                  <button 
                    onClick={() => handleEdit(evento.id)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100 flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(evento.id)}
                    className="px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const NovoEvento = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    description: '',
    images: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Criar evento:', formData);
    // Implementar lógica de criação
    alert('Evento criado com sucesso!');
  };

  const handleCancel = () => {
    if (window.confirm('Tem certeza que deseja cancelar? Os dados serão perdidos.')) {
      // navigate('/admin/eventos');
      setFormData({
        title: '',
        category: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        description: '',
        images: []
      });
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Novo Evento</h1>
        <p className="text-gray-600">Crie um novo evento para a congregação</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Evento
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o título do evento"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="culto">Culto</option>
                <option value="conferencia">Conferência</option>
                <option value="retiro">Retiro</option>
                <option value="workshop">Workshop</option>
                <option value="celebracao">Celebração</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Local do evento"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidade
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Número máximo de participantes"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descrição detalhada do evento"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem do Evento
            </label>
            <ImageUpload 
              onUpload={(files) => console.log('Imagens uploaded:', files)}
              category="eventos"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Criar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GestaoInscricoes = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Inscrições</h1>
        <p className="text-gray-600">Gerencie inscrições de todos os eventos</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-center text-gray-500 py-8">
          Sistema de gestão de inscrições será implementado aqui
        </p>
      </div>
    </div>
  );
};

const EditarEvento = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: 'Retiro de Casais', // Dados simulados - buscar da API usando ID
    category: 'retiro',
    date: '2025-11-22',
    time: '08:00',
    location: 'Hotel Fazenda',
    capacity: '50',
    description: 'Um final de semana especial para casais fortalecerem seus relacionamentos.',
    images: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Atualizar evento:', formData);
    // Implementar lógica de atualização
    alert('Evento atualizado com sucesso!');
    navigate('/admin/eventos');
  };

  const handleCancel = () => {
    if (window.confirm('Tem certeza que deseja cancelar? As alterações serão perdidas.')) {
      navigate('/admin/eventos');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Evento</h1>
          <p className="text-gray-600">Edite as informações do evento</p>
        </div>
        <button
          onClick={() => navigate('/admin/eventos')}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Voltar para eventos
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Evento
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o título do evento"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="culto">Culto</option>
                <option value="conferencia">Conferência</option>
                <option value="retiro">Retiro</option>
                <option value="workshop">Workshop</option>
                <option value="celebracao">Celebração</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Local do evento"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidade
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Número máximo de participantes"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descrição detalhada do evento"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem do Evento
            </label>
            <ImageUpload 
              onUpload={(files) => console.log('Imagens uploaded:', files)}
              category="eventos"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventosManager;