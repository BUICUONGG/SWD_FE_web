/**
 * Enrollment API Endpoints
 * Based on EnrollmentController
 */

export const ENROLLMENT_ENDPOINTS = {
  // Create enrollment
  ENROLL: '/api/enrollments',

  // Get enrollments
  GET_BY_ID: (id: number | string) => `/api/enrollments/${id}`,
  GET_BY_USER: (userId: number | string) => `/api/enrollments/user/${userId}`,
  GET_BY_COURSE: (courseId: number | string) => `/api/enrollments/course/${courseId}`,
  SEARCH: '/api/enrollments/search',

  // Update enrollment status
  APPROVE: (id: number | string) => `/api/enrollments/${id}/approve`,
  COMPLETE: (id: number | string) => `/api/enrollments/${id}/complete`,

  // Delete enrollment
  DELETE: (id: number | string) => `/api/enrollments/${id}`,
};

export default ENROLLMENT_ENDPOINTS;
