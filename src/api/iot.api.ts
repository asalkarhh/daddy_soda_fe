import { apiClient } from './client';
import { ApiResponse, PaginatedData } from '../types/api.types';
import {
  IotMachineStatus,
  IotMachineStatusFilters,
  IotEvent,
  IotEventFilters,
  ManualDailySales,
  ManualDailySalesFormData,
  ManualDailySalesFilters,
  ConsumptionSummary,
  ConsumptionReportFilters,
} from '../types/iot.types';

// Helper for triggering browser download of CSV blobs
async function triggerCsvDownload(
  url: string,
  params: Record<string, string | number | boolean | undefined>,
  fallbackFilename: string
): Promise<void> {
  const response = await apiClient.get(url, {
    params,
    responseType: 'blob',
  });

  const disposition = response.headers['content-disposition'];
  let filename = fallbackFilename;
  if (disposition && disposition.includes('filename=')) {
    const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/['"]/g, '').trim();
    }
  }

  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

export const iotApi = {
  // --------------------------------------------------
  // IoT Machine Monitoring
  // --------------------------------------------------
  getMachinesStatus: async (
    params?: IotMachineStatusFilters
  ): Promise<PaginatedData<IotMachineStatus> | IotMachineStatus[]> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<IotMachineStatus> | IotMachineStatus[]>>(
      '/iot/machines/status',
      { params }
    );
    return response.data.data;
  },

  // --------------------------------------------------
  // IoT Events
  // --------------------------------------------------
  getEvents: async (params?: IotEventFilters): Promise<PaginatedData<IotEvent>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<IotEvent>>>(
      '/iot/events',
      { params }
    );
    return response.data.data;
  },

  getEventById: async (id: string): Promise<IotEvent> => {
    const response = await apiClient.get<ApiResponse<IotEvent>>(`/iot/events/${id}`);
    return response.data.data;
  },

  // --------------------------------------------------
  // Manual Daily Sales
  // --------------------------------------------------
  getManualDailySales: async (
    params?: ManualDailySalesFilters
  ): Promise<PaginatedData<ManualDailySales>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<ManualDailySales>>>(
      '/manual-sales',
      { params }
    );
    return response.data.data;
  },

  getManualDailySalesById: async (id: string): Promise<ManualDailySales> => {
    const response = await apiClient.get<ApiResponse<ManualDailySales>>(`/manual-sales/${id}`);
    return response.data.data;
  },

  createManualDailySales: async (payload: ManualDailySalesFormData): Promise<ManualDailySales> => {
    const response = await apiClient.post<ApiResponse<ManualDailySales>>('/manual-sales', payload);
    return response.data.data;
  },

  updateManualDailySales: async (
    id: string,
    payload: ManualDailySalesFormData
  ): Promise<ManualDailySales> => {
    const response = await apiClient.put<ApiResponse<ManualDailySales>>(`/manual-sales/${id}`, payload);
    return response.data.data;
  },

  deleteManualDailySales: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/manual-sales/${id}`);
  },

  // --------------------------------------------------
  // Consumption Reports
  // --------------------------------------------------
  getConsumptionSummary: async (
    params?: ConsumptionReportFilters
  ): Promise<ConsumptionSummary> => {
    const response = await apiClient.get<ApiResponse<ConsumptionSummary>>(
      '/reports/consumption/summary',
      { params }
    );
    return response.data.data;
  },

  downloadConsumptionReport: async (params?: ConsumptionReportFilters): Promise<void> => {
    const today = new Date().toISOString().split('T')[0];
    const fallback = `consumption-report-${today}.csv`;
    await triggerCsvDownload('/reports/consumption/download', (params || {}) as Record<string, any>, fallback);
  },
};
