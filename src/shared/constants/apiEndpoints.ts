/**
 * API Endpoints Constants
 * Định nghĩa tất cả API endpoints
 */

const API_V1 = '/api/v1';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_V1}/auth/login`,
    REGISTER: `${API_V1}/auth/register`,
    LOGOUT: `${API_V1}/auth/logout`,
    REFRESH: `${API_V1}/auth/refresh`,
    GOOGLE_LOGIN: `${API_V1}/auth/login-google`,
    INTROSPECT: `${API_V1}/auth/introspect`,
  },

  // Courses
  COURSES: {
    LIST: `${API_V1}/courses`,
    GET: (id: string) => `${API_V1}/courses/${id}`,
    CREATE: `${API_V1}/courses`,
    UPDATE: (id: string) => `${API_V1}/courses/${id}`,
    DELETE: (id: string) => `${API_V1}/courses/${id}`,
  },

  // Enrollment
  ENROLLMENT: {
    LIST: `${API_V1}/enrollments`,
    CREATE: `${API_V1}/enrollments`,
    GET: (id: string) => `${API_V1}/enrollments/${id}`,
    UPDATE: (id: string) => `${API_V1}/enrollments/${id}`,
    DELETE: (id: string) => `${API_V1}/enrollments/${id}`,
  },

  // Subjects
  SUBJECTS: {
    LIST: `${API_V1}/subjects`,
    GET: (id: string) => `${API_V1}/subjects/${id}`,
    CREATE: `${API_V1}/subjects`,
    UPDATE: (id: string) => `${API_V1}/subjects/${id}`,
    DELETE: (id: string) => `${API_V1}/subjects/${id}`,
  },

  // Majors
  MAJORS: {
    LIST: `${API_V1}/majors`,
    GET: (id: string) => `${API_V1}/majors/${id}`,
    CREATE: `${API_V1}/majors`,
    UPDATE: (id: string) => `${API_V1}/majors/${id}`,
    DELETE: (id: string) => `${API_V1}/majors/${id}`,
  },

  // Semesters
  SEMESTERS: {
    LIST: `${API_V1}/semesters`,
    GET: (id: string) => `${API_V1}/semesters/${id}`,
    CREATE: `${API_V1}/semesters`,
    UPDATE: (id: string) => `${API_V1}/semesters/${id}`,
    DELETE: (id: string) => `${API_V1}/semesters/${id}`,
  },

  // Mentors
  MENTORS: {
    LIST: `${API_V1}/mentors`,
    GET: (id: string) => `${API_V1}/mentors/${id}`,
    CREATE: `${API_V1}/mentors`,
    UPDATE: (id: string) => `${API_V1}/mentors/${id}`,
    DELETE: (id: string) => `${API_V1}/mentors/${id}`,
  },

  // Users
  USERS: {
    LIST: `${API_V1}/users`,
    GET: (id: string) => `${API_V1}/users/${id}`,
    CREATE: `${API_V1}/users`,
    UPDATE: (id: string) => `${API_V1}/users/${id}`,
    DELETE: (id: string) => `${API_V1}/users/${id}`,
    PROFILE: `${API_V1}/users/profile`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: `${API_V1}/notifications`,
    GET: (id: string) => `${API_V1}/notifications/${id}`,
    MARK_READ: (id: string) => `${API_V1}/notifications/${id}/read`,
    MARK_ALL_READ: `${API_V1}/notifications/mark-all-read`,
  },

  // Health Check
  HEALTH: `${API_V1}/health`,
};

export default API_ENDPOINTS;
