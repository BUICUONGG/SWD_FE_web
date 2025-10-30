import api from '../../../shared/services/api';
import { USER_ENDPOINTS } from '../constants/userEndpoints';
import type { UserResponse, UserRequest, UserSearchFilters, ImportResult } from '../types';

/**
 * User Management Service
 * Handles all user-related API calls
 */
export const userService = {
  /**
   * Create new user (Admin only)
   */
  create: async (data: UserRequest): Promise<UserResponse> => {
    return api.post<UserResponse>(USER_ENDPOINTS.CREATE, data);
  },

  /**
   * Get current user information
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    return api.get<UserResponse>(USER_ENDPOINTS.GET_CURRENT);
  },

  /**
   * Get user by ID
   */
  getById: async (id: number): Promise<UserResponse> => {
    const endpoint = USER_ENDPOINTS.GET_BY_ID.replace(':id', id.toString());
    return api.get<UserResponse>(endpoint);
  },

  /**
   * Get all users
   */
  getAll: async (): Promise<UserResponse[]> => {
    return api.get<UserResponse[]>(USER_ENDPOINTS.GET_ALL);
  },

  /**
   * Search users by keyword (email or fullName)
   */
  search: async (filters: UserSearchFilters): Promise<UserResponse[]> => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `${USER_ENDPOINTS.SEARCH}?${queryString}` 
      : USER_ENDPOINTS.SEARCH;
    
    return api.get<UserResponse[]>(endpoint);
  },

  /**
   * Update user
   */
  update: async (id: number, data: UserRequest): Promise<UserResponse> => {
    const endpoint = USER_ENDPOINTS.UPDATE.replace(':id', id.toString());
    return api.patch<UserResponse>(endpoint, data);
  },

  /**
   * Delete user (soft delete)
   */
  delete: async (id: number): Promise<string> => {
    const endpoint = USER_ENDPOINTS.DELETE.replace(':id', id.toString());
    return api.delete_<string>(endpoint);
  },

  /**
   * Restore deleted user
   */
  restore: async (id: number): Promise<UserResponse> => {
    const endpoint = USER_ENDPOINTS.RESTORE.replace(':id', id.toString());
    return api.patch<UserResponse>(endpoint, {});
  },

  /**
   * Import users from Excel file
   */
  import: async (file: File): Promise<ImportResult> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<ImportResult>(USER_ENDPOINTS.IMPORT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
