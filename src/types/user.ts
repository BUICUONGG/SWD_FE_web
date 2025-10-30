// User Management Types

// User interface
export interface User {
  createdAt: string;
  updatedAt: string;
  userId: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  provider: 'LOCAL' | 'GOOGLE';
  gender: 'MALE' | 'FEMALE';
  dob: string; // YYYY-MM-DD format
}

// Create user request
export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
  gender: 'MALE' | 'FEMALE';
  dob: string; // YYYY-MM-DD format
  status: 'ACTIVE' | 'INACTIVE';
}

// Search parameters
export interface UserSearchParams {
  keyword?: string;
}

// Import result details
export interface ImportFailureDetail {
  row: number;
  email: string;
  error: string;
}

export interface ImportResult {
  totalRows: number;
  successCount: number;
  failureCount: number;
  successEmails: string[];
  failureDetails: ImportFailureDetail[];
}

// API Response types
export interface UserResponse {
  success: true;
  message: string;
  data: User;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface ImportResponse {
  success: true;
  message: string;
  data: ImportResult;
}

export interface DeleteUserResponse {
  success: true;
  message: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}

// Type guards for API responses
/* eslint-disable @typescript-eslint/no-explicit-any */
export function isUserResponse(response: unknown): response is UserResponse {
  const res = response as any;
  return res && res.success === true && res.data && typeof res.data.userId === 'number';
}

export function isUserListResponse(response: unknown): response is UserListResponse {
  const res = response as any;
  return res && res.success === true && Array.isArray(res.data);
}

export function isImportResponse(response: unknown): response is ImportResponse {
  const res = response as any;
  return res && res.success === true && res.data && typeof res.data.totalRows === 'number';
}

export function isDeleteUserResponse(response: unknown): response is DeleteUserResponse {
  const res = response as any;
  return res && res.success === true;
}

export function isApiError(response: unknown): response is ApiErrorResponse {
  const res = response as any;
  return res && res.success === false && typeof res.message === 'string';
}
/* eslint-enable @typescript-eslint/no-explicit-any */