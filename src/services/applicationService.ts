// Application API Service
import type { 
  ApplicationResponse,
  ApplicationListResponse,
  ApiErrorResponse
} from '../types/application';
import { getApiUrl } from '../utils/config';

/**
 * Generic API call handler
 */
const apiCall = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T | ApiErrorResponse> => {
  try {
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
 * Application Service
 */
export const applicationService = {
  /**
   * Apply vào team
   */
  applyToTeam: async (enrollmentId: number, teamId: number): Promise<ApplicationResponse | ApiErrorResponse> => {
    const params = new URLSearchParams({
      enrollmentId: enrollmentId.toString(),
      teamId: teamId.toString(),
    });
    
    return apiCall<ApplicationResponse>(getApiUrl(`/api/applications/apply?${params.toString()}`), {
      method: 'POST',
    });
  },

  /**
   * Mời sinh viên vào team (Leader only)
   */
  inviteToTeam: async (leaderEnrollmentId: number, targetEnrollmentId: number): Promise<ApplicationResponse | ApiErrorResponse> => {
    const params = new URLSearchParams({
      leaderEnrollmentId: leaderEnrollmentId.toString(),
      targetEnrollmentId: targetEnrollmentId.toString(),
    });
    
    return apiCall<ApplicationResponse>(getApiUrl(`/api/applications/invite?${params.toString()}`), {
      method: 'POST',
    });
  },

  /**
   * Xử lý application (Accept/Reject)
   */
  handleApplication: async (
    applicationId: number, 
    leaderEnrollmentId: number, 
    accepted: boolean
  ): Promise<ApplicationResponse | ApiErrorResponse> => {
    const params = new URLSearchParams({
      leaderEnrollmentId: leaderEnrollmentId.toString(),
      accepted: accepted.toString(),
    });
    
    return apiCall<ApplicationResponse>(
      getApiUrl(`/api/applications/${applicationId}/handle?${params.toString()}`),
      {
        method: 'PUT',
      }
    );
  },

  /**
   * Xem applications của tôi (sent và received)
   */
  getMyApplications: async (enrollmentId: number): Promise<ApplicationListResponse | ApiErrorResponse> => {
    return apiCall<ApplicationListResponse>(
      getApiUrl(`/api/applications/my-applications?enrollmentId=${enrollmentId}`)
    );
  },

  /**
   * Xem applications của team (Leader only)
   */
  getTeamApplications: async (teamId: number, leaderEnrollmentId: number): Promise<ApplicationListResponse | ApiErrorResponse> => {
    return apiCall<ApplicationListResponse>(
      getApiUrl(`/api/applications/team/${teamId}?leaderEnrollmentId=${leaderEnrollmentId}`)
    );
  },

  /**
   * Hủy application
   */
  cancelApplication: async (applicationId: number, enrollmentId: number): Promise<{ success: boolean; message: string } | ApiErrorResponse> => {
    return apiCall<{ success: boolean; message: string }>(
      getApiUrl(`/api/applications/${applicationId}?enrollmentId=${enrollmentId}`),
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

export const isApplicationResponse = (response: unknown): response is ApplicationResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'success' in response && 
         (response as ApplicationResponse).success === true &&
         'data' in response &&
         typeof (response as ApplicationResponse).data === 'object';
};

export const isApplicationListResponse = (response: unknown): response is ApplicationListResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'success' in response && 
         (response as ApplicationListResponse).success === true &&
         'data' in response &&
         Array.isArray((response as ApplicationListResponse).data);
};
