import { useState } from 'react';
import { Save } from 'lucide-react';
import { SiteConfig } from '../../types';

interface ContactSettingsProps {
  config: SiteConfig['contact'];
  onSave: (config: Partial<SiteConfig>) => void;
  onChange: () => void;
}

const ContactSettings = ({ config, onSave, onChange }: ContactSettingsProps) => {
  const [formData, setFormData] = useState(config);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ contact: formData });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Configurações de Contato</h2>
        <button
          onClick={handleSubmit}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Seção
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entre em Contato"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtítulo
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Estamos aqui para ajudar"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rua da Igreja, 123 - Centro, São Paulo - SP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contato@igreja.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link do Mapa
            </label>
            <input
              type="url"
              value={formData.mapUrl}
              onChange={(e) => handleChange('mapUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://maps.google.com/..."
            />
            <p className="text-sm text-gray-500 mt-1">
              URL do Google Maps ou outro serviço de mapas
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactSettings;
