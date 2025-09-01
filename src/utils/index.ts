import { VALIDATION_RULES } from '../constants';

// Utilitários de validação
export const validation = {
  isValidEmail: (email: string): boolean => {
    return VALIDATION_RULES.email.pattern.test(email);
  },

  isValidPhone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s/g, '');
    return VALIDATION_RULES.phone.pattern.test(cleanPhone) &&
           cleanPhone.length >= VALIDATION_RULES.phone.minLength &&
           cleanPhone.length <= VALIDATION_RULES.phone.maxLength;
  },

  isValidName: (name: string): boolean => {
    return name.length >= VALIDATION_RULES.name.minLength &&
           name.length <= VALIDATION_RULES.name.maxLength &&
           VALIDATION_RULES.name.pattern.test(name);
  },

  formatPhone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  },

  validateRequired: (value: string, fieldName: string): string | null => {
    if (!value || value.trim() === '') {
      return `${fieldName} é obrigatório`;
    }
    return null;
  }
};

// Utilitários de formatação
export const format = {
  date: (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  },

  dateTime: (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  },

  currency: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  number: (value: number): string => {
    return new Intl.NumberFormat('pt-BR').format(value);
  },

  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate: (str: string, maxLength: number): string => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
  }
};

// Utilitários de array
export const array = {
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  sortBy: <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  },

  unique: <T>(array: T[]): T[] => {
    return Array.from(new Set(array));
  },

  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};

// Utilitários de objeto
export const object = {
  isEmpty: (obj: Record<string, unknown>): boolean => {
    return Object.keys(obj).length === 0;
  },

  pick: <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  omit: <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },

  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  }
};

// Utilitários de localStorage
export const storage = {
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
    }
  }
};

// Utilitários de debounce e throttle
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Utilitários de string
export const string = {
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  camelToKebab: (str: string): string => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  },

  kebabToCamel: (str: string): string => {
    return str.replace(/-./g, x => x[1].toUpperCase());
  },

  generateId: (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

// Utilitários de URL
export const url = {
  getQueryParam: (param: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  setQueryParam: (param: string, value: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url.toString());
  },

  removeQueryParam: (param: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.pushState({}, '', url.toString());
  }
};
