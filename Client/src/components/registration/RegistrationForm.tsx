import { useState } from 'react';
import { X, User, Mail, Phone, Building, Utensils, Accessibility } from 'lucide-react';
import { Event, RegistrationFormData, RegistrationErrors } from '../../types';

interface RegistrationFormProps {
  event: Event;
  onClose: () => void;
  onSubmit: (data: RegistrationFormData) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ event, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
    eventId: event.id
  });

  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(?(\d{2})\)?\s?9?\d{4}-?\d{4}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Telefone inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(formData);
    } catch (error) {
      console.error('Erro ao enviar registro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro quando usuário começa a digitar
    if (errors[field as keyof RegistrationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const spotsLeft = event.capacity - event.currentRegistrations;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Inscrição: {event.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Vagas disponíveis</p>
                <p className="text-2xl font-bold text-blue-800">{spotsLeft} de {event.capacity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Data do evento</p>
                <p className="font-semibold text-gray-900">{event.date}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 mr-2" />
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Digite seu nome completo"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* E-mail */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 mr-2" />
                E-mail *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="seu.email@exemplo.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Telefone */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 mr-2" />
                Telefone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="(11) 99999-9999"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Organização */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building className="h-4 w-4 mr-2" />
                Organização/Empresa
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome da organização (opcional)"
              />
            </div>

            {/* Restrições Alimentares */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Utensils className="h-4 w-4 mr-2" />
                Restrições Alimentares
              </label>
              <select
                value={formData.dietaryRestrictions}
                onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione (opcional)</option>
                <option value="vegetariano">Vegetariano</option>
                <option value="vegano">Vegano</option>
                <option value="sem-gluten">Sem Glúten</option>
                <option value="alergia-nozes">Alergia a Nozes</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            {/* Necessidades de Acessibilidade */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Accessibility className="h-4 w-4 mr-2" />
                Necessidades de Acessibilidade
              </label>
              <textarea
                value={formData.accessibilityNeeds}
                onChange={(e) => handleInputChange('accessibilityNeeds', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva suas necessidades especiais (opcional)"
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || spotsLeft <= 0}
                className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Enviando...' : spotsLeft <= 0 ? 'Esgotado' : 'Confirmar Inscrição'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
