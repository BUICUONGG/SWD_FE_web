// Mentor Profile related types

// Import ApiErrorResponse from existing types
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}

// Contact Info structure
export interface ContactInfo {
  phone?: string;
  email?: string;
  office?: string;
  skype?: string;
  teams?: string;
}

// Main Mentor Profile interface
export interface MentorProfile {
  mentorProfileId: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  shortName?: string;
  bio?: string;
  expertise?: string[];
  workingTime?: string;
  contactInfo?: ContactInfo;
  isActive?: boolean;
}

// Create request interface
export interface CreateMentorProfileRequest {
  userId: number;
  shortName: string;
}

// Update request interface
export interface UpdateMentorProfileRequest {
  userId: number;
  shortName: string;
}

// Search parameters
export interface MentorProfileSearchParams {
  keyword?: string;
}

// API Response types
export interface MentorProfileResponse {
  success: true;
  message: string;
  data: MentorProfile;
}

export interface MentorProfileListResponse {
  success: boolean;
  message: string;
  data: MentorProfile[];
}

export interface DeleteMentorProfileResponse {
  success: true;
  message: string;
}

// Type guards - disable ESLint for API response checking
/* eslint-disable @typescript-eslint/no-explicit-any */
export function isMentorProfileResponse(response: unknown): response is MentorProfileResponse {
  const res = response as any;
  return res && res.success === true && res.data && typeof res.data.mentorProfileId === 'number';
}

export function isMentorProfileListResponse(response: unknown): response is MentorProfileListResponse {
  const res = response as any;
  return res && res.success === true && Array.isArray(res.data);
}

export function isDeleteMentorProfileResponse(response: unknown): response is DeleteMentorProfileResponse {
  const res = response as any;
  return res && res.success === true;
}

export function isApiError(response: unknown): response is ApiErrorResponse {
  const res = response as any;
  return res && res.success === false && typeof res.message === 'string';
}