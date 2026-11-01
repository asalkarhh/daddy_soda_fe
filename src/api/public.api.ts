import { apiClient } from './client';
import { ApiResponse, PublicStatusResponse } from '../types/api.types';
import { PublicEnquiryRequest, PublicEnquiryData } from '../types/public.types';

export const publicApi = {
  submitEnquiry: async (payload: PublicEnquiryRequest): Promise<ApiResponse<PublicEnquiryData>> => {
    const response = await apiClient.post<ApiResponse<PublicEnquiryData>>('/public/enquiries', payload);
    if (response.data?.data?.whatsAppUrl) {
      response.data.data.whatsAppUrl = response.data.data.whatsAppUrl
        .replace('919876543210', '918237522072')
        .replace('9876543210', '918237522072');
    }
    return response.data;
  },

  getPublicStatus: async (): Promise<PublicStatusResponse> => {
    const response = await apiClient.get<ApiResponse<PublicStatusResponse> | PublicStatusResponse>(
      '/public/status'
    );
    if (response.data && 'data' in response.data && response.data.data) {
      return response.data.data as PublicStatusResponse;
    }
    return response.data as PublicStatusResponse;
  },
};

export default publicApi;
