import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceApi } from '../api/invoice.api';
import { useToast } from './useToast';
import { getApiErrorMessage } from '../api/apiHelpers';
import {
  InvoiceCreateRequest,
  DueDateUpdateRequest,
  PaymentCreateRequest,
  InvoiceFilters,
  MyInvoiceFilters,
} from '../types/invoice.types';

export function useInvoices(params?: InvoiceFilters) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => invoiceApi.getInvoices(params),
  });
}

export function useMyInvoices(params?: MyInvoiceFilters) {
  return useQuery({
    queryKey: ['my-invoices', params],
    queryFn: () => invoiceApi.getMyInvoices(params),
  });
}

export function useInvoiceDetail(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceApi.getInvoiceById(id),
    enabled: Boolean(id),
  });
}

export function useInvoicePayments(id: string) {
  return useQuery({
    queryKey: ['invoice-payments', id],
    queryFn: () => invoiceApi.getInvoicePayments(id),
    enabled: Boolean(id),
  });
}

export function useInvoiceMutations() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const createInvoiceMutation = useMutation({
    mutationFn: (data: InvoiceCreateRequest) => invoiceApi.createInvoice(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['my-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      success(`Invoice "${data.invoiceNumber}" generated successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to create invoice.'));
    },
  });

  const updateDueDateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DueDateUpdateRequest }) =>
      invoiceApi.updateDueDate(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['my-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] });
      success(`Due date for invoice "${data.invoiceNumber}" updated successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update due date.'));
    },
  });

  const recordPaymentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PaymentCreateRequest }) =>
      invoiceApi.recordPayment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['my-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['invoice-payments', variables.id] });
      success('Payment recorded successfully!');
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to record payment.'));
    },
  });

  const downloadPdf = async (id: string, invoiceNumber?: string) => {
    setIsDownloading(true);
    try {
      await invoiceApi.downloadInvoicePdf(id, invoiceNumber);
      success('Invoice PDF downloaded successfully.');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Failed to download invoice PDF.'));
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    createInvoiceMutation,
    updateDueDateMutation,
    recordPaymentMutation,
    downloadPdf,
    isDownloading,
  };
}
