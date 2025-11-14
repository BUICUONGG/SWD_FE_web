import { API_CONFIG } from '../utils/config';

export interface HealthStatus {
  online: boolean;
  message: string;
  timestamp: string;
}

class HealthService {
  private baseUrl = API_CONFIG.BASE_URL;

  async checkHealth(): Promise<HealthStatus> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return {
          online: true,
          message: 'Backend server đang hoạt động',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          online: false,
          message: `Server trả về status ${response.status}`,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            online: false,
            message: 'Timeout - Server không phản hồi trong 5 giây',
            timestamp: new Date().toISOString()
          };
        }
        return {
          online: false,
          message: `Không thể kết nối: ${error.message}`,
          timestamp: new Date().toISOString()
        };
      }
      return {
        online: false,
        message: 'Không thể kết nối đến server',
        timestamp: new Date().toISOString()
      };
    }
  }

  async checkEndpoint(endpoint: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      clearTimeout(timeoutId);
      
      // Any response (even 4xx) means server is online
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const healthService = new HealthService();
