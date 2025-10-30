// Mentor Profile API Service
import type { 
  CreateMentorProfileRequest,
  UpdateMentorProfileRequest,
  MentorProfileSearchParams,
  MentorProfileResponse,
  MentorProfileListResponse,
  DeleteMentorProfileResponse,
  ApiErrorResponse
} from '../types/mentorProfile';
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
 * Mentor Profile API Service
 */
export const mentorProfileService = {
  /**
   * 1. Tạo hồ sơ giảng viên mới
   * POST /api/mentor-profiles
   */
  createMentorProfile: async (profileData: CreateMentorProfileRequest): Promise<MentorProfileResponse | ApiErrorResponse> => {
    const url = getApiUrl('/api/mentor-profiles');
    return apiCall<MentorProfileResponse>(url, {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
  },

  /**
   * 2. Lấy thông tin hồ sơ giảng viên theo ID
   * GET /api/mentor-profiles/{id}
   */
  getMentorProfileById: async (id: number): Promise<MentorProfileResponse | ApiErrorResponse> => {
    const url = getApiUrl(`/api/mentor-profiles/${id}`);
    return apiCall<MentorProfileResponse>(url, {
      method: 'GET'
    });
  },

  /**
   * 3. Lấy hồ sơ giảng viên theo User ID
   * GET /api/mentor-profiles/user/{userId}
   */
  getMentorProfileByUserId: async (userId: number): Promise<MentorProfileResponse | ApiErrorResponse> => {
    const url = getApiUrl(`/api/mentor-profiles/user/${userId}`);
    return apiCall<MentorProfileResponse>(url, {
      method: 'GET'
    });
  },

  /**
   * 4. Lấy danh sách tất cả hồ sơ giảng viên
   * GET /api/mentor-profiles
   */
  getAllMentorProfiles: async (): Promise<MentorProfileListResponse | ApiErrorResponse> => {
    const url = getApiUrl('/api/mentor-profiles');
    return apiCall<MentorProfileListResponse>(url, {
      method: 'GET'
    });
  },

  /**
   * 5. Tìm kiếm hồ sơ giảng viên
   * GET /api/mentor-profiles/search
   */
  searchMentorProfiles: async (searchParams: MentorProfileSearchParams): Promise<MentorProfileListResponse | ApiErrorResponse> => {
    const baseUrl = getApiUrl('/api/mentor-profiles/search');
    const url = new URL(baseUrl);
    
    // Add search parameters to URL
    if (searchParams.keyword) {
      url.searchParams.append('keyword', searchParams.keyword);
    }

    return apiCall<MentorProfileListResponse>(url.toString(), {
      method: 'GET'
    });
  },

  /**
   * 6. Cập nhật hồ sơ giảng viên
   * PUT /api/mentor-profiles/{id}
   */
  updateMentorProfile: async (id: number, profileData: UpdateMentorProfileRequest): Promise<MentorProfileResponse | ApiErrorResponse> => {
    const url = getApiUrl(`/api/mentor-profiles/${id}`);
    return apiCall<MentorProfileResponse>(url, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  /**
   * 7. Xóa hồ sơ giảng viên
   * DELETE /api/mentor-profiles/{id}
   */
  deleteMentorProfile: async (id: number): Promise<DeleteMentorProfileResponse | ApiErrorResponse> => {
    const url = getApiUrl(`/api/mentor-profiles/${id}`);
    return apiCall<DeleteMentorProfileResponse>(url, {
      method: 'DELETE'
    });
  }
};

// Export type guards for convenience
export { isMentorProfileResponse, isMentorProfileListResponse, isDeleteMentorProfileResponse, isApiError } from '../types/mentorProfile';