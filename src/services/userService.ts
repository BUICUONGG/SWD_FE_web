import type { 
  CreateUserRequest,
  UserSearchParams,
  UserResponse,
  UserListResponse,
  ImportResponse,
  DeleteUserResponse,
  ApiErrorResponse
} from '../types/user';

import { 
  isApiError, 
  isUserResponse, 
  isUserListResponse, 
  isImportResponse,
  isDeleteUserResponse
} from '../types/user';

const API_BASE = 'http://localhost:8080/api/users';

class UserService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  private getAuthHeadersMultipart() {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`
      // Don't set Content-Type for multipart/form-data, let browser set it
    };
  }

  // 1. Create new user (Admin only)
  async createUser(userData: CreateUserRequest): Promise<UserResponse | ApiErrorResponse> {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi tạo người dùng'
      };
    }
  }

  // 2. Get current user info
  async getCurrentUser(): Promise<UserResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/me`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy thông tin người dùng hiện tại'
      };
    }
  }

  // 3. Get user by ID
  async getUserById(id: number): Promise<UserResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy thông tin người dùng'
      };
    }
  }

  // 4. Get all users
  async getAllUsers(): Promise<UserListResponse | ApiErrorResponse> {
    try {
      const response = await fetch(API_BASE, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy danh sách người dùng'
      };
    }
  }

  // 5. Search users
  async searchUsers(params: UserSearchParams): Promise<UserListResponse | ApiErrorResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params.keyword && params.keyword.trim()) {
        queryParams.append('keyword', params.keyword.trim());
      }

      const url = `${API_BASE}/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching users:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi tìm kiếm người dùng'
      };
    }
  }

  // 6. Delete user (Soft delete)
  async deleteUser(id: number): Promise<DeleteUserResponse | ApiErrorResponse> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi xóa người dùng'
      };
    }
  }

  // 7. Import users from Excel (Admin only)
  async importUsers(file: File): Promise<ImportResponse | ApiErrorResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/import`, {
        method: 'POST',
        headers: this.getAuthHeadersMultipart(),
        body: formData
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error importing users:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi import người dùng'
      };
    }
  }

  // Utility method to combine search and getAll
  async getUsers(searchParams?: UserSearchParams): Promise<UserListResponse | ApiErrorResponse> {
    if (searchParams?.keyword && searchParams.keyword.trim()) {
      return this.searchUsers(searchParams);
    } else {
      return this.getAllUsers();
    }
  }
}

export const userService = new UserService();

// Export type guards for convenience
export { 
  isApiError, 
  isUserResponse, 
  isUserListResponse, 
  isImportResponse,
  isDeleteUserResponse
};