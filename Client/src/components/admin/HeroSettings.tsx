import { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { SiteConfig } from '../../types';

interface HeroSettingsProps {
  config: SiteConfig['hero'];
  onSave: (config: Partial<SiteConfig>) => void;
  onChange: () => void;
}

const HeroSettings = ({ config, onSave, onChange }: HeroSettingsProps) => {
  const [formData, setFormData] = useState(config);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ hero: formData });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simular upload - em produção, isso seria enviado para um servidor
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleChange('backgroundImage', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Configurações do Hero</h2>
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
              Título Principal
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Bem-vindo à Nossa Igreja"
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
              placeholder="Um lugar de fé, amor e comunidade"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto do Botão
            </label>
            <input
              type="text"
              value={formData.ctaText}
              onChange={(e) => handleChange('ctaText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Saiba Mais"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link do Botão
            </label>
            <input
              type="text"
              value={formData.ctaLink}
              onChange={(e) => handleChange('ctaLink', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#sobre"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem de Fundo
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="hero-image-upload"
                />
                <label
                  htmlFor="hero-image-upload"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Escolher Imagem
                </label>
                <span className="text-sm text-gray-500">ou</span>
                <input
                  type="text"
                  value={formData.backgroundImage}
                  onChange={(e) => handleChange('backgroundImage', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="URL da imagem"
                />
              </div>

              {formData.backgroundImage && (
                <div className="mt-3">
                  <img
                    src={formData.backgroundImage}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HeroSettings;
