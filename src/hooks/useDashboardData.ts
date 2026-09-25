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

export function useOperationalSummary() {
  return useQuery({
    queryKey: ['operational-summary'],
    queryFn: dashboardApi.getOperationalSummary,
    staleTime: 60 * 1000,
  });
}

export function useFranchiseSummary() {
  return useQuery({
    queryKey: ['franchise-summary'],
    queryFn: dashboardApi.getFranchiseSummary,
    staleTime: 60 * 1000,
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

  const downloadPurchases = async (params: MonthlyPurchasesReportFilters) => {
    try {
      setDownloadingType('purchases');
      await dashboardApi.downloadPurchasesReport(params);
      success(`Monthly purchases CSV for ${params.month} has been saved.`, 'Report Downloaded');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not download purchases report. Please try again.'), 'Download Failed');
    } finally {
      setDownloadingType(null);
    }
  };

  const downloadOrders = async (params: MonthlyOrdersReportFilters) => {
    try {
      setDownloadingType('orders');
      await dashboardApi.downloadOrdersReport(params);
      success(`Monthly orders CSV for ${params.month} has been saved.`, 'Report Downloaded');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not download orders report. Please try again.'), 'Download Failed');
    } finally {
      setDownloadingType(null);
    }
  };

  const downloadInvoices = async (params: MonthlyInvoicesReportFilters) => {
    try {
      setDownloadingType('invoices');
      await dashboardApi.downloadInvoicesReport(params);
      success(`Monthly invoices CSV for ${params.month} has been saved.`, 'Report Downloaded');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not download invoices report. Please try again.'), 'Download Failed');
    } finally {
      setDownloadingType(null);
    }
  };

  const downloadDues = async (params: MonthlyDuesReportFilters) => {
    try {
      setDownloadingType('dues');
      await dashboardApi.downloadDuesReport(params);
      success(`Monthly due payments CSV for ${params.month} has been saved.`, 'Report Downloaded');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not download dues report. Please try again.'), 'Download Failed');
    } finally {
      setDownloadingType(null);
    }
  };

  return {
    downloadingType,
    downloadPurchases,
    downloadOrders,
    downloadInvoices,
    downloadDues,
  };
}
