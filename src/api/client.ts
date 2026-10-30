// Centralized API Client with Token Interception & Error Normalization
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '/api/v1';
  }

  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('meddhatri_token') || localStorage.getItem('meddhatri_jwt_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  private async tryRefreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('meddhatri_refresh_token');
    if (!refreshToken) return null;

    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshUrl = `${this.baseUrl}/auth/refresh`;
        const res = await fetch(refreshUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        if (!res.ok) return null;
        const result = await res.json().catch(() => ({}));
        if (result.success && result.data?.accessToken) {
          localStorage.setItem('meddhatri_token', result.data.accessToken);
          localStorage.setItem('meddhatri_jwt_token', result.data.accessToken);
          if (result.data.refreshToken) {
            localStorage.setItem('meddhatri_refresh_token', result.data.refreshToken);
          }
          return result.data.accessToken as string;
        }
        return null;
      } catch {
        return null;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...this.getAuthHeader(),
      ...((options.headers as Record<string, string>) || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (response.status === 401 && !isRetry) {
        const newToken = await this.tryRefreshToken();
        if (newToken) {
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${newToken}`
          };
          return this.request<T>(endpoint, { ...options, headers: retryHeaders }, true);
        }
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error: any) {
      console.warn(`[API Client] Request to ${endpoint} failed:`, error.message);
      // Fallback response for resilient client operations
      return {
        success: false,
        data: null as any,
        message: error.message
      };
    }
  }

  get<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  put<T = any>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  patch<T = any>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  delete<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  upload<T = any>(endpoint: string, formData: FormData, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
