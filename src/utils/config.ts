// API Configuration

// Backend server URL from environment variables
const getBaseUrl = (): string => {
  // Vite uses VITE_ prefix for environment variables
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Fallback to localhost if env var is not set
  const baseUrl = envUrl || 'http://localhost:8080';
  
  // Log current API base URL in development
  if (import.meta.env.DEV) {
    console.log('🔗 API Base URL:', baseUrl);
  }
  
  return baseUrl;
};

export const API_CONFIG = {
  // Get base URL from environment
  BASE_URL: getBaseUrl(),
  
  // API endpoints
  AUTH: {
    BASE: '/api/v1/auth',
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    INTROSPECT: '/api/v1/auth/introspect',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
  }
};

// Export app info from environment
export const APP_CONFIG = {
  TITLE: import.meta.env.VITE_APP_TITLE || 'SWD FE Web',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

// Get full URL for endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};