// Tipos principais da aplica��o
export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: string;
  capacity: number;
  currentRegistrations: number;
}

export interface Registration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
  status: RegistrationStatus;
  createdAt: string;
}

export type RegistrationStatus = 'confirmed' | 'pending' | 'cancelled';

export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
  eventId: string;
}

export interface RegistrationErrors {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
}

// Tipos para componentes
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends ComponentProps {
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

// Tipos para API (futuro backend)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para filtros e busca
export interface RegistrationFilters {
  search?: string;
  status?: RegistrationStatus;
  eventId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface EventFilters {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Constantes de tipos
export type DietaryRestriction =
  | 'vegetariano'
  | 'vegano'
  | 'sem-gluten'
  | 'alergia-nozes'
  | 'outros';

export type EventCategory =
  | 'Conferência'
  | 'Retiro'
  | 'Jovens'
  | 'Família'
  | 'Culto'
  | 'Especial';

// Tipos para configurações do site
export interface SiteConfig {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
  };
  about: {
    title: string;
    content: string;
    image: string;
  };
  services: {
    title: string;
    items: ServiceItem[];
  };
  contact: {
    title: string;
    subtitle: string;
    address: string;
    phone: string;
    email: string;
    mapUrl: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface AdminPanelProps {
  onSave: (config: Partial<SiteConfig>) => void;
  currentConfig: SiteConfig;
}
