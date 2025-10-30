/**
 * User Management Types & Interfaces
 */

// User Status
export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETED: 'DELETED',
} as const;

export type UserStatusType = typeof UserStatus[keyof typeof UserStatus];

// User Roles
export const UserRoles = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  MENTOR: 'MENTOR',
} as const;

export type UserRoleType = typeof UserRoles[keyof typeof UserRoles];

/**
 * User Response from API
 */
export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  gender?: string;
  dateOfBirth?: string;
  avatar?: string;
  role: UserRoleType;
  status: UserStatusType;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User Request for Create/Update
 */
export interface UserRequest {
  email: string;
  fullName: string;
  password?: string;
  gender?: string;
  dateOfBirth?: string;
  avatar?: string;
  role?: UserRoleType;
  status?: UserStatusType;
}

/**
 * User Search Filters
 */
export interface UserSearchFilters {
  keyword?: string;
  role?: UserRoleType;
  status?: UserStatusType;
}

/**
 * Import Result
 */
export interface ImportResult {
  successCount: number;
  failureCount: number;
  totalRows: number;
  errors?: Array<{
    row: number;
    message: string;
  }>;
}
