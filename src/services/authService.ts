// Authentication API Service

import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse, 
  IntrospectRequest, 
  IntrospectResponse, 
  RefreshTokenRequest, 
  RefreshTokenResponse, 
  LogoutRequest, 
  LogoutResponse,
  ApiErrorResponse
} from '../types/auth';
import { API_CONFIG, getApiUrl } from '../utils/config';

/**
 * Generic API call handler
 */
const apiCall = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T | ApiErrorResponse> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Có lỗi xảy ra',
        errorCode: data.errorCode,
      } as ApiErrorResponse;
    }

    return data as T;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến server',
      errorCode: 'NETWORK_ERROR',
    } as ApiErrorResponse;
  }
};

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Đăng nhập
   */
  login: async (loginData: LoginRequest): Promise<LoginResponse | ApiErrorResponse> => {
    return apiCall<LoginResponse>(getApiUrl(API_CONFIG.AUTH.LOGIN), {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  },

  /**
   * Đăng ký
   */
  register: async (registerData: RegisterRequest): Promise<RegisterResponse | ApiErrorResponse> => {
    return apiCall<RegisterResponse>(getApiUrl(API_CONFIG.AUTH.REGISTER), {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  },

  /**
   * Xác thực token
   */
  introspect: async (token: string): Promise<IntrospectResponse | ApiErrorResponse> => {
    const introspectData: IntrospectRequest = { token };
    return apiCall<IntrospectResponse>(getApiUrl(API_CONFIG.AUTH.INTROSPECT), {
      method: 'POST',
      body: JSON.stringify(introspectData),
    });
  },

  /**
   * Làm mới token
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse | ApiErrorResponse> => {
    const refreshData: RefreshTokenRequest = { token: refreshToken };
    return apiCall<RefreshTokenResponse>(getApiUrl(API_CONFIG.AUTH.REFRESH), {
      method: 'POST',
      body: JSON.stringify(refreshData),
    });
  },

  /**
   * Đăng xuất
   */
  logout: async (accessToken: string, refreshToken: string): Promise<LogoutResponse | ApiErrorResponse> => {
    const logoutData: LogoutRequest = { 
      accessToken, 
      refreshToken 
    };
    return apiCall<LogoutResponse>(getApiUrl(API_CONFIG.AUTH.LOGOUT), {
      method: 'POST',
      body: JSON.stringify(logoutData),
    });
  },
};

/**
 * API Response type guards
 */
export const isApiError = (response: unknown): response is ApiErrorResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'success' in response && 
         (response as ApiErrorResponse).success === false;
};

export const isLoginSuccess = (response: unknown): response is LoginResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'success' in response && 
         (response as LoginResponse).success === true &&
         'data' in response &&
         typeof (response as LoginResponse).data.accessToken === 'string';
};