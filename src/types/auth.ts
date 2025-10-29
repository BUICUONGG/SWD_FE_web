// Authentication related types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    roleName: 'ADMIN' | 'STUDENT';
  };
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    email: string;
    fullName: string;
    gender?: string;
    dob?: string;
    provider: string;
  };
}

export interface IntrospectRequest {
  token: string;
}

export interface IntrospectResponse {
  success: boolean;
  message: string;
  data: {
    valid: boolean;
    scope: string;
    username: string;
    exp: number;
  };
}

export interface RefreshTokenRequest {
  token: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LogoutRequest {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  data: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}

export interface UserInfo {
  email: string;
  role: 'ADMIN' | 'STUDENT';
  fullName?: string;
  isAdmin: boolean;
  isStudent: boolean;
}

export type AuthResponse<T = unknown> = T | ApiErrorResponse;