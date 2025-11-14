// Export auth service
export { authService, isApiError, isLoginSuccess } from './authService';

// Export new main services for student flow
export { userService, isApiError as isUserApiError, isUserResponse, isUserListResponse } from './userService';
export { semesterService, isApiError as isSemesterApiError, isSemesterResponse, isSemesterListResponse } from './semesterService';
export { subjectService, isApiError as isSubjectApiError, isSubjectResponse, isSubjectListResponse } from './subjectService';
export { courseService, isApiError as isCourseApiError, isCourseResponse, isCourseListResponse } from './courseService';
export { enrollmentService, isApiError as isEnrollmentApiError, isEnrollmentResponse, isEnrollmentListResponse } from './enrollmentService';
export { ideaService, isApiError as isIdeaApiError, isIdeaResponse, isIdeaListResponse } from './ideaService';
export { majorService, isApiError as isMajorApiError } from './majorService';

// Export report service
export { 
  reportService, 
  isApiError as isReportApiError,
  isDashboardResponse,
  isStudentReportResponse,
  isMentorPerformanceResponse,
  isCourseStatisticsResponse,
  isTeamStatisticsResponse,
  isEnrollmentStatisticsResponse
} from './reportService';

// Note: Feature-specific services (for future use)
// export { userProfileService } from '../features/users/services/userProfileService';
// export { studentService } from '../features/student/services/studentService';