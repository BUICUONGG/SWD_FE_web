import type { 
  Team,
  TeamMember,
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

const API_BASE = 'http://localhost:8080/api/teams'; // Backend uses /api/teams prefix

class TeamService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Helper to safely parse JSON
  private async safeJsonParse(response: Response): Promise<any> {
    const text = await response.text();
    
    try {
      // Check if response is HTML (error page)
      if (text.trim().startsWith('<')) {
        console.error('Received HTML instead of JSON:', text.substring(0, 200));
        throw new Error('Server returned error page. Check backend status and endpoint.');
      }
      
      return JSON.parse(text);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Server returned error page')) {
        throw error;
      }
      console.error('Invalid JSON response:', error);
      console.error('Response text:', text.substring(0, 500));
      throw new Error('API trả về dữ liệu không hợp lệ');
    }
  }

  // Transform backend TeamResponse to frontend Team format
  private transformTeam(backendTeam: any): Team {
    if (!backendTeam) {
      console.warn('⚠️ [transformTeam] Received null/undefined team');
      return null as any;
    }

    // Transform members from backend format
    const teamMembers: TeamMember[] = (backendTeam.members || [])
      .filter((tm: any) => tm != null)
      .map((tm: any) => ({
        enrollmentId: tm.enrollmentId,
        userId: tm.userId,
        userFullName: tm.userFullName,
        userEmail: tm.userEmail,
        isLeader: tm.isLeader,
        majorName: tm.majorName,
        // Legacy fields for compatibility
        id: tm.enrollmentId,
        fullName: tm.userFullName,
        email: tm.userEmail,
        avatarUrl: undefined, // Backend doesn't provide this
        role: tm.isLeader ? 'LEADER' : 'MEMBER',
        joinedAt: undefined
      }));

    // Find leader (could be from members or from mainIdea owner)
    let leader = teamMembers.find(m => m.isLeader);
    
    // Fallback: If no leader marked in members but mainIdeaId exists,
    // the idea owner might be the leader
    if (!leader && backendTeam.mainIdeaId && backendTeam.ideas?.length > 0) {
      const mainIdea = backendTeam.ideas.find((idea: any) => idea.isMainIdea || idea.ideaId === backendTeam.mainIdeaId);
      if (mainIdea) {
        // Find member who owns the main idea
        leader = teamMembers.find(m => m.userId === mainIdea.ownerId);
        if (leader) {
          console.log('💡 [transformTeam] Inferred leader from main idea owner:', leader.userFullName);
          // Mark as leader for this session
          leader.isLeader = true;
          leader.role = 'LEADER';
        }
      }
    }

    return {
      id: backendTeam.id,
      name: backendTeam.name,
      courseId: backendTeam.courseId,
      courseName: backendTeam.courseName,
      courseCode: backendTeam.courseCode,
      semesterId: backendTeam.semesterId,
      semesterName: backendTeam.semesterName,
      mentorId: backendTeam.mentorId,
      mentorName: backendTeam.mentorName,
      memberCount: backendTeam.memberCount,
      mainIdeaId: backendTeam.mainIdeaId,
      mainIdeaName: backendTeam.mainIdeaName,
      members: teamMembers,
      ideas: backendTeam.ideas,
      // Computed fields for compatibility
      status: 'OPENING', // Backend doesn't provide status yet
      leaderId: leader?.userId,
      leaderName: leader?.userFullName,
      createdAt: undefined,
      updatedAt: undefined
    };
  }

  // POST /api/teams/create - Create new team
  async createTeam(enrollmentId: number, teamName: string): Promise<TeamResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/create?enrollmentId=${enrollmentId}&teamName=${encodeURIComponent(teamName)}`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Không thể tạo nhóm (${response.status})`
        };
      }

      const data = await this.safeJsonParse(response);
      if (data.success && data.data) {
        return { ...data, data: this.transformTeam(data.data) };
      }
      return data;
    } catch (error) {
      console.error('Error creating team:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối khi tạo nhóm'
      };
    }
  }

  // GET /api/teams/{teamId} - Get team details
  async getTeamById(id: number): Promise<TeamResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Không thể lấy thông tin nhóm (${response.status})`
        };
      }

      const data = await this.safeJsonParse(response);
      if (data.success && data.data) {
        return { ...data, data: this.transformTeam(data.data) };
      }
      return data;
    } catch (error) {
      console.error('Error fetching team:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối khi lấy thông tin nhóm'
      };
    }
  }

  // GET /api/teams/my-teams - Get my teams
  async getMyTeams(): Promise<TeamListResponse | ApiErrorResponse> {
    try {
      console.log('🔍 [getMyTeams] Fetching user teams from:', `${API_BASE}/my-teams`);
      console.log('🔍 [getMyTeams] Auth headers:', this.getAuthHeaders());
      
      const response = await fetch(`${API_BASE}/my-teams`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      console.log('📊 [getMyTeams] Response status:', response.status);
      console.log('📊 [getMyTeams] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [getMyTeams] Error response:', errorText);
        return {
          success: false,
          message: `Không thể lấy danh sách nhóm (${response.status}): ${errorText}`
        };
      }

      const data = await this.safeJsonParse(response);
      console.log('✅ [getMyTeams] Success data:', data);
      
      if (data.success && data.data) {
        // Filter out null/undefined teams before transforming
        const validTeams = data.data.filter((team: any) => team != null && typeof team === 'object');
        console.log('📊 [getMyTeams] Valid teams count:', validTeams.length);
        
        const teams = validTeams.map((team: any) => this.transformTeam(team));
        console.log('✅ [getMyTeams] Transformed teams:', teams);
        return { ...data, data: teams };
      }
      return data;
    } catch (error) {
      console.error('❌ [getMyTeams] Exception:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối khi lấy danh sách nhóm của bạn'
      };
    }
  }

  // GET /api/teams/by-enrollment - Get team by enrollment
  async getTeamByEnrollment(enrollmentId: number): Promise<TeamResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/by-enrollment?enrollmentId=${enrollmentId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Không thể lấy thông tin nhóm (${response.status})`
        };
      }

      const data = await this.safeJsonParse(response);
      if (data.success && data.data) {
        return { ...data, data: this.transformTeam(data.data) };
      }
      return data;
    } catch (error) {
      console.error('Error fetching team by enrollment:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối khi lấy thông tin nhóm'
      };
    }
  }

  // GET /team?courseId=X&mentorId=Y - Get teams in course
  async getTeamsByCourse(courseId: number, mentorId: number): Promise<TeamListResponse | ApiErrorResponse> {
    try {
      console.log(`Fetching teams for course ${courseId}, mentor ${mentorId}`);
      const url = `${API_BASE}?courseId=${courseId}&mentorId=${mentorId}`;
      console.log('Request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText.substring(0, 500));
        return {
          success: false,
          message: `Không thể lấy danh sách nhóm (${response.status}): ${errorText.substring(0, 100)}`
        };
      }

      const data = await this.safeJsonParse(response);
      console.log('Teams data received:', data);
      
      if (data.success && data.data) {
        return { ...data, data: data.data.map((team: any) => this.transformTeam(team)) };
      }
      return data;
    } catch (error) {
      console.error('Error fetching teams by course:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối khi lấy danh sách nhóm'
      };
    }
  }

  // PUT /api/teams/{teamId} - Update team name
  async updateTeamName(teamId: number, leaderEnrollmentId: number, teamName: string): Promise<TeamResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${teamId}?leaderEnrollmentId=${leaderEnrollmentId}&teamName=${encodeURIComponent(teamName)}`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Không thể cập nhật tên nhóm (${response.status})`
        };
      }

      const data = await this.safeJsonParse(response);
      if (data.success && data.data) {
        return { ...data, data: this.transformTeam(data.data) };
      }
      return data;
    } catch (error) {
      console.error('Error updating team name:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối khi cập nhật tên nhóm'
      };
    }
  }

  // DELETE /api/teams/{teamId}/members/{enrollmentId} - Remove member
  async removeMember(teamId: number, leaderEnrollmentId: number, enrollmentId: number): Promise<{ success: boolean; message: string } | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${teamId}/members/${enrollmentId}?leaderEnrollmentId=${leaderEnrollmentId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Không thể xóa thành viên (${response.status})`
        };
      }

      const data = await this.safeJsonParse(response);
      return data;
    } catch (error) {
      console.error('Error removing member:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối khi xóa thành viên'
      };
    }
  }

  // POST /api/teams/{teamId}/leave - Leave team
  async leaveTeam(teamId: number, enrollmentId: number): Promise<{ success: boolean; message: string } | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${teamId}/leave?enrollmentId=${enrollmentId}`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Không thể rời khỏi nhóm (${response.status})`
        };
      }

      const data = await this.safeJsonParse(response);
      return data;
    } catch (error) {
      console.error('Error leaving team:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối khi rời khỏi nhóm'
      };
    }
  }

  // DELETE /api/teams/{teamId} - Disband team
  async disbandTeam(teamId: number, leaderEnrollmentId: number): Promise<{ success: boolean; message: string } | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${teamId}?leaderEnrollmentId=${leaderEnrollmentId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Không thể giải tán nhóm (${response.status})`
        };
      }

      const data = await this.safeJsonParse(response);
      return data;
    } catch (error) {
      console.error('Error disbanding team:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối khi giải tán nhóm'
      };
    }
  }

  // PUT /api/teams/{teamId}/select-idea - Select main idea
  async selectMainIdea(teamId: number, leaderEnrollmentId: number, ideaId: number): Promise<TeamResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${teamId}/select-idea?leaderEnrollmentId=${leaderEnrollmentId}&ideaId=${ideaId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Không thể chọn ý tưởng (${response.status})`
        };
      }

      const data = await this.safeJsonParse(response);
      if (data.success && data.data) {
        return { ...data, data: this.transformTeam(data.data) };
      }
      return data;
    } catch (error) {
      console.error('Error selecting main idea:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối khi chọn ý tưởng'
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
