import { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { SiteConfig } from '../../types';

interface AboutSettingsProps {
  config: SiteConfig['about'];
  onSave: (config: Partial<SiteConfig>) => void;
  onChange: () => void;
}

const AboutSettings = ({ config, onSave, onChange }: AboutSettingsProps) => {
  const [formData, setFormData] = useState(config);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ about: formData });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleChange('image', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Configurações da Página Sobre</h2>
        <button
          onClick={handleSubmit}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título da Seção
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Sobre Nós"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conteúdo
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva sua igreja, missão, valores..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagem
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="about-image-upload"
              />
              <label
                htmlFor="about-image-upload"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Escolher Imagem
              </label>
              <span className="text-sm text-gray-500">ou</span>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="URL da imagem"
              />
            </div>

            {formData.image && (
              <div className="mt-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AboutSettings;
