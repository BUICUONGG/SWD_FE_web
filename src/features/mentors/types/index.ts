/**
 * Mentor Profile Management Types & Interfaces
 */

// Mentor Status
export const MentorStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type MentorStatusType = typeof MentorStatus[keyof typeof MentorStatus];

/**
 * Mentor Profile Response from API
 */
export interface MentorProfileResponse {
  id: number;
  userId: number;
  shortName?: string;
  department?: string;
  specialization?: string;
  yearsOfExperience?: number;
  email?: string;
  fullName?: string;
  status: MentorStatusType;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Mentor Profile Request for Create/Update
 */
export interface MentorProfileRequest {
  userId: number;
  shortName?: string;
  department?: string;
  specialization?: string;
  yearsOfExperience?: number;
  status?: MentorStatusType;
}

/**
 * Mentor Search Filters
 */
export interface MentorSearchFilters {
  keyword?: string;
  status?: MentorStatusType;
}
