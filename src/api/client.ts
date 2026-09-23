import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';
import { storage } from '../utils/storage';

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request interceptor: automatically add Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401 globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and cached user
      storage.clearSession();

      // Notify AuthContext listener if attached
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));

        // Prevent infinite reload loop on /login
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          // Store return url for post-login redirect
          const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/login?redirect=${returnUrl}`;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
