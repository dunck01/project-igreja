import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, MessageSquare, Save, X, AlertCircle } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  message: string;
  image?: string;
  position?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const DepoimentosManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    image: '',
    position: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const response = await fetch('/api/v1/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Erro ao carregar depoimentos:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar depoimentos' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        message: testimonial.message,
        image: testimonial.image || '',
        position: testimonial.position || '',
        order: testimonial.order,
        isActive: testimonial.isActive
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        message: '',
        image: '',
        position: '',
        order: testimonials.length,
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
    setFormData({
      name: '',
      message: '',
      image: '',
      position: '',
      order: 0,
      isActive: true
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.message.trim()) {
      setMessage({ type: 'error', text: 'Nome e mensagem são obrigatórios' });
      return;
    }

    try {
      const url = editingTestimonial ? `/api/v1/testimonials/${editingTestimonial.id}` : '/api/v1/testimonials';
      const method = editingTestimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: editingTestimonial ? 'Depoimento atualizado com sucesso!' : 'Depoimento criado com sucesso!' 
        });
        loadTestimonials();
        handleCloseModal();
      } else {
        setMessage({ type: 'error', text: 'Erro ao salvar depoimento' });
      }
    } catch (error) {
      console.error('Erro ao salvar depoimento:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar depoimento' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este depoimento?')) return;

    try {
      const response = await fetch(`/api/v1/testimonials/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Depoimento deletado com sucesso!' });
        loadTestimonials();
      } else {
        setMessage({ type: 'error', text: 'Erro ao deletar depoimento' });
      }
    } catch (error) {
      console.error('Erro ao deletar depoimento:', error);
      setMessage({ type: 'error', text: 'Erro ao deletar depoimento' });
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            Gerenciar Depoimentos
          </h1>
          <p className="text-gray-600">Gerencie os depoimentos exibidos na landing page</p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Depoimento
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
        </div>
      )}

      {/* Lista de depoimentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                  {testimonial.position && (
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(testimonial)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Deletar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 line-clamp-3">{testimonial.message}</p>
            
            <div className="flex justify-between items-center text-sm">
              <span className={`px-2 py-1 rounded-full text-xs ${
                testimonial.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {testimonial.isActive ? 'Ativo' : 'Inativo'}
              </span>
              <span className="text-gray-500">Ordem: {testimonial.order}</span>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum depoimento cadastrado</h3>
          <p className="text-gray-600 mb-4">Comece adicionando o primeiro depoimento</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Depoimento
          </button>
        </div>
      )}

      {/* Modal de criação/edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingTestimonial ? 'Editar Depoimento' : 'Novo Depoimento'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome da pessoa"
                  />
                </div>

                {/* Cargo/Posição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo/Posição
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="Ex: Membro da igreja, Pastor, etc."
                  />
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Depoimento *
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Escreva o depoimento aqui..."
                  />
                </div>

                {/* Foto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto do Perfil
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="URL da imagem"
                    />
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Fazer Upload
                    </button>
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-full border border-gray-200"
                      />
                    )}
                  </div>
                </div>

                {/* Configurações */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordem de Exibição
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.isActive ? 'true' : 'false'}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    >
                      <option value="true">Ativo</option>
                      <option value="false">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingTestimonial ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepoimentosManager;