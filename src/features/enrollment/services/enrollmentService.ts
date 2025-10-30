import * as api from '../../../shared/services/api';
import { ENROLLMENT_ENDPOINTS } from '../constants/enrollmentEndpoints';
import type { EnrollmentResponse, EnrollmentRequest, EnrollmentSearchFilters } from '../types';

/**
 * Enrollment Service
 * Tất cả API calls liên quan đến Enrollment
 */
export const enrollmentService = {
  /**
   * Enroll a student in a course
   */
  enroll: async (payload: EnrollmentRequest): Promise<EnrollmentResponse> => {
    return api.post<EnrollmentResponse>(ENROLLMENT_ENDPOINTS.ENROLL, payload);
  },

  /**
   * Get enrollment by ID
   */
  getById: async (id: number | string): Promise<EnrollmentResponse> => {
    return api.get<EnrollmentResponse>(ENROLLMENT_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Get enrollments by user
   */
  getByUser: async (userId: number | string): Promise<EnrollmentResponse[]> => {
    return api.get<EnrollmentResponse[]>(ENROLLMENT_ENDPOINTS.GET_BY_USER(userId));
  },

  /**
   * Get enrollments by course
   */
  getByCourse: async (courseId: number | string): Promise<EnrollmentResponse[]> => {
    return api.get<EnrollmentResponse[]>(ENROLLMENT_ENDPOINTS.GET_BY_COURSE(courseId));
  },

  /**
   * Search enrollments with filters
   */
  search: async (filters: EnrollmentSearchFilters): Promise<EnrollmentResponse[]> => {
    const params = new URLSearchParams();
    
    if (filters.userId) params.append('userId', filters.userId.toString());
    if (filters.courseId) params.append('courseId', filters.courseId.toString());

    const queryString = params.toString();
    const endpoint = queryString 
      ? `${ENROLLMENT_ENDPOINTS.SEARCH}?${queryString}` 
      : ENROLLMENT_ENDPOINTS.SEARCH;
    
    return api.get<EnrollmentResponse[]>(endpoint);
  },

  /**
   * Approve enrollment
   */
  approve: async (id: number | string, approvedBy: number): Promise<EnrollmentResponse> => {
    return api.patch<EnrollmentResponse>(
      `${ENROLLMENT_ENDPOINTS.APPROVE(id)}?approvedBy=${approvedBy}`
    );
  },

  /**
   * Complete enrollment
   */
  complete: async (id: number | string): Promise<EnrollmentResponse> => {
    return api.patch<EnrollmentResponse>(ENROLLMENT_ENDPOINTS.COMPLETE(id));
  },

  /**
   * Delete enrollment
   */
  delete: async (id: number | string): Promise<void> => {
    return api.delete_(ENROLLMENT_ENDPOINTS.DELETE(id));
  },
};

export default enrollmentService;
