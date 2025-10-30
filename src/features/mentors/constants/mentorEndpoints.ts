/**
 * Mentor Profile Management API Endpoints
 */
export const MENTOR_ENDPOINTS = {
  CREATE: '/api/mentor-profiles',
  GET_ALL: '/api/mentor-profiles',
  GET_BY_ID: '/api/mentor-profiles/:id',
  GET_BY_USER_ID: '/api/mentor-profiles/user/:userId',
  SEARCH: '/api/mentor-profiles/search',
  UPDATE: '/api/mentor-profiles/:id',
  DELETE: '/api/mentor-profiles/:id',
} as const;
