import { useState, useEffect } from 'react';
import { SiteConfig } from '../types';

const STORAGE_KEY = 'site_config';

// Configuração padrão do site
const defaultConfig: SiteConfig = {
  general: {
    siteName: 'Igreja Projeto',
    siteDescription: 'Sistema de gestão de eventos e inscrições',
    contactEmail: 'contato@igreja.com',
    contactPhone: '(11) 99999-9999',
    address: 'Rua da Igreja, 123 - Centro, São Paulo - SP'
  },
  hero: {
    title: 'Bem-vindo à Nossa Igreja',
    subtitle: 'Um lugar de fé, amor e comunidade',
    backgroundImage: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    ctaText: 'Saiba Mais',
    ctaLink: '#sobre'
  },
  about: {
    title: 'Sobre Nós',
    content: 'Somos uma comunidade cristã dedicada a espalhar o amor de Cristo e servir nossa comunidade local.',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'
  },
  services: {
    title: 'Nossos Serviços',
    items: [
      {
        id: '1',
        title: 'Cultos Dominiciais',
        description: 'Participe dos nossos cultos aos domingos e conecte-se com a comunidade.',
        icon: 'Church'
      },
      {
        id: '2',
        title: 'Grupos de Estudo',
        description: 'Estude a Bíblia em pequenos grupos e cresça espiritualmente.',
        icon: 'BookOpen'
      },
      {
        id: '3',
        title: 'Ministérios',
        description: 'Envolva-se em diferentes ministérios e sirva à comunidade.',
        icon: 'Users'
      }
    ]
  },
  contact: {
    title: 'Entre em Contato',
    subtitle: 'Estamos aqui para ajudar',
    address: 'Rua da Igreja, 123 - Centro, São Paulo - SP',
    phone: '(11) 99999-9999',
    email: 'contato@igreja.com',
    mapUrl: 'https://maps.google.com'
  },
  social: {
    facebook: 'https://facebook.com/igrejaprojeto',
    instagram: 'https://instagram.com/igrejaprojeto',
    youtube: 'https://youtube.com/igrejaprojeto',
    whatsapp: 'https://wa.me/5511999999999'
  }
};

export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configuração do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedConfig = JSON.parse(saved);
        setConfig({ ...defaultConfig, ...parsedConfig });
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar configuração no localStorage
  const saveConfig = (newConfig: Partial<SiteConfig>) => {
    try {
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfig));
      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      return false;
    }
  };

  // Resetar para configuração padrão
  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    config,
    saveConfig,
    resetConfig,
    isLoading
  };
};
