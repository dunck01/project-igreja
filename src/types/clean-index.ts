// Tipos principais da aplicação
export interface EventImage {
  id: string;
  eventId: string;
  url: string;
  alt?: string;
  isMain: boolean;
  order: number;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  category: string;
  capacity: number;
  currentRegistrations: number;
  price?: number;
  isActive: boolean;
  isFeatured: boolean;
  tags?: string;
  customFields?: string;
  createdAt: string;
  updatedAt: string;
  eventImages?: EventImage[];
  _count?: {
    registrations: number;
  };
}

export type RegistrationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'WAITLIST';

export interface Registration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
  customData?: string;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
  event?: {
    title: string;
    date: string;
    time: string;
    location: string;
  };
}

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

// Tipos de autenticação
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Tipos de configuração do site
export interface SiteConfig {
  id: string;
  key: string;
  value: string;
  type: ConfigType;
  category: string;
  description?: string;
  isEditable: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ConfigType = 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'COLOR' | 'IMAGE' | 'JSON';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  font: string;
}

// Tipos de upload
export interface Upload {
  id: string;
  filename: string;
  originalFilename: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  category: UploadCategory;
  alt?: string;
  createdAt: string;
  updatedAt: string;
}

export type UploadCategory = 'HERO' | 'GALLERY' | 'EVENT' | 'PROFILE' | 'MEDIA' | 'OTHER';

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

// Tipos para API
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

// Tipos para navegação e estado
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}
