/**
 * Semester Management API Endpoints
 */
export const SEMESTER_ENDPOINTS = {
  CREATE: '/api/semesters',
  GET_ALL: '/api/semesters',
  GET_BY_ID: '/api/semesters/:id',
  GET_BY_CODE: '/api/semesters/code/:code',
  UPDATE: '/api/semesters/:id',
  DELETE: '/api/semesters/:id',
} as const;
