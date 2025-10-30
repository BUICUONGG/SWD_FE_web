// Subject API Service
import { API_CONFIG, getApiUrl } from '../utils/config';

export interface Subject {
  id: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
  department?: string;
  prerequisites?: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectRequest {
  code: string;
  name: string;
  description?: string;
  credits: number;
  department?: string;
  prerequisites?: string[];
}

export interface UpdateSubjectRequest {
  code?: string;
  name?: string;
  description?: string;
  credits?: number;
  department?: string;
  prerequisites?: string[];
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface SubjectSearchParams {
  keyword?: string;
  department?: string;
  credits?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  page?: number;
  size?: number;
}

export interface SubjectListResponse {
  status: 'SUCCESS' | 'ERROR';
  message: string;
  data: Subject[];
}

export interface SubjectResponse {
  status: 'SUCCESS' | 'ERROR';
  message: string;
  data: Subject;
}

export interface ApiErrorResponse {
  status: 'ERROR';
  message: string;
  errorCode?: string;
}

/**
 * Generic API call handler với authentication
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
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return {
        status: 'ERROR' as const,
        message: 'Lỗi phân tích phản hồi từ server',
      };
    }

    if (!response.ok) {
      return {
        status: 'ERROR' as const,
        message: data.message || `HTTP Error: ${response.status}`,
        errorCode: data.errorCode,
      };
    }

    // Handle new API response format
    if (data.status === 'ERROR') {
      return {
        status: 'ERROR' as const,
        message: data.message || 'Unknown error',
        errorCode: data.errorCode,
      };
    }

    return data as T;
  } catch (error) {
    console.error('API Error:', error);
    return {
      status: 'ERROR' as const,
      message: error instanceof Error ? error.message : 'Lỗi kết nối mạng',
    };
  }
};

/**
 * Subject Service - Xử lý các API liên quan đến môn học
 */
export const subjectService = {
  
  // ========== READ OPERATIONS ==========
  
  /**
   * Lấy tất cả môn học
   */
  getAllSubjects: async (): Promise<SubjectListResponse | ApiErrorResponse> => {
    return apiCall<SubjectListResponse>(getApiUrl(API_CONFIG.SUBJECTS.LIST));
  },

  /**
   * Lấy môn học theo ID
   */
  getSubjectById: async (id: string): Promise<SubjectResponse | ApiErrorResponse> => {
    return apiCall<SubjectResponse>(getApiUrl(`${API_CONFIG.SUBJECTS.BY_ID}/${id}`));
  },

  /**
   * Lấy môn học theo code
   */
  getSubjectByCode: async (code: string): Promise<SubjectResponse | ApiErrorResponse> => {
    return apiCall<SubjectResponse>(getApiUrl(`${API_CONFIG.SUBJECTS.BY_CODE}/${code}`));
  },

  /**
   * Tìm kiếm môn học
   */
  searchSubjects: async (params: SubjectSearchParams): Promise<SubjectListResponse | ApiErrorResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.department) searchParams.append('department', params.department);
    if (params.credits !== undefined) searchParams.append('credits', params.credits.toString());
    if (params.status) searchParams.append('status', params.status);
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    const url = `${getApiUrl(API_CONFIG.SUBJECTS.SEARCH)}?${searchParams.toString()}`;
    return apiCall<SubjectListResponse>(url);
  },

  /**
   * Lấy môn học theo khoa/phòng ban
   */
  getSubjectsByDepartment: async (department: string): Promise<SubjectListResponse | ApiErrorResponse> => {
    return subjectService.searchSubjects({ department });
  },

  /**
   * Lấy môn học theo số tín chỉ
   */
  getSubjectsByCredits: async (credits: number): Promise<SubjectListResponse | ApiErrorResponse> => {
    return subjectService.searchSubjects({ credits });
  },

  // ========== ADMIN OPERATIONS ==========
  
  /**
   * Tạo môn học mới (Admin only)
   */
  createSubject: async (subjectData: CreateSubjectRequest): Promise<SubjectResponse | ApiErrorResponse> => {
    return apiCall<SubjectResponse>(getApiUrl(API_CONFIG.SUBJECTS.CREATE), {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  },

  /**
   * Cập nhật môn học (Admin only)
   */
  updateSubject: async (id: string, subjectData: UpdateSubjectRequest): Promise<SubjectResponse | ApiErrorResponse> => {
    return apiCall<SubjectResponse>(getApiUrl(`${API_CONFIG.SUBJECTS.UPDATE}/${id}`), {
      method: 'PUT',  
      body: JSON.stringify(subjectData),
    });
  },

  /**
   * Xóa môn học (Admin only)
   */
  deleteSubject: async (id: string): Promise<{status: 'SUCCESS' | 'ERROR'; message: string} | ApiErrorResponse> => {
    return apiCall<{status: 'SUCCESS' | 'ERROR'; message: string}>(
      getApiUrl(`${API_CONFIG.SUBJECTS.DELETE}/${id}`), 
      {
        method: 'DELETE',
      }
    );
  },

  // ========== UTILITY FUNCTIONS ==========
  
  /**
   * Kiểm tra xem môn học có đang hoạt động không
   */
  isActiveSubject: (subject: Subject): boolean => {
    return subject.status === 'ACTIVE';
  },

  /**
   * Lấy danh sách môn học đang hoạt động
   */
  getActiveSubjects: async (): Promise<SubjectListResponse | ApiErrorResponse> => {
    const response = await subjectService.getAllSubjects();
    
    if (isApiError(response)) {
      return response;
    }

    const activeSubjects = response.data.filter(subject => subject.status === 'ACTIVE');
    
    return {
      status: 'SUCCESS' as const,
      message: 'Lấy danh sách môn học đang hoạt động thành công',
      data: activeSubjects,
    };
  },

  /**
   * Kiểm tra prerequisites của môn học
   */
  checkPrerequisites: (subject: Subject, completedSubjects: string[] = []): boolean => {
    if (!subject.prerequisites || subject.prerequisites.length === 0) {
      return true;
    }
    
    return subject.prerequisites.every(prereq => completedSubjects.includes(prereq));
  },
};

/**
 * Type guards
 */
export const isApiError = (response: unknown): response is ApiErrorResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'status' in response && 
         (response as any).status === 'ERROR';
};

export const isSubjectResponse = (response: unknown): response is SubjectResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'status' in response && 
         'data' in response &&
         (response as any).status === 'SUCCESS' &&
         typeof (response as any).data === 'object';
};

export const isSubjectListResponse = (response: unknown): response is SubjectListResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'status' in response && 
         'data' in response &&
         (response as any).status === 'SUCCESS' &&
         Array.isArray((response as any).data);
};

export default subjectService;