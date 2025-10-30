// Enrollment API Service
import type { 
  CreateEnrollmentRequest,
  EnrollmentSearchParams,
  EnrollmentResponse,
  EnrollmentListResponse,
  ApiErrorResponse
} from '../types/enrollment';
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
 * Enrollment Service
 */
export const enrollmentService = {
  /**
   * Đăng ký khóa học
   */
  createEnrollment: async (enrollmentData: CreateEnrollmentRequest): Promise<EnrollmentResponse | ApiErrorResponse> => {
    return apiCall<EnrollmentResponse>(getApiUrl('/api/enrollments'), {
      method: 'POST',
      body: JSON.stringify(enrollmentData),
    });
  },

  /**
   * Lấy thông tin đăng ký theo ID
   */
  getEnrollmentById: async (id: number): Promise<EnrollmentResponse | ApiErrorResponse> => {
    return apiCall<EnrollmentResponse>(getApiUrl(`/api/enrollments/${id}`));
  },

  /**
   * Lấy danh sách đăng ký theo người dùng
   */
  getEnrollmentsByUser: async (userId: number): Promise<EnrollmentListResponse | ApiErrorResponse> => {
    return apiCall<EnrollmentListResponse>(getApiUrl(`/api/enrollments/user/${userId}`));
  },

  /**
   * Lấy danh sách đăng ký theo khóa học
   */
  getEnrollmentsByCourse: async (courseId: number): Promise<EnrollmentListResponse | ApiErrorResponse> => {
    return apiCall<EnrollmentListResponse>(getApiUrl(`/api/enrollments/course/${courseId}`));
  },

  /**
   * Tìm kiếm đăng ký
   */
  searchEnrollments: async (params: EnrollmentSearchParams): Promise<EnrollmentListResponse | ApiErrorResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.userId) searchParams.append('userId', params.userId.toString());
    if (params.courseId) searchParams.append('courseId', params.courseId.toString());

    const url = getApiUrl(`/api/enrollments/search${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
    return apiCall<EnrollmentListResponse>(url);
  },

  /**
   * Phê duyệt đăng ký
   */
  approveEnrollment: async (id: number, approvedBy: number): Promise<EnrollmentResponse | ApiErrorResponse> => {
    return apiCall<EnrollmentResponse>(getApiUrl(`/api/enrollments/${id}/approve?approvedBy=${approvedBy}`), {
      method: 'PATCH',
    });
  },

  /**
   * Hoàn thành đăng ký
   */
  completeEnrollment: async (id: number): Promise<EnrollmentResponse | ApiErrorResponse> => {
    return apiCall<EnrollmentResponse>(getApiUrl(`/api/enrollments/${id}/complete`), {
      method: 'PATCH',
    });
  },

  /**
   * Hủy đăng ký
   */
  cancelEnrollment: async (id: number): Promise<{ success: boolean; message: string } | ApiErrorResponse> => {
    return apiCall<{ success: boolean; message: string }>(getApiUrl(`/api/enrollments/${id}`), {
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

export const isEnrollmentResponse = (response: unknown): response is EnrollmentResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'success' in response && 
         (response as EnrollmentResponse).success === true &&
         'data' in response &&
         typeof (response as EnrollmentResponse).data === 'object';
};

export const isEnrollmentListResponse = (response: unknown): response is EnrollmentListResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'success' in response && 
         (response as EnrollmentListResponse).success === true &&
         'data' in response &&
         Array.isArray((response as EnrollmentListResponse).data);
};