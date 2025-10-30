/**
 * Centralized API client
 * Tất cả các request API đi qua đây
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  data?: any;
}

/**
 * Wrapper function cho tất cả API calls
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { data, ...fetchOptions } = options;
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(typeof fetchOptions.headers === 'object' ? fetchOptions.headers : {}),
  } as Record<string, string>;

  // Add authorization header if token exists
  const accessToken = localStorage.getItem('auth-accessToken');
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  // Handle error responses
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }

  return response.json();
}

/**
 * GET request
 */
export const get = <T,>(endpoint: string, options?: RequestOptions): Promise<T> => {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'GET',
  });
};

/**
 * POST request
 */
export const post = <T,>(
  endpoint: string,
  data?: any,
  options?: RequestOptions
): Promise<T> => {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'POST',
    data,
  });
};

/**
 * PUT request
 */
export const put = <T,>(
  endpoint: string,
  data?: any,
  options?: RequestOptions
): Promise<T> => {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'PUT',
    data,
  });
};

/**
 * PATCH request
 */
export const patch = <T,>(
  endpoint: string,
  data?: any,
  options?: RequestOptions
): Promise<T> => {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'PATCH',
    data,
  });
};

/**
 * DELETE request
 */
export const delete_ = <T,>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> => {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
};

/**
 * Upload file
 */
export const uploadFile = async <T,>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<T> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add additional data if provided
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {} as Record<string, string>;

  // Add authorization header if token exists
  const accessToken = localStorage.getItem('auth-accessToken');
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }

  return response.json();
};

export default {
  get,
  post,
  put,
  patch,
  delete_,
  uploadFile,
};
