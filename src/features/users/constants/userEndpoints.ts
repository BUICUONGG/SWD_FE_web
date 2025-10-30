/**
 * User Management API Endpoints
 */
export const USER_ENDPOINTS = {
  CREATE: '/api/users',
  GET_ALL: '/api/users',
  GET_BY_ID: '/api/users/:id',
  GET_CURRENT: '/api/users/me',
  SEARCH: '/api/users/search',
  UPDATE: '/api/users/:id',
  DELETE: '/api/users/:id',
  RESTORE: '/api/users/:id/restore',
  IMPORT: '/api/users/import',
} as const;
