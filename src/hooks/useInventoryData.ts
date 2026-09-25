import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { useToast } from './useToast';
import { getApiErrorMessage } from '../api/apiHelpers';
import {
  PurchaseFilterParams,
  CreatePurchaseRequest,
  InventoryFilterParams,
  StockMovementFilterParams,
  StockAdjustmentRequest,
} from '../types/inventory.types';

// ====================================================
// Purchases Hooks
// ====================================================

export function usePurchases(params?: PurchaseFilterParams) {
  return useQuery({
    queryKey: ['purchases', params],
    queryFn: () => inventoryApi.getPurchases(params),
  });
}

export function usePurchaseDetail(id: string) {
  return useQuery({
    queryKey: ['purchase', id],
    queryFn: () => inventoryApi.getPurchaseById(id),
    enabled: Boolean(id),
  });
}

export function usePurchaseMutations() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const createPurchaseMutation = useMutation({
    mutationFn: (data: CreatePurchaseRequest) => inventoryApi.createPurchase(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      success(`Purchase Bill "${data.purchaseNumber}" recorded & added to warehouse stock!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to save purchase bill.'));
    },
  });

  const cancelPurchaseMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      inventoryApi.cancelPurchase(id, { reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchase', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      success('Purchase bill cancelled and stock reversed successfully.');
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to cancel purchase bill.'));
    },
  });

  return { createPurchaseMutation, cancelPurchaseMutation };
}

// ====================================================
// Warehouse Inventory Hooks
// ====================================================

export function useWarehouseInventory(params?: InventoryFilterParams) {
  return useQuery({
    queryKey: ['warehouse-inventory', params],
    queryFn: () => inventoryApi.getWarehouseInventory(params),
  });
}

export function useProductInventory(productId: string) {
  return useQuery({
    queryKey: ['product-inventory', productId],
    queryFn: () => inventoryApi.getProductInventory(productId),
    enabled: Boolean(productId),
  });
}

export function useStockMovements(params?: StockMovementFilterParams) {
  return useQuery({
    queryKey: ['stock-movements', params],
    queryFn: () => inventoryApi.getStockMovements(params),
  });
}

export function useStockAdjustmentMutation() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  return useMutation({
    mutationFn: (data: StockAdjustmentRequest) => inventoryApi.adjustStock(data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['product-inventory', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });

      const updatedQty = res?.updatedQuantity ?? 'updated';
      success(`Stock adjusted successfully! Current balance: ${updatedQty}`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to adjust stock.'));
    },
  });
}
