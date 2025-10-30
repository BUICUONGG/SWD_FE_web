/**
 * Enrollment Feature Types
 * Based on EnrollmentController & EnrollmentRequest/EnrollmentResponse
 */

export const EnrollmentStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export type EnrollmentStatusType = typeof EnrollmentStatus[keyof typeof EnrollmentStatus];

// Enrollment Response - từ API
export interface EnrollmentResponse {
  id: number;
  userId: number;
  courseId: number;
  status: EnrollmentStatusType;
  enrollmentDate?: string;
  approvedDate?: string;
  approvedBy?: number;
  completedDate?: string;
  score?: number;
  grade?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Enrollment Request - gửi lên API
export interface EnrollmentRequest {
  userId: number;
  courseId: number;
  status?: EnrollmentStatusType;
}

// Search filters
export interface EnrollmentSearchFilters {
  userId?: number;
  courseId?: number;
}

// Approve enrollment request
export interface ApproveEnrollmentRequest {
  approvedBy: number;
}
