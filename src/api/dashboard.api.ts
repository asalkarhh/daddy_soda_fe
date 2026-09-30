import { apiClient } from './client';
import { ApiResponse, PaginatedData } from '../types/api.types';
import { cleanQueryParams } from './apiHelpers';
import {
  OperationalDashboardSummary,
  FranchiseDashboardSummary,
  DueInvoice,
  DueFilters,
  Enquiry,
  EnquiryFilters,
  EnquiryStatusUpdateRequest,
  MonthlyPurchasesReportFilters,
  MonthlyOrdersReportFilters,
  MonthlyInvoicesReportFilters,
  MonthlyDuesReportFilters,
} from '../types/dashboard.types';

// Helper for triggering browser download of CSV blobs
async function triggerCsvDownload(
  url: string,
  params: Record<string, string | number | boolean | undefined>,
  fallbackFilename: string
): Promise<void> {
  const response = await apiClient.get(url, {
    params: cleanQueryParams(params),
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

export const dashboardApi = {
  // --------------------------------------------------
  // Summary Endpoints
  // --------------------------------------------------
  getOperationalSummary: async (): Promise<OperationalDashboardSummary> => {
    const response = await apiClient.get<ApiResponse<OperationalDashboardSummary>>(
      '/dashboard/summary'
    );
    return response.data.data;
  },

  getFranchiseSummary: async (): Promise<FranchiseDashboardSummary> => {
    const response = await apiClient.get<ApiResponse<FranchiseDashboardSummary>>(
      '/dashboard/franchise-summary'
    );
    return response.data.data;
  },

  // --------------------------------------------------
  // Due Payments Endpoint (Used by Admin & Franchise Owner)
  // --------------------------------------------------
  getDues: async (params?: DueFilters): Promise<PaginatedData<DueInvoice>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<DueInvoice>>>(
      '/dashboard/dues',
      { params: cleanQueryParams(params) }
    );
    return response.data.data;
  },

  // --------------------------------------------------
  // Monthly CSV Reports
  // --------------------------------------------------
  downloadPurchasesReport: async (params: MonthlyPurchasesReportFilters): Promise<void> => {
    const cleanParams: Record<string, string | undefined> = {
      month: params.month,
      supplierId: params.supplierId || undefined,
    };
    await triggerCsvDownload(
      '/reports/monthly/purchases/download',
      cleanParams,
      `monthly-purchases-${params.month}.csv`
    );
  },

  downloadOrdersReport: async (params: MonthlyOrdersReportFilters): Promise<void> => {
    const cleanParams: Record<string, string | undefined> = {
      month: params.month,
      franchiseId: params.franchiseId || undefined,
      orderStatus: params.orderStatus || undefined,
    };
    await triggerCsvDownload(
      '/reports/monthly/orders/download',
      cleanParams,
      `monthly-orders-${params.month}.csv`
    );
  },

  downloadInvoicesReport: async (params: MonthlyInvoicesReportFilters): Promise<void> => {
    const cleanParams: Record<string, string | undefined> = {
      month: params.month,
      franchiseId: params.franchiseId || undefined,
      invoiceType: params.invoiceType || undefined,
      paymentStatus: params.paymentStatus || undefined,
    };
    await triggerCsvDownload(
      '/reports/monthly/invoices/download',
      cleanParams,
      `monthly-invoices-${params.month}.csv`
    );
  },

  downloadDuesReport: async (params: MonthlyDuesReportFilters): Promise<void> => {
    const cleanParams: Record<string, string | undefined> = {
      month: params.month,
    };
    await triggerCsvDownload(
      '/reports/monthly/dues/download',
      cleanParams,
      `monthly-dues-${params.month}.csv`
    );
  },

  // --------------------------------------------------
  // Website Enquiries
  // --------------------------------------------------
  getEnquiries: async (params?: EnquiryFilters): Promise<PaginatedData<Enquiry>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<Enquiry>>>('/enquiries', {
      params: cleanQueryParams(params),
    });
    return response.data.data;
  },

  getEnquiryById: async (id: string): Promise<Enquiry> => {
    const response = await apiClient.get<ApiResponse<Enquiry>>(`/enquiries/${id}`);
    return response.data.data;
  },

  updateEnquiryStatus: async (
    id: string,
    payload: EnquiryStatusUpdateRequest
  ): Promise<Enquiry> => {
    const response = await apiClient.patch<ApiResponse<Enquiry>>(`/enquiries/${id}`, payload);
    return response.data.data;
  },
};
