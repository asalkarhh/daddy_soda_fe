import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { iotApi } from '../api/iot.api';
import {
  IotMachineStatusFilters,
  IotEventFilters,
  ManualDailySalesFormData,
  ManualDailySalesFilters,
  ConsumptionReportFilters,
} from '../types/iot.types';
import { useToast } from './useToast';
import { getApiErrorMessage } from '../api/apiHelpers';

// ====================================================
// IoT Machine Status & Monitoring Hooks
// ====================================================
export function useIotMachinesStatus(params?: IotMachineStatusFilters) {
  return useQuery({
    queryKey: ['iot-machines-status', params],
    queryFn: () => iotApi.getMachinesStatus(params),
    staleTime: 30 * 1000,
  });
}

// ====================================================
// IoT Events Hooks
// ====================================================
export function useIotEvents(params?: IotEventFilters) {
  return useQuery({
    queryKey: ['iot-events', params],
    queryFn: () => iotApi.getEvents(params),
    staleTime: 30 * 1000,
  });
}

export function useIotEventDetail(id: string) {
  return useQuery({
    queryKey: ['iot-event', id],
    queryFn: () => iotApi.getEventById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

// ====================================================
// Manual Daily Sales Hooks
// ====================================================
export function useManualDailySales(params?: ManualDailySalesFilters) {
  return useQuery({
    queryKey: ['manual-sales', params],
    queryFn: () => iotApi.getManualDailySales(params),
    staleTime: 30 * 1000,
  });
}

export function useManualDailySalesDetail(id: string) {
  return useQuery({
    queryKey: ['manual-sales-detail', id],
    queryFn: () => iotApi.getManualDailySalesById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useManualDailySalesMutations() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: ManualDailySalesFormData) => iotApi.createManualDailySales(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['manual-sales'] });
      queryClient.invalidateQueries({ queryKey: ['consumption-summary'] });
      success(`Manual daily entry for ${data.flavourName || 'flavour'} saved successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to save manual daily sales entry.'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ManualDailySalesFormData }) =>
      iotApi.updateManualDailySales(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['manual-sales'] });
      queryClient.invalidateQueries({ queryKey: ['manual-sales-detail', data.id] });
      queryClient.invalidateQueries({ queryKey: ['consumption-summary'] });
      success(`Manual daily entry for ${data.flavourName || 'flavour'} updated successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update manual daily sales entry.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => iotApi.deleteManualDailySales(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manual-sales'] });
      queryClient.invalidateQueries({ queryKey: ['consumption-summary'] });
      success('Manual daily sales entry deleted successfully.');
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to delete manual entry.'));
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}

// ====================================================
// Consumption Summary & Report Hooks
// ====================================================
export function useConsumptionSummary(params?: ConsumptionReportFilters) {
  return useQuery({
    queryKey: ['consumption-summary', params],
    queryFn: () => iotApi.getConsumptionSummary(params),
    staleTime: 30 * 1000,
  });
}

export function useConsumptionReportDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { success, error: toastError } = useToast();

  const downloadReport = async (filters?: ConsumptionReportFilters) => {
    setIsDownloading(true);
    try {
      await iotApi.downloadConsumptionReport(filters);
      success('Consumption CSV report downloaded successfully.');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Failed to download consumption CSV report.'));
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadReport, isDownloading };
}
