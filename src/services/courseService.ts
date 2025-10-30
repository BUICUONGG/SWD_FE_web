// Course API Service
import type { 
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseSearchParams,
  CourseResponse,
  CourseListResponse,
  ApiErrorResponse
} from '../types/course';
import { getApiUrl } from '../utils/config';

/**
 * Generic API call handler
 */
const apiCall = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T | ApiErrorResponse> => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    let data;
    try {
      data = await response.json();
    } catch {
      return {
        success: false,
        message: `Server returned invalid JSON (Status: ${response.status})`,
        errorCode: 'INVALID_JSON',
      } as ApiErrorResponse;
    }

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `HTTP ${response.status}: ${response.statusText}`,
        errorCode: data.errorCode || response.status.toString(),
      } as ApiErrorResponse;
    }

    return data as T;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Không thể kết nối đến server',
      errorCode: 'NETWORK_ERROR',
    } as ApiErrorResponse;
  }
};

/**
 * Course Service
 */
export const courseService = {
  /**
   * Tạo khóa học mới
   */
  createCourse: async (courseData: CreateCourseRequest): Promise<CourseResponse | ApiErrorResponse> => {
    return apiCall<CourseResponse>(getApiUrl('/api/courses'), {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  /**
   * Lấy thông tin khóa học theo ID
   */
  getCourseById: async (id: number): Promise<CourseResponse | ApiErrorResponse> => {
    return apiCall<CourseResponse>(getApiUrl(`/api/courses/${id}`));
  },

  /**
   * Lấy thông tin khóa học theo mã
   */
  getCourseByCode: async (code: string): Promise<CourseResponse | ApiErrorResponse> => {
    return apiCall<CourseResponse>(getApiUrl(`/api/courses/code/${code}`));
  },

  /**
   * Lấy danh sách tất cả khóa học
   */
  getAllCourses: async (): Promise<CourseListResponse | ApiErrorResponse> => {
    return apiCall<CourseListResponse>(getApiUrl('/api/courses'));
  },

  /**
   * Tìm kiếm khóa học với nhiều tiêu chí
   */
  searchCourses: async (params: CourseSearchParams): Promise<CourseListResponse | ApiErrorResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.status) searchParams.append('status', params.status);
    if (params.semesterId) searchParams.append('semesterId', params.semesterId.toString());
    if (params.mentorId) searchParams.append('mentorId', params.mentorId.toString());
    if (params.subjectId) searchParams.append('subjectId', params.subjectId.toString());

    const url = getApiUrl(`/api/courses/search${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
    return apiCall<CourseListResponse>(url);
  },

  /**
   * Lấy khóa học theo trạng thái
   */
  getCoursesByStatus: async (status: string): Promise<CourseListResponse | ApiErrorResponse> => {
    return apiCall<CourseListResponse>(getApiUrl(`/api/courses/status/${status}`));
  },

  /**
   * Lấy khóa học theo kỳ học
   */
  getCoursesBySemester: async (semesterId: number): Promise<CourseListResponse | ApiErrorResponse> => {
    return apiCall<CourseListResponse>(getApiUrl(`/api/courses/semester/${semesterId}`));
  },

  /**
   * Lấy khóa học theo mentor
   */
  getCoursesByMentor: async (mentorId: number): Promise<CourseListResponse | ApiErrorResponse> => {
    return apiCall<CourseListResponse>(getApiUrl(`/api/courses/mentor/${mentorId}`));
  },

  /**
   * Cập nhật khóa học
   */
  updateCourse: async (id: number, courseData: UpdateCourseRequest): Promise<CourseResponse | ApiErrorResponse> => {
    return apiCall<CourseResponse>(getApiUrl(`/api/courses/${id}`), {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  /**
   * Xóa khóa học
   */
  deleteCourse: async (id: number): Promise<{ success: boolean; message: string } | ApiErrorResponse> => {
    return apiCall<{ success: boolean; message: string }>(getApiUrl(`/api/courses/${id}`), {
      method: 'DELETE',
    });
  },
};

/**
 * API Response type guards
 */
export const isApiError = (response: unknown): response is ApiErrorResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'success' in response && 
         (response as ApiErrorResponse).success === false;
};

export const isCourseResponse = (response: unknown): response is CourseResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'success' in response && 
         (response as CourseResponse).success === true &&
         'data' in response &&
         typeof (response as CourseResponse).data === 'object';
};

export const isCourseListResponse = (response: unknown): response is CourseListResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'success' in response && 
         (response as CourseListResponse).success === true &&
         'data' in response &&
         Array.isArray((response as CourseListResponse).data);
};