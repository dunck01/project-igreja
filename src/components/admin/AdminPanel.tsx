import { useState } from 'react';
import { Settings, Image, FileText, Mail, Globe, RotateCcw } from 'lucide-react';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { SiteConfig } from '../../types';
import GeneralSettings from './GeneralSettings';
import HeroSettings from './HeroSettings';
import AboutSettings from './AboutSettings';
import ServicesSettings from './ServicesSettings';
import ContactSettings from './ContactSettings';
import SocialSettings from './SocialSettings';

const AdminPanel = () => {
  const { config, saveConfig, resetConfig } = useSiteConfig();
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'general', label: 'Geral', icon: Settings },
    { id: 'hero', label: 'Hero', icon: Image },
    { id: 'about', label: 'Sobre', icon: FileText },
    { id: 'services', label: 'Serviços', icon: Settings },
    { id: 'contact', label: 'Contato', icon: Mail },
    { id: 'social', label: 'Redes Sociais', icon: Globe }
  ];

  const handleSave = (sectionConfig: Partial<SiteConfig>) => {
    const success = saveConfig(sectionConfig);
    if (success) {
      setHasChanges(false);
      alert('Configurações salvas com sucesso!');
    } else {
      alert('Erro ao salvar configurações.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja resetar todas as configurações para o padrão?')) {
      resetConfig();
      setHasChanges(false);
      alert('Configurações resetadas com sucesso!');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings config={config.general} onSave={handleSave} onChange={() => setHasChanges(true)} />;
      case 'hero':
        return <HeroSettings config={config.hero} onSave={handleSave} onChange={() => setHasChanges(true)} />;
      case 'about':
        return <AboutSettings config={config.about} onSave={handleSave} onChange={() => setHasChanges(true)} />;
      case 'services':
        return <ServicesSettings config={config.services} onSave={handleSave} onChange={() => setHasChanges(true)} />;
      case 'contact':
        return <ContactSettings config={config.contact} onSave={handleSave} onChange={() => setHasChanges(true)} />;
      case 'social':
        return <SocialSettings config={config.social} onSave={handleSave} onChange={() => setHasChanges(true)} />;
      default:
        return <GeneralSettings config={config.general} onSave={handleSave} onChange={() => setHasChanges(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Customize seu site</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetar
              </button>
              {hasChanges && (
                <div className="flex items-center text-yellow-600 text-sm">
                  <span>Você tem alterações não salvas</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h2>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-md text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
