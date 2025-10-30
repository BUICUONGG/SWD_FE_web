// Course related types
// Sync with backend CourseStatus enum
export type CourseStatus = 'UPCOMING' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// Import ApiErrorResponse from auth types
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}

export interface Course {
  courseId: number;
  code: string;
  name: string;
  maxStudents: number;
  currentStudents: number;
  teamFormationDeadline: string;
  status: CourseStatus;
  mentorId: number;
  mentorName: string;
  subjectId: number;
  subjectCode: string;
  semesterId: number;
  semesterCode: string;
}

export interface CreateCourseRequest {
  code: string;
  name: string;
  maxStudents: number;
  teamFormationDeadline: string;
  status: CourseStatus;
  mentorId: number;
  subjectId: number;
  semesterId: number;
}

export interface UpdateCourseRequest {
  code: string;
  name: string;
  maxStudents: number;
  teamFormationDeadline: string;
  status: CourseStatus;
  mentorId: number;
  subjectId: number;
  semesterId: number;
}

export interface CourseSearchParams {
  keyword?: string;
  status?: CourseStatus;
  semesterId?: number;
  mentorId?: number;
  subjectId?: number;
}

export interface CourseResponse {
  success: boolean;
  message: string;
  data: Course;
}

export interface CourseListResponse {
  success: boolean;
  message: string;
  data: Course[];
}

// Related entities
export interface Subject {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
}

export interface Semester {
  semesterId: number;
  semesterCode: string;
  semesterName: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
}

export interface Mentor {
  mentorId: number;
  mentorName: string;
  email: string;
  department: string;
}