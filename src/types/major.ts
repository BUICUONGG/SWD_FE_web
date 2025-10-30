// Major related types

// Import ApiErrorResponse from course types
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}

export interface Major {
  majorId: number;
  code: string;
  name: string;
  isActive?: boolean; // Optional since some responses don't include it
}

export interface CreateMajorRequest {
  code: string;
  name: string;
  isActive: boolean;
}

export interface UpdateMajorRequest {
  code: string;
  name: string;
  isActive: boolean;
}

export interface MajorSearchParams {
  keyword?: string;
}

export interface MajorResponse {
  success: true;
  message: string;
  data: Major;
}

export interface MajorListResponse {
  success: boolean;
  message: string;
  data: Major[];
}

export interface DeleteMajorResponse {
  success: true;
  message: string;
}

// Type guards - disable ESLint for API response checking
/* eslint-disable @typescript-eslint/no-explicit-any */
export function isMajorResponse(response: unknown): response is MajorResponse {
  const res = response as any;
  return res && res.success === true && res.data && typeof res.data.majorId === 'number';
}

export function isMajorListResponse(response: unknown): response is MajorListResponse {
  const res = response as any;
  return res && res.success === true && Array.isArray(res.data);
}

export function isDeleteMajorResponse(response: unknown): response is DeleteMajorResponse {
  const res = response as any;
  return res && res.success === true;
}

export function isApiError(response: unknown): response is ApiErrorResponse {
  const res = response as any;
  return res && res.success === false && typeof res.message === 'string';
}