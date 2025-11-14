// Enrollment related types

// Enrollment Status
export type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';

// Import ApiErrorResponse from course types
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}

export interface Enrollment {
  enrollmentId: number;
  userId: number;
  userFullName?: string;
  userEmail: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  enrollmentDate: string;
  isDeleted: boolean;
  status?: EnrollmentStatus; // Optional vì backend không trả về
  approvedBy?: number;
  approvedByName?: string;
  approvedDate?: string;
  completedDate?: string;
}

export interface CreateEnrollmentRequest {
  userId: number;
  courseId: number;
}

export interface EnrollmentSearchParams {
  userId?: number;
  courseId?: number;
}

export interface EnrollmentResponse {
  success: true;
  message: string;
  data: Enrollment;
}

export interface EnrollmentListResponse {
  success: boolean;
  message: string;
  data: Enrollment[];
}

// Related entities for UI
export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  role: string;
}

export interface Course {
  courseId: number;
  code: string;
  name: string;
  maxStudents: number;
  currentStudents: number;
  status: string;
}