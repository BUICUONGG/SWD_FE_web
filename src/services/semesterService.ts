import type { 
  CreateSemesterRequest,
  UpdateSemesterRequest,
  SemesterSearchParams,
  SemesterResponse,
  SemesterListResponse,
  DeleteSemesterResponse,
  ApiErrorResponse
} from '../types/semester';

import { 
  isApiError, 
  isSemesterResponse, 
  isSemesterListResponse, 
  isDeleteSemesterResponse 
} from '../types/semester';

const API_BASE = 'http://localhost:8080/api/semesters';

class SemesterService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get all semesters
  async getAllSemesters(): Promise<SemesterListResponse | ApiErrorResponse> {
    try {
      const response = await fetch(API_BASE, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching semesters:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy danh sách kỳ học'
      };
    }
  }

  // Get semester by ID
  async getSemesterById(id: number): Promise<SemesterResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching semester:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy thông tin kỳ học'
      };
    }
  }

  // Get semester by code
  async getSemesterByCode(code: string): Promise<SemesterResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/code/${encodeURIComponent(code)}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching semester by code:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy thông tin kỳ học'
      };
    }
  }

  // Create semester
  async createSemester(semesterData: CreateSemesterRequest): Promise<SemesterResponse | ApiErrorResponse> {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(semesterData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating semester:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi tạo kỳ học'
      };
    }
  }

  // Update semester
  async updateSemester(id: number, semesterData: UpdateSemesterRequest): Promise<SemesterResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(semesterData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating semester:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi cập nhật kỳ học'
      };
    }
  }

  // Delete semester
  async deleteSemester(id: number): Promise<DeleteSemesterResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting semester:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi xóa kỳ học'
      };
    }
  }

  // Search semesters (client-side filtering for now)
  async searchSemesters(params: SemesterSearchParams): Promise<SemesterListResponse | ApiErrorResponse> {
    try {
      // Get all semesters first
      const allSemesters = await this.getAllSemesters();
      
      if (isApiError(allSemesters)) {
        return allSemesters;
      }

      let filteredData = allSemesters.data;

      // Filter by keyword (search in code and name)
      if (params.keyword && params.keyword.trim()) {
        const keyword = params.keyword.toLowerCase().trim();
        filteredData = filteredData.filter(semester =>
          semester.code.toLowerCase().includes(keyword) ||
          semester.name.toLowerCase().includes(keyword)
        );
      }

      // Filter by term
      if (params.term) {
        filteredData = filteredData.filter(semester => semester.term === params.term);
      }

      // Filter by year
      if (params.year) {
        filteredData = filteredData.filter(semester => semester.year === params.year);
      }

      return {
        success: true,
        message: 'Tìm kiếm kỳ học thành công',
        data: filteredData
      };
    } catch (error) {
      console.error('Error searching semesters:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi tìm kiếm kỳ học'
      };
    }
  }
}

export const semesterService = new SemesterService();

// Export type guards for convenience
export { 
  isApiError, 
  isSemesterResponse, 
  isSemesterListResponse, 
  isDeleteSemesterResponse 
};