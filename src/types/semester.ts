// Semester related types

// Import ApiErrorResponse from existing types
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}

// Main Semester interface
export interface Semester {
  semesterId: number;
  code: string;
  name: string;
  year: number;
  term: 'SPRING' | 'SUMMER' | 'FALL';
  startDate: string;
  endDate: string;
}

// Create request interface
export interface CreateSemesterRequest {
  code: string;
  name: string;
  year: number;
  term: 'SPRING' | 'SUMMER' | 'FALL';
  startDate: string;
  endDate: string;
}

// Update request interface
export interface UpdateSemesterRequest {
  code: string;
  name: string;
  year: number;
  term: 'SPRING' | 'SUMMER' | 'FALL';
  startDate: string;
  endDate: string;
}

// Search parameters
export interface SemesterSearchParams {
  keyword?: string;
  term?: 'SPRING' | 'SUMMER' | 'FALL';
  year?: number;
}

// API Response types
export interface SemesterResponse {
  success: true;
  message: string;
  data: Semester;
}

export interface SemesterListResponse {
  success: boolean;
  message: string;
  data: Semester[];
}

export interface DeleteSemesterResponse {
  success: true;
  message: string;
}

// Type guards - disable ESLint for API response checking
/* eslint-disable @typescript-eslint/no-explicit-any */
export function isSemesterResponse(response: unknown): response is SemesterResponse {
  const res = response as any;
  return res && res.success === true && res.data && typeof res.data.semesterId === 'number';
}

export function isSemesterListResponse(response: unknown): response is SemesterListResponse {
  const res = response as any;
  return res && res.success === true && Array.isArray(res.data);
}

export function isDeleteSemesterResponse(response: unknown): response is DeleteSemesterResponse {
  const res = response as any;
  return res && res.success === true;
}

export function isApiError(response: unknown): response is ApiErrorResponse {
  const res = response as any;
  return res && res.success === false && typeof res.message === 'string';
}
/* eslint-enable @typescript-eslint/no-explicit-any */