/**
 * Constantes da aplicação
 */

// URLs da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH: '/refresh-token'
  },
  PRODUCTS: {
    BASE: '/produtos',
    BY_ID: (id) => `/produtos/${id}`,
    SEARCH: '/produtos/search'
  },
  TRANSACTIONS: {
    BASE: '/caixa',
    MOVIMENTACAO: '/caixa/movimentacao',
    BY_ID: (id) => `/caixa/movimentacao/${id}`,
    SUMMARY: '/caixa/resumo',
    TOTALS: '/caixa/totals'
  }
};

// Configurações da aplicação
export const APP_CONFIG = {
  NAME: 'SIGMA',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de Gestão de Produtos',
  DEFAULT_LANGUAGE: 'pt-BR',
  SUPPORTED_LANGUAGES: ['pt-BR', 'en-US']
};

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
};

// Tipos de transação
export const TRANSACTION_TYPES = {
  ENTRADA: 'entrada',
  SAIDA: 'saida'
};

// Status de requisições
export const REQUEST_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Tipos de notificação
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Configurações de validação
export const VALIDATION_RULES = {
  PRODUCT: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
    PRICE_MIN: 0.01,
    PRICE_MAX: 999999.99
  },
  TRANSACTION: {
    QUANTITY_MIN: 1,
    QUANTITY_MAX: 999999,
    OBSERVATION_MAX_LENGTH: 255
  },
  AUTH: {
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 50,
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 100
  }
};

// Configurações de tempo
export const TIME_CONFIG = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  API_TIMEOUT: 10000,
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3
};

// Configurações de localStorage
export const STORAGE_KEYS = {
  TOKEN: 'token',
  LANGUAGE: 'language',
  THEME: 'theme',
  USER_PREFERENCES: 'userPreferences'
};

// Cores do tema
export const COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  SUCCESS: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d'
  },
  ERROR: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c'
  },
  WARNING: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309'
  }
};

// Configurações de acessibilidade
export const ACCESSIBILITY = {
  FOCUS_VISIBLE_OUTLINE: '2px solid #3b82f6',
  SKIP_LINK_HEIGHT: '40px',
  MIN_TOUCH_TARGET: '44px'
};

// Breakpoints responsivos
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
};

// Configurações de formato
export const FORMAT_CONFIG = {
  CURRENCY: {
    LOCALE: 'pt-BR',
    CURRENCY: 'BRL'
  },
  DATE: {
    LOCALE: 'pt-BR',
    FORMAT: 'dd/MM/yyyy',
    DATETIME_FORMAT: 'dd/MM/yyyy HH:mm'
  },
  NUMBER: {
    LOCALE: 'pt-BR',
    DECIMAL_PLACES: 2
  }
};

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  NUMBERS_ONLY: /^\d+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/
};

export default {
  API_ENDPOINTS,
  APP_CONFIG,
  PAGINATION,
  TRANSACTION_TYPES,
  REQUEST_STATUS,
  NOTIFICATION_TYPES,
  VALIDATION_RULES,
  TIME_CONFIG,
  STORAGE_KEYS,
  COLORS,
  ACCESSIBILITY,
  BREAKPOINTS,
  FORMAT_CONFIG,
  REGEX_PATTERNS
};
