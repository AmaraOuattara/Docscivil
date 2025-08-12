// Configuration constants for the DocsCivil mobile app
export const CONFIG = {
  API_BASE_URL: 'http://localhost:3000/api',
  API_TIMEOUT: 10000,
  STORAGE_KEYS: {
    USER_TOKEN: '@docs_civil_token',
    USER_DATA: '@docs_civil_user',
    REMEMBER_ME: '@docs_civil_remember'
  }
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
    LIST: '/users'
  },
  PROSPECTS: {
    LIST: '/prospects',
    CREATE: '/prospects',
    UPDATE: '/prospects',
    DELETE: '/prospects'
  },
  LOCATIONS: {
    COMMUNES: '/communes',
    LOCALITES: '/localites',
    ZONES: '/zones',
    JURIDICTIONS: '/juridictions'
  },
  DOCUMENTS: {
    TYPES: '/typecopies',
    ETATS: '/etats'
  }
};

export const COLORS = {
  primary: '#2E3A87',
  secondary: '#4CAF50',
  accent: '#FF6B35',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  info: '#2196F3'
};

export const TYPOGRAPHY = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28
  },
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40
};