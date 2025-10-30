import * as api from '../../../shared/services/api';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  GoogleLoginRequest,
  RefreshTokenRequest,
} from '../types/index';

const AUTH_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  REFRESH: '/api/v1/auth/refresh',
  LOGOUT: '/api/v1/auth/logout',
  GOOGLE_LOGIN: '/api/v1/auth/login-google',
  INTROSPECT: '/api/v1/auth/introspect',
};

/**
 * Auth Service
 * Tất cả các API calls liên quan tới authentication
 */
export const authService = {
  /**
   * Login with email and password
   * FOR TESTING: Allows login with any email as STUDENT role
   */
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    try {
      // Try to login with backend
      return await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, payload);
    } catch (error) {
      // FOR TESTING: If backend fails, allow login as STUDENT with any email
      console.log('Backend login failed, using test mode. Email:', payload.email);
      
      // Create mock user with STUDENT role
      const mockUser = {
        id: `test-${Date.now()}`,
        email: payload.email,
        fullName: payload.email.split('@')[0],
        role: 'STUDENT' as const,
        avatar: undefined,
        status: 'ACTIVE' as const,
      };

      // Create mock tokens
      const mockAccessToken = `mock_access_${Date.now()}`;
      const mockRefreshToken = `mock_refresh_${Date.now()}`;

      return {
        user: mockUser,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      };
    }
  },

  /**
   * Register new account
   */
  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, payload);
  },

  /**
   * Login with Google
   */
  loginGoogle: async (payload: GoogleLoginRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>(AUTH_ENDPOINTS.GOOGLE_LOGIN, payload);
  },

  /**
   * Refresh access token
   */
  refreshToken: async (payload: RefreshTokenRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH, payload);
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    await api.post(AUTH_ENDPOINTS.LOGOUT);
  },

  /**
   * Introspect token
   */
  introspect: async (): Promise<AuthResponse> => {
    return api.post<AuthResponse>(AUTH_ENDPOINTS.INTROSPECT);
  },
};

export default authService;
