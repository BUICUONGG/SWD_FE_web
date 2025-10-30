/**
 * Semester Management Types & Interfaces
 */

// Semester Status
export const SemesterStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  COMPLETED: 'COMPLETED',
} as const;

export type SemesterStatusType = typeof SemesterStatus[keyof typeof SemesterStatus];

/**
 * Semester Response from API
 */
export interface SemesterResponse {
  id: number;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SemesterStatusType;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Semester Request for Create/Update
 */
export interface SemesterRequest {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  status?: SemesterStatusType;
}

/**
 * Semester Search Filters
 */
export interface SemesterSearchFilters {
  keyword?: string;
  status?: SemesterStatusType;
}
