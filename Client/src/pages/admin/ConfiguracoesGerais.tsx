import { useState, useEffect } from 'react';
import { Save, Upload, Settings, AlertCircle } from 'lucide-react';

interface SiteConfig {
  id: string;
  key: string;
  value: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'COLOR' | 'IMAGE' | 'URL';
  category: string;
  description?: string;
}

const ConfiguracoesGerais = () => {
  const [configs, setConfigs] = useState<SiteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Configurações principais do site
  const defaultConfigs = [
    { key: 'site_title', value: 'Igreja O Brasil Para Cristo', type: 'TEXT', category: 'general', description: 'Título principal do site' },
    { key: 'site_subtitle', value: 'Bem-vindos à nossa comunidade', type: 'TEXT', category: 'general', description: 'Subtítulo/descrição' },
    { key: 'church_logo', value: '', type: 'IMAGE', category: 'general', description: 'Logo da igreja' },
    { key: 'hero_background', value: '', type: 'IMAGE', category: 'hero', description: 'Imagem de fundo da seção principal' },
    { key: 'hero_title', value: 'Venha fazer parte da nossa família', type: 'TEXT', category: 'hero', description: 'Título da seção hero' },
    { key: 'hero_subtitle', value: 'Juntos somos mais fortes na fé e no amor', type: 'TEXT', category: 'hero', description: 'Subtítulo da seção hero' },
    { key: 'contact_phone', value: '(11) 99999-9999', type: 'TEXT', category: 'contact', description: 'Telefone de contato' },
    { key: 'contact_email', value: 'contato@igreja.com', type: 'TEXT', category: 'contact', description: 'Email de contato' },
    { key: 'contact_address', value: 'Rua da Igreja, 123 - São Paulo/SP', type: 'TEXT', category: 'contact', description: 'Endereço da igreja' },
    { key: 'facebook_url', value: '', type: 'URL', category: 'social', description: 'URL do Facebook' },
    { key: 'instagram_url', value: '', type: 'URL', category: 'social', description: 'URL do Instagram' },
    { key: 'youtube_url', value: '', type: 'URL', category: 'social', description: 'URL do YouTube' },
    { key: 'primary_color', value: '#3B82F6', type: 'COLOR', category: 'design', description: 'Cor primária do site' }
  ];

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const response = await fetch('/api/v1/config');
      if (response.ok) {
        const data = await response.json();
        setConfigs(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar configurações' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key: string, value: string) => {
    setConfigs(prev => prev.map(config => 
      config.key === key ? { ...config, value } : config
    ));
  };

  const saveConfigs = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/v1/config/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ configs })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
    } finally {
      setSaving(false);
    }
  };

  const renderConfigInput = (config: SiteConfig) => {
    const value = config.value || '';

    switch (config.type) {
      case 'TEXT':
        return (
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value}
            onChange={(e) => handleConfigChange(config.key, e.target.value)}
            placeholder={config.description}
          />
        );

      case 'URL':
        return (
          <input
            type="url"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value}
            onChange={(e) => handleConfigChange(config.key, e.target.value)}
            placeholder={config.description}
          />
        );

      case 'COLOR':
        return (
          <div className="flex gap-2">
            <input
              type="color"
              className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
              value={value}
              onChange={(e) => handleConfigChange(config.key, e.target.value)}
            />
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={value}
              onChange={(e) => handleConfigChange(config.key, e.target.value)}
              placeholder="#000000"
            />
          </div>
        );

      case 'IMAGE':
        return (
          <div className="space-y-2">
            <input
              type="url"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={value}
              onChange={(e) => handleConfigChange(config.key, e.target.value)}
              placeholder="URL da imagem"
            />
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              Fazer Upload
            </button>
            {value && (
              <img
                src={value}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            )}
          </div>
        );

      default:
        return (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            value={value}
            onChange={(e) => handleConfigChange(config.key, e.target.value)}
            placeholder={config.description}
          />
        );
    }
  };

  const groupedConfigs = configs.reduce((acc, config) => {
    if (!acc[config.category]) {
      acc[config.category] = [];
    }
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, SiteConfig[]>);

  const categoryTitles = {
    general: 'Configurações Gerais',
    hero: 'Seção Principal (Hero)',
    contact: 'Informações de Contato',
    social: 'Redes Sociais',
    design: 'Design e Cores'
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
            <Settings className="w-8 h-8" />
            Configurações Gerais
          </h1>
          <p className="text-gray-600">Gerencie as configurações principais do site</p>
        </div>
        
        <button
          onClick={saveConfigs}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
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

      {/* Seções de configuração */}
      <div className="space-y-8">
        {Object.entries(groupedConfigs).map(([category, categoryConfigs]) => (
          <div key={category} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {categoryTitles[category as keyof typeof categoryTitles] || category}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categoryConfigs.map((config) => (
                <div key={config.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {config.description || config.key}
                  </label>
                  {renderConfigInput(config)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfiguracoesGerais;