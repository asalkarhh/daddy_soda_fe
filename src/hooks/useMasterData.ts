import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masterApi } from '../api/master.api';
import { useToast } from './useToast';
import { getApiErrorMessage } from '../api/apiHelpers';
import {
  FranchiseFilterParams,
  FranchiseFormData,
  OutletFilterParams,
  OutletFormData,
  MachineFilterParams,
  MachineFormData,
  ProductFilterParams,
  ProductFormData,
  SupplierFilterParams,
  SupplierFormData,
  UserFilterParams,
  CreateUserFormData,
  UpdateUserFormData,
  StatusUpdateRequest,
} from '../types/master.types';

// ====================================================
// Franchises Hooks
// ====================================================
export function useFranchises(params?: FranchiseFilterParams) {
  return useQuery({
    queryKey: ['franchises', params],
    queryFn: () => masterApi.getFranchises(params),
  });
}

export function useActiveFranchises() {
  return useQuery({
    queryKey: ['franchises', 'active-list'],
    queryFn: () => masterApi.getAllActiveFranchises(),
    staleTime: 60 * 1000,
  });
}

export function useFranchiseMutations() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: FranchiseFormData) => masterApi.createFranchise(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['franchises'] });
      success(`Franchise "${data.businessName}" created successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to create franchise.'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FranchiseFormData }) =>
      masterApi.updateFranchise(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['franchises'] });
      success(`Franchise "${data.businessName}" updated successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update franchise.'));
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusUpdateRequest }) =>
      masterApi.updateFranchiseStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['franchises'] });
      success(`Franchise marked as ${variables.status.active ? 'Active' : 'Inactive'}.`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update franchise status.'));
    },
  });

  return { createMutation, updateMutation, statusMutation };
}

// ====================================================
// Outlets Hooks
// ====================================================
export function useOutlets(params?: OutletFilterParams) {
  return useQuery({
    queryKey: ['outlets', params],
    queryFn: () => masterApi.getOutlets(params),
  });
}

export function useActiveOutletsByFranchise(franchiseId: string) {
  return useQuery({
    queryKey: ['outlets', 'active-by-franchise', franchiseId],
    queryFn: () => masterApi.getActiveOutletsByFranchise(franchiseId),
    enabled: Boolean(franchiseId),
  });
}

export function useOutletMutations() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: OutletFormData) => masterApi.createOutlet(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
      queryClient.invalidateQueries({ queryKey: ['franchises'] });
      success(`Outlet "${data.outletName}" created successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to create outlet.'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: OutletFormData }) =>
      masterApi.updateOutlet(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
      success(`Outlet "${data.outletName}" updated successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update outlet.'));
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusUpdateRequest }) =>
      masterApi.updateOutletStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
      success(`Outlet marked as ${variables.status.active ? 'Active' : 'Inactive'}.`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update outlet status.'));
    },
  });

  return { createMutation, updateMutation, statusMutation };
}

// ====================================================
// Machines Hooks
// ====================================================
export function useMachines(params?: MachineFilterParams) {
  return useQuery({
    queryKey: ['machines', params],
    queryFn: () => masterApi.getMachines(params),
  });
}

export function useMachineMutations() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: Omit<MachineFormData, 'franchiseId'>) => masterApi.createMachine(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['my-machines'] });
      success(`Machine "${data.machineCode}" registered successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to register machine.'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<MachineFormData, 'franchiseId'> }) =>
      masterApi.updateMachine(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['my-machines'] });
      success(`Machine "${data.machineCode}" updated successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update machine.'));
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusUpdateRequest }) =>
      masterApi.updateMachineStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['my-machines'] });
      success(`Machine status updated to ${variables.status.active ? 'Active' : 'Inactive'}.`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update machine status.'));
    },
  });

  return { createMutation, updateMutation, statusMutation };
}

// ====================================================
// Products / Flavours Hooks
// ====================================================
export function useProducts(params?: ProductFilterParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => masterApi.getProducts(params),
  });
}

export function useProductMutations() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => masterApi.createProduct(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      success(`Product "${data.flavourName}" added successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to add product.'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) =>
      masterApi.updateProduct(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      success(`Product "${data.flavourName}" updated successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update product.'));
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusUpdateRequest }) =>
      masterApi.updateProductStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      success(`Product marked as ${variables.status.active ? 'Active' : 'Inactive'}.`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update product status.'));
    },
  });

  return { createMutation, updateMutation, statusMutation };
}

// ====================================================
// Suppliers Hooks
// ====================================================
export function useSuppliers(params?: SupplierFilterParams) {
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: () => masterApi.getSuppliers(params),
  });
}

export function useSupplierMutations() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: SupplierFormData) => masterApi.createSupplier(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      success(`Supplier "${data.supplierName}" added successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to add supplier.'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SupplierFormData }) =>
      masterApi.updateSupplier(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      success(`Supplier "${data.supplierName}" updated successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update supplier.'));
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusUpdateRequest }) =>
      masterApi.updateSupplierStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      success(`Supplier marked as ${variables.status.active ? 'Active' : 'Inactive'}.`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update supplier status.'));
    },
  });

  return { createMutation, updateMutation, statusMutation };
}

// ====================================================
// User Management Hooks (Super Admin)
// ====================================================
export function useManagedUsers(params?: UserFilterParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => masterApi.getUsers(params),
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: CreateUserFormData) => masterApi.createUser(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      success(`User account for "${data.fullName}" created successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to create user login.'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserFormData }) =>
      masterApi.updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      success(`User account for "${data.fullName}" updated successfully!`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update user login.'));
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusUpdateRequest }) =>
      masterApi.updateUserStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      success(`User account marked as ${variables.status.active ? 'Active' : 'Inactive'}.`);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err, 'Failed to update user status.'));
    },
  });

  return { createMutation, updateMutation, statusMutation };
}

// ====================================================
// Franchise Owner Self-Service Hooks
// ====================================================
export function useMyFranchiseDetails() {
  const franchiseQuery = useQuery({
    queryKey: ['my-franchise'],
    queryFn: () => masterApi.getMyFranchise(),
  });

  const outletsQuery = useQuery({
    queryKey: ['my-outlets'],
    queryFn: () => masterApi.getMyOutlets(),
  });

  const machinesQuery = useQuery({
    queryKey: ['my-machines'],
    queryFn: () => masterApi.getMyMachines(),
  });

  return { franchiseQuery, outletsQuery, machinesQuery };
}
