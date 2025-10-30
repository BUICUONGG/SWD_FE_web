/**
 * Auth Feature Types
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MENTOR' | 'STUDENT';
  avatar?: string;
  phone?: string;
  createdAt?: string;
}

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface GoogleLoginRequest {
  token: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

// Response types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

// Standard response type
export interface StandardResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
}

export interface ApiError {
  success: false;
  code: number;
  message: string;
}
