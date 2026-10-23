import apiClient from './client';
import { ApiResponse } from '../types/api.types';
import { cleanQueryParams } from './apiHelpers';
import { PaginatedData } from '../types/master.types';
import {
  SalesOrder,
  CreateOrderRequest,
  UpdateOrderRequest,
  CancelOrderRequest,
  OrderFilters,
  MyOrderFilters,
} from '../types/order.types';

export const orderApi = {
  // --------------------------------------------------
  // Admin & Manager Orders API
  // --------------------------------------------------
  getOrders: async (params?: OrderFilters): Promise<PaginatedData<SalesOrder>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<SalesOrder>>>('/orders', {
      params: cleanQueryParams(params),
    });
    return response.data.data;
  },

  getOrderById: async (id: string): Promise<SalesOrder> => {
    const response = await apiClient.get<ApiResponse<SalesOrder>>(`/orders/${id}`);
    return response.data.data;
  },

  createOrder: async (payload: CreateOrderRequest): Promise<SalesOrder> => {
    const response = await apiClient.post<ApiResponse<SalesOrder>>('/orders', payload);
    return response.data.data;
  },

  updateOrder: async (id: string, payload: UpdateOrderRequest): Promise<SalesOrder> => {
    const response = await apiClient.put<ApiResponse<SalesOrder>>(`/orders/${id}`, payload);
    return response.data.data;
  },

  placeOrder: async (id: string): Promise<SalesOrder> => {
    const response = await apiClient.post<ApiResponse<SalesOrder>>(`/orders/${id}/place`);
    return response.data.data;
  },

  prepareOrder: async (id: string): Promise<SalesOrder> => {
    const response = await apiClient.post<ApiResponse<SalesOrder>>(`/orders/${id}/prepare`);
    return response.data.data;
  },

  deliverOrder: async (id: string, remark: string): Promise<SalesOrder> => {
    const response = await apiClient.post<ApiResponse<SalesOrder>>(`/orders/${id}/deliver`, { remark });
    return response.data.data;
  },

  cancelOrder: async (id: string, payload: CancelOrderRequest): Promise<SalesOrder> => {
    const response = await apiClient.post<ApiResponse<SalesOrder>>(`/orders/${id}/cancel`, payload);
    return response.data.data;
  },

  deleteOrder: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/orders/${id}`);
  },

  // --------------------------------------------------
  // Franchise Owner Self-Service Orders API
  // --------------------------------------------------
  getMyOrders: async (params?: MyOrderFilters): Promise<PaginatedData<SalesOrder>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<SalesOrder>>>('/my/orders', {
      params: cleanQueryParams(params),
    });
    return response.data.data;
  },
};
