// Major API Service
import type { 
  CreateMajorRequest,
  UpdateMajorRequest,
  MajorSearchParams,
  MajorResponse,
  MajorListResponse,
  DeleteMajorResponse,
  ApiErrorResponse
} from '../types/major';
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

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `HTTP error! status: ${response.status}`,
        errorCode: data.errorCode
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API'
    };
  }
};

/**
 * Major API Service
 */
export const majorService = {
  /**
   * 1. Tạo chuyên ngành mới
   * POST /api/majors
   */
  createMajor: async (majorData: CreateMajorRequest): Promise<MajorResponse | ApiErrorResponse> => {
    const url = getApiUrl('/api/majors');
    return apiCall<MajorResponse>(url, {
      method: 'POST',
      body: JSON.stringify(majorData)
    });
  },

  /**
   * 2. Lấy thông tin chuyên ngành theo ID
   * GET /api/majors/{id}
   */
  getMajorById: async (id: number): Promise<MajorResponse | ApiErrorResponse> => {
    const url = getApiUrl(`/api/majors/${id}`);
    return apiCall<MajorResponse>(url, {
      method: 'GET'
    });
  },

  /**
   * 3. Lấy thông tin chuyên ngành theo mã
   * GET /api/majors/code/{code}
   */
  getMajorByCode: async (code: string): Promise<MajorResponse | ApiErrorResponse> => {
    const url = getApiUrl(`/api/majors/code/${encodeURIComponent(code)}`);
    return apiCall<MajorResponse>(url, {
      method: 'GET'
    });
  },

  /**
   * 4. Lấy danh sách tất cả chuyên ngành
   * GET /api/majors
   */
  getAllMajors: async (): Promise<MajorListResponse | ApiErrorResponse> => {
    const url = getApiUrl('/api/majors');
    return apiCall<MajorListResponse>(url, {
      method: 'GET'
    });
  },

  /**
   * 5. Tìm kiếm chuyên ngành
   * GET /api/majors/search
   */
  searchMajors: async (searchParams: MajorSearchParams): Promise<MajorListResponse | ApiErrorResponse> => {
    const baseUrl = getApiUrl('/api/majors/search');
    const url = new URL(baseUrl);
    
    // Add search parameters to URL
    if (searchParams.keyword) {
      url.searchParams.append('keyword', searchParams.keyword);
    }

    return apiCall<MajorListResponse>(url.toString(), {
      method: 'GET'
    });
  },

  /**
   * 6. Cập nhật chuyên ngành
   * PUT /api/majors/{id}
   */
  updateMajor: async (id: number, majorData: UpdateMajorRequest): Promise<MajorResponse | ApiErrorResponse> => {
    const url = getApiUrl(`/api/majors/${id}`);
    return apiCall<MajorResponse>(url, {
      method: 'PUT',
      body: JSON.stringify(majorData)
    });
  },

  /**
   * 7. Xóa chuyên ngành
   * DELETE /api/majors/{id}
   */
  deleteMajor: async (id: number): Promise<DeleteMajorResponse | ApiErrorResponse> => {
    const url = getApiUrl(`/api/majors/${id}`);
    return apiCall<DeleteMajorResponse>(url, {
      method: 'DELETE'
    });
  }
};

// Export type guards for convenience
export { isMajorResponse, isMajorListResponse, isDeleteMajorResponse, isApiError } from '../types/major';