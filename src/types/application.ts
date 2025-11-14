// Application Types
export type ApplicationType = 'APPLY' | 'INVITE';
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Application {
  applicationId: number;
  applicationType: ApplicationType;
  status: ApplicationStatus;
  enrollmentId: number;
  applicantUserId: number;
  applicantUserName: string;
  applicantEmail: string;
  applicantMajor?: string;
  teamId: number;
  teamName: string;
  courseId: number;
  courseName: string;
  invitedBy?: number;
  invitedByName?: string;
  createdAt: string;
  handledAt?: string;
  handledBy?: number;
  handledByName?: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data: Application;
}

export interface ApplicationListResponse {
  success: boolean;
  message: string;
  data: Application[];
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}
