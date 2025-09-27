import { User, ApiResponse } from '../types';
import api from './api';

// Auth services
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      email,
      password,
    });
    
    if (response.data.success) {
      localStorage.setItem('authToken', response.data.data.token);
      return response.data.data.user;
    }
    
    throw new Error(response.data.message || 'Login failed');
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/auth/register', userData);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Registration failed');
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to get user data');
  },
};

// User services
export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to get users');
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to get user');
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to update user');
  },

  deleteUser: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<null>>(`/users/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete user');
    }
  },
};