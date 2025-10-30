import api from '../../../shared/services/api';
import { MENTOR_ENDPOINTS } from '../constants/mentorEndpoints';
import type { MentorProfileResponse, MentorProfileRequest, MentorSearchFilters } from '../types';

/**
 * Mentor Profile Management Service
 * Handles all mentor-related API calls
 */
export const mentorService = {
  /**
   * Create new mentor profile
   */
  create: async (data: MentorProfileRequest): Promise<MentorProfileResponse> => {
    return api.post<MentorProfileResponse>(MENTOR_ENDPOINTS.CREATE, data);
  },

  /**
   * Get mentor profile by ID
   */
  getById: async (id: number): Promise<MentorProfileResponse> => {
    const endpoint = MENTOR_ENDPOINTS.GET_BY_ID.replace(':id', id.toString());
    return api.get<MentorProfileResponse>(endpoint);
  },

  /**
   * Get mentor profile by User ID
   */
  getByUserId: async (userId: number): Promise<MentorProfileResponse> => {
    const endpoint = MENTOR_ENDPOINTS.GET_BY_USER_ID.replace(':userId', userId.toString());
    return api.get<MentorProfileResponse>(endpoint);
  },

  /**
   * Get all mentor profiles
   */
  getAll: async (): Promise<MentorProfileResponse[]> => {
    return api.get<MentorProfileResponse[]>(MENTOR_ENDPOINTS.GET_ALL);
  },

  /**
   * Search mentor profiles by keyword (shortName or fullName)
   */
  search: async (filters: MentorSearchFilters): Promise<MentorProfileResponse[]> => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.status) params.append('status', filters.status);
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `${MENTOR_ENDPOINTS.SEARCH}?${queryString}` 
      : MENTOR_ENDPOINTS.SEARCH;
    
    return api.get<MentorProfileResponse[]>(endpoint);
  },

  /**
   * Update mentor profile
   */
  update: async (id: number, data: MentorProfileRequest): Promise<MentorProfileResponse> => {
    const endpoint = MENTOR_ENDPOINTS.UPDATE.replace(':id', id.toString());
    return api.patch<MentorProfileResponse>(endpoint, data);
  },

  /**
   * Delete mentor profile
   */
  delete: async (id: number): Promise<string> => {
    const endpoint = MENTOR_ENDPOINTS.DELETE.replace(':id', id.toString());
    return api.delete_<string>(endpoint);
  },
};
