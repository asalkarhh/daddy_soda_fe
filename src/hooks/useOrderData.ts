import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../api/order.api';
import { useToast } from './useToast';
import { getApiErrorMessage } from '../api/apiHelpers';
import {
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderFilters,
  MyOrderFilters,
} from '../types/order.types';

export function useOrders(params?: OrderFilters) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApi.getOrders(params),
    refetchOnMount: 'always',
  });
}

export function useMyOrders(params?: MyOrderFilters) {
  return useQuery({
    queryKey: ['my-orders', params],
    queryFn: () => orderApi.getMyOrders(params),
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getOrderById(id),
    enabled: Boolean(id),
  });
}

export function useOrderMutations() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      success(`Order "${data.orderNumber}" created successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to create order.'));
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderRequest }) =>
      orderApi.updateOrder(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
      success(`Order "${data.orderNumber}" updated successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update order.'));
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: (id: string) => orderApi.placeOrder(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
      success(`Order "${data.orderNumber}" has been placed for processing!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to place order.'));
    },
  });

  const prepareOrderMutation = useMutation({
    mutationFn: (id: string) => orderApi.prepareOrder(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
      success(`Order "${data.orderNumber}" marked as Prepared!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to mark order as prepared.'));
    },
  });

  const deliverOrderMutation = useMutation({
    mutationFn: ({ id, remark }: { id: string; remark: string }) => orderApi.deliverOrder(id, remark),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      success(`Order "${data.orderNumber}" dispatched! Warehouse stock updated.`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to deliver order.'));
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      orderApi.cancelOrder(id, { reason }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
      success(`Order "${data.orderNumber}" has been cancelled.`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to cancel order.'));
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => orderApi.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      success('Draft order deleted successfully.');
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to delete draft order.'));
    },
  });

  return {
    createOrderMutation,
    updateOrderMutation,
    placeOrderMutation,
    prepareOrderMutation,
    deliverOrderMutation,
    cancelOrderMutation,
    deleteOrderMutation,
  };
}
