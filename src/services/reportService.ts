import type { 
  DashboardData,
  StudentReport,
  MentorPerformance,
  CourseStatistics,
  TeamStatistics,
  EnrollmentStatistics,
  ReportResponse,
  ApiErrorResponse
} from '../types/report';

import { 
  isApiError,
  isDashboardResponse,
  isStudentReportResponse,
  isMentorPerformanceResponse,
  isCourseStatisticsResponse,
  isTeamStatisticsResponse,
  isEnrollmentStatisticsResponse
} from '../types/report';

const API_BASE = 'http://localhost:8080/api/reports';

class ReportService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get dashboard overview
  async getDashboard(): Promise<ReportResponse<DashboardData> | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/dashboard`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        console.warn(`API /dashboard returned status ${response.status}`);
        return {
          success: false,
          message: `API endpoint not available (${response.status})`
        };
      }

      const result = await response.json();
      // Backend returns StandardResponse { success, message, data }
      if (result.success && result.data) {
        return result as ReportResponse<DashboardData>;
      }
      
      return {
        success: false,
        message: result.message || 'Failed to fetch dashboard data'
      };
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy dữ liệu dashboard'
      };
    }
  }

  // Get students by semester
  async getStudentsBySemester(semesterId: number): Promise<ReportResponse<StudentReport> | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/students/by-semester/${semesterId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          message: `API endpoint not available (${response.status})`
        };
      }

      const result = await response.json();
      if (result.success && result.data) {
        return result as ReportResponse<StudentReport>;
      }
      
      return {
        success: false,
        message: result.message || 'Failed to fetch students by semester'
      };
    } catch (error) {
      console.error('Error fetching students by semester:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy báo cáo sinh viên theo học kỳ'
      };
    }
  }

  // Get students by mentor
  async getStudentsByMentor(mentorId: number, semesterId?: number): Promise<ReportResponse<StudentReport> | ApiErrorResponse> {
    try {
      const url = semesterId 
        ? `${API_BASE}/students/by-mentor/${mentorId}?semesterId=${semesterId}`
        : `${API_BASE}/students/by-mentor/${mentorId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          message: `API endpoint not available (${response.status})`
        };
      }

      const result = await response.json();
      if (result.success && result.data) {
        return result as ReportResponse<StudentReport>;
      }
      
      return {
        success: false,
        message: result.message || 'Failed to fetch students by mentor'
      };
    } catch (error) {
      console.error('Error fetching students by mentor:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy báo cáo sinh viên theo mentor'
      };
    }
  }

  // Get students by major
  async getStudentsByMajor(majorId: number, semesterId?: number): Promise<ReportResponse<StudentReport> | ApiErrorResponse> {
    try {
      const url = semesterId 
        ? `${API_BASE}/students/by-major/${majorId}?semesterId=${semesterId}`
        : `${API_BASE}/students/by-major/${majorId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching students by major:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy báo cáo sinh viên theo chuyên ngành'
      };
    }
  }

  // Get mentor performance
  async getMentorPerformance(semesterId?: number): Promise<ReportResponse<MentorPerformance[]> | ApiErrorResponse> {
    try {
      const url = semesterId 
        ? `${API_BASE}/mentors/performance?semesterId=${semesterId}`
        : `${API_BASE}/mentors/performance`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          message: `API endpoint not available (${response.status})`
        };
      }

      const result = await response.json();
      if (result.success && result.data) {
        return result as ReportResponse<MentorPerformance[]>;
      }
      
      return {
        success: false,
        message: result.message || 'Failed to fetch mentor performance'
      };
    } catch (error) {
      console.error('Error fetching mentor performance:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy báo cáo hiệu suất mentor'
      };
    }
  }

  // Get course statistics
  async getCourseStatistics(semesterId?: number): Promise<ReportResponse<CourseStatistics> | ApiErrorResponse> {
    try {
      const url = semesterId 
        ? `${API_BASE}/courses/statistics?semesterId=${semesterId}`
        : `${API_BASE}/courses/statistics`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching course statistics:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy thống kê khóa học'
      };
    }
  }

  // Get team statistics
  async getTeamStatistics(semesterId?: number, courseId?: number): Promise<ReportResponse<TeamStatistics> | ApiErrorResponse> {
    try {
      const params = new URLSearchParams();
      if (semesterId) params.append('semesterId', semesterId.toString());
      if (courseId) params.append('courseId', courseId.toString());

      const url = params.toString() 
        ? `${API_BASE}/teams/statistics?${params.toString()}`
        : `${API_BASE}/teams/statistics`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching team statistics:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy thống kê nhóm'
      };
    }
  }

  // Get enrollment statistics
  async getEnrollmentStatistics(semesterId?: number, majorId?: number): Promise<ReportResponse<EnrollmentStatistics> | ApiErrorResponse> {
    try {
      const params = new URLSearchParams();
      if (semesterId) params.append('semesterId', semesterId.toString());
      if (majorId) params.append('majorId', majorId.toString());

      const url = params.toString() 
        ? `${API_BASE}/enrollments/statistics?${params.toString()}`
        : `${API_BASE}/enrollments/statistics`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching enrollment statistics:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy thống kê đăng ký'
      };
    }
  }
}

export const reportService = new ReportService();

// Export type guards
export { 
  isApiError,
  isDashboardResponse,
  isStudentReportResponse,
  isMentorPerformanceResponse,
  isCourseStatisticsResponse,
  isTeamStatisticsResponse,
  isEnrollmentStatisticsResponse
};
