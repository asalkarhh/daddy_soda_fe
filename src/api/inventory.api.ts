import apiClient from './client';
import { ApiResponse } from '../types/api.types';
import { cleanQueryParams } from './apiHelpers';
import { PaginatedData } from '../types/master.types';
import {
  PurchaseEntry,
  CreatePurchaseRequest,
  CancelPurchaseRequest,
  PurchaseFilterParams,
  InventoryStock,
  InventoryFilterParams,
  StockMovement,
  StockMovementFilterParams,
  StockAdjustmentRequest,
  StockAdjustmentResponse,
} from '../types/inventory.types';

export const inventoryApi = {
  // --------------------------------------------------
  // Purchases API
  // --------------------------------------------------
  getPurchases: async (params?: PurchaseFilterParams): Promise<PaginatedData<PurchaseEntry>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<PurchaseEntry>>>('/purchases', {
      params: cleanQueryParams(params),
    });
    return response.data.data;
  },

  getPurchaseById: async (id: string): Promise<PurchaseEntry> => {
    const response = await apiClient.get<ApiResponse<PurchaseEntry>>(`/purchases/${id}`);
    return response.data.data;
  },

  createPurchase: async (payload: CreatePurchaseRequest): Promise<PurchaseEntry> => {
    const response = await apiClient.post<ApiResponse<PurchaseEntry>>('/purchases', payload);
    return response.data.data;
  },

  cancelPurchase: async (id: string, payload: CancelPurchaseRequest): Promise<PurchaseEntry> => {
    const response = await apiClient.post<ApiResponse<PurchaseEntry>>(`/purchases/${id}/cancel`, payload);
    return response.data.data;
  },

  // --------------------------------------------------
  // Warehouse Inventory API
  // --------------------------------------------------
  getWarehouseInventory: async (params?: InventoryFilterParams): Promise<PaginatedData<InventoryStock>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<InventoryStock>>>(
      '/inventory/warehouse',
      {
        params: cleanQueryParams({
          ...params,
          active: params?.productActive === 'ACTIVE' ? true : params?.productActive === 'INACTIVE' ? false : undefined,
          productActive: undefined,
        }),
      }
    );
    return response.data.data;
  },

  getProductInventory: async (
    productId: string
  ): Promise<{ stock: InventoryStock; movements?: StockMovement[] }> => {
    const response = await apiClient.get<
      ApiResponse<any>
    >(`/inventory/warehouse/${productId}`);
    const data = response.data.data;
    if (data) {
      const movements = data.recentMovements || data.movements || [];
      const stock = data.stock || data;
      return { stock, movements };
    }
    return { stock: data as InventoryStock, movements: [] };
  },

  getStockMovements: async (
    params?: StockMovementFilterParams
  ): Promise<PaginatedData<StockMovement>> => {
    const cleaned = cleanQueryParams(params);
    if (cleaned.movementType === 'ALL') {
      delete cleaned.movementType;
    }
    const response = await apiClient.get<ApiResponse<PaginatedData<StockMovement>>>(
      '/inventory/movements',
      { params: cleaned }
    );
    return response.data.data;
  },

  adjustStock: async (payload: StockAdjustmentRequest): Promise<StockAdjustmentResponse> => {
    const response = await apiClient.post<ApiResponse<StockAdjustmentResponse>>(
      '/inventory/adjustments',
      payload
    );
    return response.data.data;
  },
};
