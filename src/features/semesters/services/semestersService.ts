import api from '../../../shared/services/api';
import { SEMESTER_ENDPOINTS } from '../constants/semesterEndpoints';
import type { SemesterResponse, SemesterRequest } from '../types';

/**
 * Semester Management Service
 * Handles all semester-related API calls
 */
export const semesterService = {
  /**
   * Create new semester
   */
  create: async (data: SemesterRequest): Promise<SemesterResponse> => {
    return api.post<SemesterResponse>(SEMESTER_ENDPOINTS.CREATE, data);
  },

  /**
   * Get semester by ID
   */
  getById: async (id: number): Promise<SemesterResponse> => {
    const endpoint = SEMESTER_ENDPOINTS.GET_BY_ID.replace(':id', id.toString());
    return api.get<SemesterResponse>(endpoint);
  },

  /**
   * Get semester by code
   */
  getByCode: async (code: string): Promise<SemesterResponse> => {
    const endpoint = SEMESTER_ENDPOINTS.GET_BY_CODE.replace(':code', code);
    return api.get<SemesterResponse>(endpoint);
  },

  /**
   * Get all semesters
   */
  getAll: async (): Promise<SemesterResponse[]> => {
    return api.get<SemesterResponse[]>(SEMESTER_ENDPOINTS.GET_ALL);
  },

  /**
   * Update semester
   */
  update: async (id: number, data: SemesterRequest): Promise<SemesterResponse> => {
    const endpoint = SEMESTER_ENDPOINTS.UPDATE.replace(':id', id.toString());
    return api.patch<SemesterResponse>(endpoint, data);
  },

  /**
   * Delete semester
   */
  delete: async (id: number): Promise<string> => {
    const endpoint = SEMESTER_ENDPOINTS.DELETE.replace(':id', id.toString());
    return api.delete_<string>(endpoint);
  },
};
