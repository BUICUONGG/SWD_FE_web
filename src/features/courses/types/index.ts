/**
 * Courses Feature Types
 * Based on CourseController & CourseRequest/CourseResponse
 */

export const CourseStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED',
  DRAFT: 'DRAFT',
} as const;

export type CourseStatusType = typeof CourseStatus[keyof typeof CourseStatus];

// Course Response - lấy từ API
export interface CourseResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  status: CourseStatusType;
  semesterId: number;
  mentorId: number;
  subjectId: number;
  maxStudents?: number;
  currentStudents?: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Course Request - gửi lên API (create/update)
export interface CourseRequest {
  code: string;
  name: string;
  description?: string;
  status?: CourseStatusType;
  semesterId: number;
  mentorId: number;
  subjectId: number;
  maxStudents?: number;
  startDate?: string;
  endDate?: string;
}

// Search filters
export interface CourseSearchFilters {
  keyword?: string;
  status?: CourseStatusType;
  semesterId?: number;
  mentorId?: number;
  subjectId?: number;
}

// List response with pagination (optional)
export interface CourseListResponse {
  data: CourseResponse[];
  total: number;
  page?: number;
  pageSize?: number;
}
