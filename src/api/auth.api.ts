import apiClient from './client';
import { ApiResponse, PublicStatusResponse } from '../types/api.types';
import { LoginRequest, LoginResponse, User } from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post<ApiResponse<void>>('/auth/logout');
    } catch {
      // Even if network or token is invalid on backend, local logout must succeed
    }
  },

  checkPublicStatus: async (): Promise<PublicStatusResponse> => {
    const response = await apiClient.get<ApiResponse<PublicStatusResponse> | PublicStatusResponse>('/public/status');
    if ('data' in response.data && response.data.data) {
      return response.data.data as PublicStatusResponse;
    }
    return response.data as PublicStatusResponse;
  },
};
