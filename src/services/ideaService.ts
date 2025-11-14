// Idea API Service
import type { 
  CreateIdeaRequest,
  UpdateIdeaRequest,
  IdeaResponse,
  IdeaListResponse,
  ApiErrorResponse
} from '../types/idea';
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
 * Idea Service
 */
export const ideaService = {
  /**
   * Tạo idea mới
   */
  createIdea: async (ideaData: CreateIdeaRequest): Promise<IdeaResponse | ApiErrorResponse> => {
    const { enrollmentId, name, description } = ideaData;
    const params = new URLSearchParams({
      enrollmentId: enrollmentId.toString(),
      name,
      description,
    });
    
    return apiCall<IdeaResponse>(getApiUrl(`/api/ideas/create?${params.toString()}`), {
      method: 'POST',
    });
  },

  /**
   * Xem chi tiết idea
   */
  getIdeaById: async (ideaId: number): Promise<IdeaResponse | ApiErrorResponse> => {
    return apiCall<IdeaResponse>(getApiUrl(`/api/ideas/${ideaId}`));
  },

  /**
   * Xem ideas của tôi
   */
  getMyIdeas: async (enrollmentId: number): Promise<IdeaListResponse | ApiErrorResponse> => {
    return apiCall<IdeaListResponse>(getApiUrl(`/api/ideas/my-ideas?enrollmentId=${enrollmentId}`));
  },

  /**
   * Xem tất cả ideas của team
   */
  getTeamIdeas: async (teamId: number): Promise<IdeaListResponse | ApiErrorResponse> => {
    return apiCall<IdeaListResponse>(getApiUrl(`/api/ideas/team/${teamId}`));
  },

  /**
   * Cập nhật idea
   */
  updateIdea: async (ideaId: number, ideaData: UpdateIdeaRequest): Promise<IdeaResponse | ApiErrorResponse> => {
    const { enrollmentId, name, description } = ideaData;
    const params = new URLSearchParams({
      enrollmentId: enrollmentId.toString(),
      name,
      description,
    });
    
    return apiCall<IdeaResponse>(getApiUrl(`/api/ideas/${ideaId}?${params.toString()}`), {
      method: 'PUT',
    });
  },

  /**
   * Xóa idea
   */
  deleteIdea: async (ideaId: number, enrollmentId: number): Promise<{ success: boolean; message: string } | ApiErrorResponse> => {
    return apiCall<{ success: boolean; message: string }>(
      getApiUrl(`/api/ideas/${ideaId}?enrollmentId=${enrollmentId}`),
      {
        method: 'DELETE',
      }
    );
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

export const isIdeaResponse = (response: unknown): response is IdeaResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'success' in response && 
         (response as IdeaResponse).success === true &&
         'data' in response &&
         typeof (response as IdeaResponse).data === 'object';
};

export const isIdeaListResponse = (response: unknown): response is IdeaListResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'success' in response && 
         (response as IdeaListResponse).success === true &&
         'data' in response &&
         Array.isArray((response as IdeaListResponse).data);
};
