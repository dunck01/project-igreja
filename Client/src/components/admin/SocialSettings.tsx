import { useState } from 'react';
import { Save } from 'lucide-react';
import { SiteConfig } from '../../types';

interface SocialSettingsProps {
  config: SiteConfig['social'];
  onSave: (config: Partial<SiteConfig>) => void;
  onChange: () => void;
}

const SocialSettings = ({ config, onSave, onChange }: SocialSettingsProps) => {
  const [formData, setFormData] = useState(config);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ social: formData });
  };

  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/suaigreja' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/suaigreja' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/c/suaigreja' },
    { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/5511999999999' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Redes Sociais</h2>
        <button
          onClick={handleSubmit}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Configure os links para suas redes sociais. Deixe em branco se não quiser exibir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialPlatforms.map((platform) => (
            <div key={platform.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {platform.label}
              </label>
              <input
                type="url"
                value={formData[platform.key as keyof typeof formData] || ''}
                onChange={(e) => handleChange(platform.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={platform.placeholder}
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3">Links configurados:</p>
            <div className="space-y-2">
              {socialPlatforms.map((platform) => {
                const value = formData[platform.key as keyof typeof formData];
                return value ? (
                  <div key={platform.key} className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">{platform.label}:</span>
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 truncate"
                    >
                      {value}
                    </a>
                  </div>
                ) : null;
              })}
              {Object.values(formData).every(value => !value) && (
                <p className="text-sm text-gray-500">Nenhuma rede social configurada</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SocialSettings;
