import * as api from '../../../shared/services/api';
import { COURSES_ENDPOINTS } from '../constants/courseEndpoints';
import type { CourseResponse, CourseRequest, CourseSearchFilters } from '../types';

/**
 * Courses Service
 * Tất cả API calls liên quan đến Courses
 */
export const coursesService = {
  /**
   * Create new course
   */
  create: async (payload: CourseRequest): Promise<CourseResponse> => {
    return api.post<CourseResponse>(COURSES_ENDPOINTS.CREATE, payload);
  },

  /**
   * Get all courses
   */
  getAll: async (): Promise<CourseResponse[]> => {
    return api.get<CourseResponse[]>(COURSES_ENDPOINTS.LIST);
  },

  /**
   * Get course by ID
   */
  getById: async (id: number | string): Promise<CourseResponse> => {
    return api.get<CourseResponse>(COURSES_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Get course by code
   */
  getByCode: async (code: string): Promise<CourseResponse> => {
    return api.get<CourseResponse>(COURSES_ENDPOINTS.GET_BY_CODE(code));
  },

  /**
   * Get courses by status
   */
  getByStatus: async (status: string): Promise<CourseResponse[]> => {
    return api.get<CourseResponse[]>(COURSES_ENDPOINTS.GET_BY_STATUS(status));
  },

  /**
   * Get courses by semester
   */
  getBySemester: async (semesterId: number | string): Promise<CourseResponse[]> => {
    return api.get<CourseResponse[]>(COURSES_ENDPOINTS.GET_BY_SEMESTER(semesterId));
  },

  /**
   * Get courses by mentor
   */
  getByMentor: async (mentorId: number | string): Promise<CourseResponse[]> => {
    return api.get<CourseResponse[]>(COURSES_ENDPOINTS.GET_BY_MENTOR(mentorId));
  },

  /**
   * Search courses with filters
   */
  search: async (filters: CourseSearchFilters): Promise<CourseResponse[]> => {
    const params = new URLSearchParams();
    
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.status) params.append('status', filters.status);
    if (filters.semesterId) params.append('semesterId', filters.semesterId.toString());
    if (filters.mentorId) params.append('mentorId', filters.mentorId.toString());
    if (filters.subjectId) params.append('subjectId', filters.subjectId.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `${COURSES_ENDPOINTS.SEARCH}?${queryString}` : COURSES_ENDPOINTS.SEARCH;
    
    return api.get<CourseResponse[]>(endpoint);
  },

  /**
   * Update course
   */
  update: async (id: number | string, payload: CourseRequest): Promise<CourseResponse> => {
    return api.put<CourseResponse>(COURSES_ENDPOINTS.UPDATE(id), payload);
  },

  /**
   * Delete course
   */
  delete: async (id: number | string): Promise<void> => {
    return api.delete_(COURSES_ENDPOINTS.DELETE(id));
  },
};

export default coursesService;
