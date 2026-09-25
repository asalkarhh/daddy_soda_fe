import apiClient from './client';
import { ApiResponse } from '../types/api.types';
import { PaginatedData } from '../types/master.types';
import {
  Invoice,
  InvoiceCreateRequest,
  DueDateUpdateRequest,
  PaymentCollection,
  PaymentCreateRequest,
  InvoiceFilters,
  MyInvoiceFilters,
} from '../types/invoice.types';

export const invoiceApi = {
  // --------------------------------------------------
  // Admin & Manager Invoices API
  // --------------------------------------------------
  getInvoices: async (params?: InvoiceFilters): Promise<PaginatedData<Invoice>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<Invoice>>>('/invoices', {
      params,
    });
    return response.data.data;
  },

  getInvoiceById: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get<ApiResponse<Invoice>>(`/invoices/${id}`);
    return response.data.data;
  },

  createInvoice: async (payload: InvoiceCreateRequest): Promise<Invoice> => {
    const response = await apiClient.post<ApiResponse<Invoice>>('/invoices', payload);
    return response.data.data;
  },

  updateDueDate: async (id: string, payload: DueDateUpdateRequest): Promise<Invoice> => {
    const response = await apiClient.patch<ApiResponse<Invoice>>(`/invoices/${id}/due-date`, payload);
    return response.data.data;
  },

  recordPayment: async (
    id: string,
    payload: PaymentCreateRequest
  ): Promise<PaymentCollection> => {
    const response = await apiClient.post<ApiResponse<PaymentCollection>>(
      `/invoices/${id}/payments`,
      payload
    );
    return response.data.data;
  },

  getInvoicePayments: async (id: string): Promise<PaymentCollection[]> => {
    const response = await apiClient.get<ApiResponse<PaymentCollection[]>>(
      `/invoices/${id}/payments`
    );
    return response.data.data;
  },

  downloadInvoicePdf: async (id: string, invoiceNumber?: string): Promise<void> => {
    const response = await apiClient.get(`/invoices/${id}/download`, {
      responseType: 'blob',
    });

    // Extract filename from Content-Disposition header if available
    const disposition = response.headers['content-disposition'];
    let filename = `invoice-${invoiceNumber || id}.pdf`;
    if (disposition && disposition.includes('filename=')) {
      const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '').trim();
      }
    }

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // --------------------------------------------------
  // Franchise Owner Self-Service Invoices API
  // --------------------------------------------------
  getMyInvoices: async (params?: MyInvoiceFilters): Promise<PaginatedData<Invoice>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<Invoice>>>('/my/invoices', {
      params,
    });
    return response.data.data;
  },
};
