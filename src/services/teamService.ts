import type { 
  TeamResponse,
  TeamListResponse,
  JoinTeamResponse,
  ApiErrorResponse
} from '../types/team';

import { 
  isApiError, 
  isTeamResponse, 
  isTeamListResponse,
  isJoinTeamResponse
} from '../types/team';

const API_BASE = 'http://localhost:8080/api/teams';

class TeamService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get all teams
  async getAllTeams(): Promise<TeamListResponse | ApiErrorResponse> {
    try {
      const response = await fetch(API_BASE, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy danh sách nhóm'
      };
    }
  }

  // Get team by ID
  async getTeamById(id: number): Promise<TeamResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching team:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy thông tin nhóm'
      };
    }
  }

  // Get teams by course
  async getTeamsByCourse(courseId: number): Promise<TeamListResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/course/${courseId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching teams by course:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy danh sách nhóm của lớp'
      };
    }
  }

  // Get teams by user
  async getTeamsByUser(userId: number): Promise<TeamListResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/user/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching teams by user:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy danh sách nhóm của bạn'
      };
    }
  }

  // Join team
  async joinTeam(teamId: number): Promise<JoinTeamResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${teamId}/join`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({})
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error joining team:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi xin tham gia nhóm'
      };
    }
  }

  // Leave team
  async leaveTeam(teamId: number): Promise<{ success: boolean; message: string } | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${teamId}/leave`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error leaving team:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi rời khỏi nhóm'
      };
    }
  }

  // Search teams
  async searchTeams(params: { 
    keyword?: string; 
    courseId?: number; 
    status?: string 
  }): Promise<TeamListResponse | ApiErrorResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.courseId) queryParams.append('courseId', params.courseId.toString());
      if (params.status) queryParams.append('status', params.status);

      const url = `${API_BASE}/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching teams:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi tìm kiếm nhóm'
      };
    }
  }
}

export const teamService = new TeamService();

// Export type guards
export { 
  isApiError, 
  isTeamResponse, 
  isTeamListResponse,
  isJoinTeamResponse
};
