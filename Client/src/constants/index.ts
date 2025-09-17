// Constantes da aplicação
export const APP_CONFIG = {
  name: 'Igreja Projeto',
  version: '1.0.0',
  description: 'Sistema de gestão de eventos e inscrições',
  author: 'Equipe de Desenvolvimento',
  contact: {
    email: 'contato@igreja.com',
    phone: '(11) 99999-9999',
    address: 'Rua da Igreja, 123 - Centro, São Paulo - SP'
  }
} as const;

// Status das inscrições
export const REGISTRATION_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled'
} as const;

// Restrições alimentares
export const DIETARY_RESTRICTIONS = [
  { value: 'vegetariano', label: 'Vegetariano' },
  { value: 'vegano', label: 'Vegano' },
  { value: 'sem-gluten', label: 'Sem Glúten' },
  { value: 'alergia-nozes', label: 'Alergia a Nozes' },
  { value: 'outros', label: 'Outros' }
] as const;

// Categorias de eventos
export const EVENT_CATEGORIES = [
  'Conferência',
  'Retiro',
  'Jovens',
  'Família',
  'Culto',
  'Especial'
] as const;

// Configurações de validação
export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    pattern: /^\(?(\d{2})\)?\s?9?\d{4}-?\d{4}$/,
    minLength: 10,
    maxLength: 15
  },
  organization: {
    maxLength: 100
  }
} as const;

// Configurações de UI
export const UI_CONFIG = {
  colors: {
    primary: '#1e40af', // blue-800
    secondary: '#64748b', // slate-500
    success: '#059669', // emerald-600
    warning: '#d97706', // amber-600
    danger: '#dc2626', // red-600
    background: '#f8fafc', // slate-50
    surface: '#ffffff'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  }
} as const;

// Configurações de paginação
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 25, 50, 100]
} as const;

// Mensagens padrão
export const MESSAGES = {
  success: {
    registrationCreated: 'Inscrição realizada com sucesso!',
    registrationUpdated: 'Inscrição atualizada com sucesso!',
    registrationCancelled: 'Inscrição cancelada com sucesso!',
    dataExported: 'Dados exportados com sucesso!'
  },
  error: {
    registrationFailed: 'Erro ao realizar inscrição. Tente novamente.',
    validationError: 'Por favor, corrija os erros no formulário.',
    notFound: 'Registro não encontrado.',
    serverError: 'Erro interno do servidor. Tente novamente mais tarde.',
    networkError: 'Erro de conexão. Verifique sua internet.'
  },
  warning: {
    eventFull: 'Este evento está lotado.',
    registrationPending: 'Sua inscrição está pendente de confirmação.',
    unsavedChanges: 'Você tem alterações não salvas.'
  },
  info: {
    loading: 'Carregando...',
    processing: 'Processando...',
    noData: 'Nenhum registro encontrado.'
  }
} as const;

// Configurações de localStorage
export const STORAGE_KEYS = {
  EVENTS: 'events',
  REGISTRATIONS: 'registrations',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme'
} as const;
