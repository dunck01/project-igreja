import { useState } from 'react';
import { Save } from 'lucide-react';
import { SiteConfig } from '../../types';

interface GeneralSettingsProps {
  config: SiteConfig['general'];
  onSave: (config: Partial<SiteConfig>) => void;
  onChange: () => void;
}

const GeneralSettings = ({ config, onSave, onChange }: GeneralSettingsProps) => {
  const [formData, setFormData] = useState(config);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ general: formData });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Configurações Gerais</h2>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Site
            </label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do seu site"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail de Contato
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contato@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone de Contato
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(11) 99999-9999"
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
              placeholder="Rua, número, cidade - estado"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição do Site
            </label>
            <textarea
              value={formData.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Uma breve descrição do seu site"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
