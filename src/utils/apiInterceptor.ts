// API Interceptor with Token Refresh
import { authService } from '../services/authService';
import { TokenStorage, isTokenExpired } from './jwt';

interface ApiCallOptions extends RequestInit {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

/**
 * Enhanced API call with automatic token refresh
 */
export const apiCallWithRefresh = async <T>(
  url: string,
  options: ApiCallOptions = {}
): Promise<T> => {
  const { skipAuth = false, skipRefresh = false, ...fetchOptions } = options;

  // Check if token needs refresh (before making the call)
  if (!skipAuth && !skipRefresh) {
    const token = TokenStorage.getAccessToken();
    if (token && isTokenExpired(token)) {
      console.log('🔄 Token expired, refreshing...');
      const refreshToken = TokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await authService.refreshToken(refreshToken);
          if ('data' in response && response.success) {
            TokenStorage.setAccessToken(response.data.accessToken);
            TokenStorage.setRefreshToken(response.data.refreshToken);
            console.log('✅ Token refreshed successfully');
          } else {
            console.error('❌ Token refresh failed, logging out');
            TokenStorage.clearTokens();
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
          }
        } catch (error) {
          console.error('❌ Token refresh error:', error);
          TokenStorage.clearTokens();
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
      } else {
        TokenStorage.clearTokens();
        window.location.href = '/login';
        throw new Error('No refresh token available');
      }
    }
  }

  // Get fresh token for request
  const token = skipAuth ? null : TokenStorage.getAccessToken();

  // Make API call
  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...fetchOptions.headers,
    },
  });

  // Parse response
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Invalid JSON response (Status: ${response.status})`);
  }

  // Handle 401 Unauthorized (token might be invalid)
  if (response.status === 401 && !skipRefresh) {
    console.log('🔄 Got 401, attempting token refresh...');
    const refreshToken = TokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResponse = await authService.refreshToken(refreshToken);
        if ('data' in refreshResponse && refreshResponse.success) {
          TokenStorage.setAccessToken(refreshResponse.data.accessToken);
          TokenStorage.setRefreshToken(refreshResponse.data.refreshToken);
          console.log('✅ Token refreshed after 401, retrying request...');
          
          // Retry original request with new token
          return apiCallWithRefresh<T>(url, { ...options, skipRefresh: true });
        }
      } catch (error) {
        console.error('❌ Token refresh failed after 401:', error);
      }
    }
    
    // If refresh failed or no refresh token, logout
    TokenStorage.clearTokens();
    window.location.href = '/login';
    throw new Error('Unauthorized. Please login again.');
  }

  // Handle other errors
  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return data as T;
};

/**
 * Helper to check if token is about to expire (within 5 minutes)
 */
export const shouldRefreshToken = (): boolean => {
  const token = TokenStorage.getAccessToken();
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiry = expiryTime - currentTime;
    
    // Refresh if token expires in less than 5 minutes
    return timeUntilExpiry < 5 * 60 * 1000;
  } catch {
    return false;
  }
};
