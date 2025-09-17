// Constantes da aplica��o
export const APP_CONFIG = {
  name: 'Igreja Projeto',
  version: '1.0.0',
  description: 'Sistema de gest�o de eventos e inscri��es',
  author: 'Equipe de Desenvolvimento',
  contact: {
    email: 'contato@igreja.com',
    phone: '(11) 99999-9999',
    address: 'Rua da Igreja, 123 - Centro, S�o Paulo - SP'
  }
} as const;

// Status das inscri��es
export const REGISTRATION_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled'
} as const;

// Restri��es alimentares
export const DIETARY_RESTRICTIONS = [
  { value: 'vegetariano', label: 'Vegetariano' },
  { value: 'vegano', label: 'Vegano' },
  { value: 'sem-gluten', label: 'Sem Gl�ten' },
  { value: 'alergia-nozes', label: 'Alergia a Nozes' },
  { value: 'outros', label: 'Outros' }
] as const;

// Categorias de eventos
export const EVENT_CATEGORIES = [
  'Confer�ncia',
  'Retiro',
  'Jovens',
  'Fam�lia',
  'Culto',
  'Especial'
] as const;

// Configura��es de valida��o
export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z�-�\s]+$/
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

// Configura��es de UI
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

// Configura��es de pagina��o
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 25, 50, 100]
} as const;

// Mensagens padr�o
export const MESSAGES = {
  success: {
    registrationCreated: 'Inscri��o realizada com sucesso!',
    registrationUpdated: 'Inscri��o atualizada com sucesso!',
    registrationCancelled: 'Inscri��o cancelada com sucesso!',
    dataExported: 'Dados exportados com sucesso!'
  },
  error: {
    registrationFailed: 'Erro ao realizar inscri��o. Tente novamente.',
    validationError: 'Por favor, corrija os erros no formul�rio.',
    notFound: 'Registro n�o encontrado.',
    serverError: 'Erro interno do servidor. Tente novamente mais tarde.',
    networkError: 'Erro de conex�o. Verifique sua internet.'
  },
  warning: {
    eventFull: 'Este evento est� lotado.',
    registrationPending: 'Sua inscri��o est� pendente de confirma��o.',
    unsavedChanges: 'Voc� tem altera��es n�o salvas.'
  },
  info: {
    loading: 'Carregando...',
    processing: 'Processando...',
    noData: 'Nenhum registro encontrado.'
  }
} as const;

// Configura��es de localStorage
export const STORAGE_KEYS = {
  EVENTS: 'events',
  REGISTRATIONS: 'registrations',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme'
} as const;
