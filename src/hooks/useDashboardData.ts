import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import {
  DueFilters,
  EnquiryFilters,
  EnquiryStatusUpdateRequest,
  MonthlyPurchasesReportFilters,
  MonthlyOrdersReportFilters,
  MonthlyInvoicesReportFilters,
  MonthlyDuesReportFilters,
} from '../types/dashboard.types';
import { useToast } from './useToast';
import { getApiErrorMessage } from '../api/apiHelpers';
import {
  generatePurchasesReportPdf,
  generateOrdersReportPdf,
  generateInvoicesReportPdf,
  generateDuesReportPdf,
} from '../utils/reportPdfGenerator';

export function useOperationalSummary() {
  return useQuery({
    queryKey: ['operational-summary'],
    queryFn: dashboardApi.getOperationalSummary,
    staleTime: 60 * 1000,
  });
}

export function useFranchiseSummary(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['franchise-summary'],
    queryFn: dashboardApi.getFranchiseSummary,
    staleTime: 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useDues(params?: DueFilters) {
  return useQuery({
    queryKey: ['dues', params],
    queryFn: () => dashboardApi.getDues(params),
    staleTime: 30 * 1000,
  });
}

export function useEnquiries(params?: EnquiryFilters) {
  return useQuery({
    queryKey: ['enquiries', params],
    queryFn: () => dashboardApi.getEnquiries(params),
    staleTime: 30 * 1000,
  });
}

export function useEnquiryDetail(id: string) {
  return useQuery({
    queryKey: ['enquiry', id],
    queryFn: () => dashboardApi.getEnquiryById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useEnquiryMutations() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: EnquiryStatusUpdateRequest;
    }) => dashboardApi.updateEnquiryStatus(id, payload),
    onSuccess: (data) => {
      success(`Enquiry #${data.enquiryNumber} status set to ${data.status}.`, 'Status Updated');
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['enquiry', data.id] });
      queryClient.invalidateQueries({ queryKey: ['operational-summary'] });
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Could not update enquiry status. Please try again.'), 'Update Failed');
    },
  });

  return { updateStatusMutation };
}

export function useReportDownloads() {
  const { success, error: toastError } = useToast();
  const [downloadingType, setDownloadingType] = useState<string | null>(null);

  // --- Purchases Reports ---
  const downloadPurchases = async (params: MonthlyPurchasesReportFilters) => {
    try {
      setDownloadingType('purchases-csv');
      await dashboardApi.downloadPurchasesReport(params);
      success(`Monthly purchases CSV for ${params.month} has been saved.`, 'Report Downloaded');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not download purchases report. Please try again.'), 'Download Failed');
    } finally {
      setDownloadingType(null);
    }
  };

  const downloadPurchasesPdf = async (
    params: MonthlyPurchasesReportFilters,
    extraMeta?: { supplierName?: string }
  ) => {
    try {
      setDownloadingType('purchases-pdf');
      const csvText = await dashboardApi.fetchPurchasesReportCsv(params);
      const opened = generatePurchasesReportPdf(csvText, params, extraMeta);
      if (opened) {
        success(`Monthly purchases PDF statement generated for ${params.month}.`, 'PDF Ready');
      } else {
        toastError('Pop-up window was blocked. Please allow pop-ups for this site to view the PDF report.', 'Window Blocked');
      }
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not generate purchases PDF report. Please try again.'), 'PDF Generation Failed');
    } finally {
      setDownloadingType(null);
    }
  };

  // --- Orders Reports ---
  const downloadOrders = async (params: MonthlyOrdersReportFilters) => {
    try {
      setDownloadingType('orders-csv');
      await dashboardApi.downloadOrdersReport(params);
      success(`Monthly orders CSV for ${params.month} has been saved.`, 'Report Downloaded');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not download orders report. Please try again.'), 'Download Failed');
    } finally {
      setDownloadingType(null);
    }
  };

  const downloadOrdersPdf = async (
    params: MonthlyOrdersReportFilters,
    extraMeta?: { franchiseName?: string }
  ) => {
    try {
      setDownloadingType('orders-pdf');
      const csvText = await dashboardApi.fetchOrdersReportCsv(params);
      const opened = generateOrdersReportPdf(csvText, params, extraMeta);
      if (opened) {
        success(`Monthly sales orders PDF statement generated for ${params.month}.`, 'PDF Ready');
      } else {
        toastError('Pop-up window was blocked. Please allow pop-ups for this site to view the PDF report.', 'Window Blocked');
      }
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not generate orders PDF report. Please try again.'), 'PDF Generation Failed');
    } finally {
      setDownloadingType(null);
    }
  };

  // --- Invoices Reports ---
  const downloadInvoices = async (params: MonthlyInvoicesReportFilters) => {
    try {
      setDownloadingType('invoices-csv');
      await dashboardApi.downloadInvoicesReport(params);
      success(`Monthly invoices CSV for ${params.month} has been saved.`, 'Report Downloaded');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not download invoices report. Please try again.'), 'Download Failed');
    } finally {
      setDownloadingType(null);
    }
  };

  const downloadInvoicesPdf = async (
    params: MonthlyInvoicesReportFilters,
    extraMeta?: { franchiseName?: string; availableCredit?: number }
  ) => {
    try {
      setDownloadingType('invoices-pdf');
      const csvText = await dashboardApi.fetchInvoicesReportCsv(params);
      const opened = generateInvoicesReportPdf(csvText, params, extraMeta);
      if (opened) {
        success(`Monthly invoices PDF statement generated for ${params.month}.`, 'PDF Ready');
      } else {
        toastError('Pop-up window was blocked. Please allow pop-ups for this site to view the PDF report.', 'Window Blocked');
      }
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not generate invoices PDF report. Please try again.'), 'PDF Generation Failed');
    } finally {
      setDownloadingType(null);
    }
  };

  // --- Dues Reports ---
  const downloadDues = async (params: MonthlyDuesReportFilters) => {
    try {
      setDownloadingType('dues-csv');
      await dashboardApi.downloadDuesReport(params);
      success(`Monthly due payments CSV for ${params.month} has been saved.`, 'Report Downloaded');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not download dues report. Please try again.'), 'Download Failed');
    } finally {
      setDownloadingType(null);
    }
  };

  const downloadDuesPdf = async (
    params: MonthlyDuesReportFilters,
    extraMeta?: { franchiseName?: string }
  ) => {
    try {
      setDownloadingType('dues-pdf');
      const csvText = await dashboardApi.fetchDuesReportCsv(params);
      const opened = generateDuesReportPdf(csvText, params, extraMeta);
      if (opened) {
        success(`Monthly due payments PDF statement generated for ${params.month}.`, 'PDF Ready');
      } else {
        toastError('Pop-up window was blocked. Please allow pop-ups for this site to view the PDF report.', 'Window Blocked');
      }
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not generate dues PDF report. Please try again.'), 'PDF Generation Failed');
    } finally {
      setDownloadingType(null);
    }
  };

  return {
    downloadingType,
    downloadPurchases,
    downloadPurchasesPdf,
    downloadOrders,
    downloadOrdersPdf,
    downloadInvoices,
    downloadInvoicesPdf,
    downloadDues,
    downloadDuesPdf,
  };
}
