// Centralized Error Handler
import { message } from 'antd';
import { TokenStorage } from './jwt';

export interface ApiError {
  success: false;
  message: string;
  errorCode?: string;
  status?: number;
}

/**
 * Handle API errors consistently across the app
 */
export const handleApiError = (error: ApiError | Error | unknown, context?: string): void => {
  console.error(`❌ Error${context ? ` in ${context}` : ''}:`, error);

  // Check if it's an ApiError
  if (isApiError(error)) {
    switch (error.status) {
      case 401:
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        TokenStorage.clearTokens();
        window.location.href = '/login';
        break;
      
      case 403:
        message.error('Bạn không có quyền truy cập tài nguyên này.');
        break;
      
      case 404:
        message.error('Không tìm thấy dữ liệu yêu cầu.');
        break;
      
      case 500:
        if (error.message.toLowerCase().includes('access denied')) {
          message.warning('Bạn không có quyền truy cập. Đang sử dụng dữ liệu demo.');
        } else {
          message.error('Lỗi server. Vui lòng thử lại sau.');
        }
        break;
      
      default:
        message.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  } else if (error instanceof Error) {
    // Handle JavaScript Error
    if (error.message.toLowerCase().includes('network') || 
        error.message.toLowerCase().includes('fetch')) {
      message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
      message.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  } else {
    // Unknown error
    message.error('Có lỗi không xác định xảy ra.');
  }
};

/**
 * Type guard for ApiError
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'success' in error &&
    (error as ApiError).success === false
  );
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error: ApiError | Error | unknown): string => {
  if (isApiError(error)) {
    return error.message;
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'Có lỗi xảy ra. Vui lòng thử lại.';
};

/**
 * Check if error is authorization related
 */
export const isAuthError = (error: unknown): boolean => {
  if (isApiError(error)) {
    return error.status === 401 || error.status === 403;
  }
  return false;
};

/**
 * Check if error is network related
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('network') || 
           message.includes('fetch') || 
           message.includes('connection');
  }
  if (isApiError(error)) {
    return error.errorCode === 'NETWORK_ERROR';
  }
  return false;
};
