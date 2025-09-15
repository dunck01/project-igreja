// Tipos principais da aplicacao
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

export type RegistrationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'WAITLIST';

export interface RegistrationFormData {
  eventId: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
  customData?: Record<string, unknown>;
}

export interface RegistrationErrors {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
}

// Novos tipos para o sistema administrativo
export interface SiteConfig {
  id: string;
  key: string;
  value: string;
  type: ConfigType;
  category: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ConfigType = 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'COLOR' | 'IMAGE' | 'URL';

export interface Upload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  category?: string;
  isUsed: boolean;
  createdAt: string;
}

export interface Family {
  id: string;
  name: string;
  description?: string;
  image?: string;
  members: string; // JSON string
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  type: MediaType;
  category?: string;
  duration?: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export type MediaType = 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT';

export interface Testimonial {
  id: string;
  name: string;
  message: string;
  image?: string;
  position?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ADMIN' | 'MODERATOR';

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
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  name?: string;
}

export interface SelectProps extends ComponentProps {
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  name?: string;
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export interface TableColumn<T = unknown> {
  key: string;
  title: string;
  render?: (value: unknown, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = unknown> extends ComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (record: T) => void;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  };
}

// Estados da aplicacao
export interface AppState {
  currentView: 'site' | 'admin' | 'confirmation';
  isLoading: boolean;
  error: string | null;
  user: User | null;
  siteConfig: Record<string, string>;
}

// Contextos
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface ConfigContextType {
  configs: Record<string, string>;
  updateConfig: (key: string, value: string) => Promise<void>;
  updateConfigs: (configs: Record<string, string>) => Promise<void>;
  refreshConfigs: () => Promise<void>;
  isLoading: boolean;
}

// Hooks personalizados
export interface UseEventRegistrationReturn {
  events: Event[];
  registrations: Registration[];
  addRegistration: (registration: Omit<Registration, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRegistrationStatus: (id: string, status: RegistrationStatus) => void;
  deleteRegistration: (id: string) => void;
  updateEventRegistrations: (eventId: string, count: number) => void;
  getEventById: (id: string) => Event | undefined;
  getRegistrationsByEvent: (eventId: string) => Registration[];
  isLoading: boolean;
  error: string | null;
}

// Formularios
export interface EventFormData {
  title: string;
  description: string;
  shortDescription?: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  price?: number;
  isFeatured: boolean;
  tags: string[];
  image?: File;
}

export interface ConfigFormData {
  [key: string]: string;
}

// Utilitarios
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// APIs
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  category?: string;
  status?: string;
  featured?: boolean;
  active?: boolean;
  dateFrom?: string;
  dateTo?: string;
}
