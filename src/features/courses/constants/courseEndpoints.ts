/**
 * Courses API Endpoints
 * Based on CoursesController
 */

export const COURSES_ENDPOINTS = {
  // Create course
  CREATE: '/api/courses',

  // Get courses
  LIST: '/api/courses',
  GET_BY_ID: (id: number | string) => `/api/courses/${id}`,
  GET_BY_CODE: (code: string) => `/api/courses/code/${code}`,
  GET_BY_STATUS: (status: string) => `/api/courses/status/${status}`,
  GET_BY_SEMESTER: (semesterId: number | string) => `/api/courses/semester/${semesterId}`,
  GET_BY_MENTOR: (mentorId: number | string) => `/api/courses/mentor/${mentorId}`,
  SEARCH: '/api/courses/search',

  // Update course
  UPDATE: (id: number | string) => `/api/courses/${id}`,

  // Delete course
  DELETE: (id: number | string) => `/api/courses/${id}`,
};

export default COURSES_ENDPOINTS;
