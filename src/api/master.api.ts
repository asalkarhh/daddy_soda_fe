import apiClient from './client';
import { ApiResponse } from '../types/api.types';
import {
  Franchise,
  FranchiseFormData,
  FranchiseFilterParams,
  Outlet,
  OutletFormData,
  OutletFilterParams,
  Machine,
  MachineFormData,
  MachineFilterParams,
  Product,
  ProductFormData,
  ProductFilterParams,
  Supplier,
  SupplierFormData,
  SupplierFilterParams,
  ManagedUser,
  CreateUserFormData,
  UpdateUserFormData,
  UserFilterParams,
  PaginatedData,
  StatusUpdateRequest,
} from '../types/master.types';

export const masterApi = {
  // --------------------------------------------------
  // Franchises API
  // --------------------------------------------------
  getFranchises: async (params?: FranchiseFilterParams): Promise<PaginatedData<Franchise>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<Franchise>>>('/franchises', {
      params,
    });
    return response.data.data;
  },

  getAllActiveFranchises: async (): Promise<Franchise[]> => {
    // Helper to fetch list for selectors
    const response = await apiClient.get<ApiResponse<PaginatedData<Franchise> | Franchise[]>>('/franchises', {
      params: { status: 'ACTIVE', size: 100 },
    });
    const data = response.data.data;
    if (Array.isArray(data)) return data;
    if (data && 'content' in data && Array.isArray(data.content)) return data.content;
    return [];
  },

  getFranchiseById: async (id: string): Promise<Franchise> => {
    const response = await apiClient.get<ApiResponse<Franchise>>(`/franchises/${id}`);
    return response.data.data;
  },

  createFranchise: async (payload: FranchiseFormData): Promise<Franchise> => {
    const response = await apiClient.post<ApiResponse<Franchise>>('/franchises', payload);
    return response.data.data;
  },

  updateFranchise: async (id: string, payload: FranchiseFormData): Promise<Franchise> => {
    const response = await apiClient.put<ApiResponse<Franchise>>(`/franchises/${id}`, payload);
    return response.data.data;
  },

  updateFranchiseStatus: async (id: string, payload: StatusUpdateRequest): Promise<Franchise> => {
    const response = await apiClient.patch<ApiResponse<Franchise>>(`/franchises/${id}/status`, payload);
    return response.data.data;
  },

  // --------------------------------------------------
  // Outlets API
  // --------------------------------------------------
  getOutlets: async (params?: OutletFilterParams): Promise<PaginatedData<Outlet>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<Outlet>>>('/outlets', {
      params,
    });
    return response.data.data;
  },

  getActiveOutletsByFranchise: async (franchiseId: string): Promise<Outlet[]> => {
    if (!franchiseId) return [];
    const response = await apiClient.get<ApiResponse<PaginatedData<Outlet> | Outlet[]>>('/outlets', {
      params: { franchiseId, status: 'ACTIVE', size: 100 },
    });
    const data = response.data.data;
    if (Array.isArray(data)) return data;
    if (data && 'content' in data && Array.isArray(data.content)) return data.content;
    return [];
  },

  getOutletById: async (id: string): Promise<Outlet> => {
    const response = await apiClient.get<ApiResponse<Outlet>>(`/outlets/${id}`);
    return response.data.data;
  },

  createOutlet: async (payload: OutletFormData): Promise<Outlet> => {
    const response = await apiClient.post<ApiResponse<Outlet>>('/outlets', payload);
    return response.data.data;
  },

  updateOutlet: async (id: string, payload: OutletFormData): Promise<Outlet> => {
    const response = await apiClient.put<ApiResponse<Outlet>>(`/outlets/${id}`, payload);
    return response.data.data;
  },

  updateOutletStatus: async (id: string, payload: StatusUpdateRequest): Promise<Outlet> => {
    const response = await apiClient.patch<ApiResponse<Outlet>>(`/outlets/${id}/status`, payload);
    return response.data.data;
  },

  // --------------------------------------------------
  // Machines API
  // --------------------------------------------------
  getMachines: async (params?: MachineFilterParams): Promise<PaginatedData<Machine>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<Machine>>>('/machines', {
      params,
    });
    return response.data.data;
  },

  getMachineById: async (id: string): Promise<Machine> => {
    const response = await apiClient.get<ApiResponse<Machine>>(`/machines/${id}`);
    return response.data.data;
  },

  createMachine: async (payload: Omit<MachineFormData, 'franchiseId'>): Promise<Machine> => {
    // Only send outletId and machine details to API as requested
    const response = await apiClient.post<ApiResponse<Machine>>('/machines', payload);
    return response.data.data;
  },

  updateMachine: async (id: string, payload: Omit<MachineFormData, 'franchiseId'>): Promise<Machine> => {
    const response = await apiClient.put<ApiResponse<Machine>>(`/machines/${id}`, payload);
    return response.data.data;
  },

  updateMachineStatus: async (id: string, payload: StatusUpdateRequest): Promise<Machine> => {
    const response = await apiClient.patch<ApiResponse<Machine>>(`/machines/${id}/status`, payload);
    return response.data.data;
  },

  // --------------------------------------------------
  // Products / Flavours API
  // --------------------------------------------------
  getProducts: async (params?: ProductFilterParams): Promise<PaginatedData<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<Product>>>('/products', {
      params,
    });
    return response.data.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  createProduct: async (payload: ProductFormData): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', payload);
    return response.data.data;
  },

  updateProduct: async (id: string, payload: ProductFormData): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, payload);
    return response.data.data;
  },

  updateProductStatus: async (id: string, payload: StatusUpdateRequest): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/status`, payload);
    return response.data.data;
  },

  // --------------------------------------------------
  // Suppliers API
  // --------------------------------------------------
  getSuppliers: async (params?: SupplierFilterParams): Promise<PaginatedData<Supplier>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<Supplier>>>('/suppliers', {
      params,
    });
    return response.data.data;
  },

  getSupplierById: async (id: string): Promise<Supplier> => {
    const response = await apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
    return response.data.data;
  },

  createSupplier: async (payload: SupplierFormData): Promise<Supplier> => {
    const response = await apiClient.post<ApiResponse<Supplier>>('/suppliers', payload);
    return response.data.data;
  },

  updateSupplier: async (id: string, payload: SupplierFormData): Promise<Supplier> => {
    const response = await apiClient.put<ApiResponse<Supplier>>(`/suppliers/${id}`, payload);
    return response.data.data;
  },

  updateSupplierStatus: async (id: string, payload: StatusUpdateRequest): Promise<Supplier> => {
    const response = await apiClient.patch<ApiResponse<Supplier>>(`/suppliers/${id}/status`, payload);
    return response.data.data;
  },

  // --------------------------------------------------
  // User Management API (SUPER_ADMIN only)
  // --------------------------------------------------
  getUsers: async (params?: UserFilterParams): Promise<PaginatedData<ManagedUser>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<ManagedUser>>>('/users', {
      params,
    });
    return response.data.data;
  },

  createUser: async (payload: CreateUserFormData): Promise<ManagedUser> => {
    const response = await apiClient.post<ApiResponse<ManagedUser>>('/users', payload);
    return response.data.data;
  },

  updateUser: async (id: string, payload: UpdateUserFormData): Promise<ManagedUser> => {
    const response = await apiClient.put<ApiResponse<ManagedUser>>(`/users/${id}`, payload);
    return response.data.data;
  },

  updateUserStatus: async (id: string, payload: StatusUpdateRequest): Promise<ManagedUser> => {
    const response = await apiClient.patch<ApiResponse<ManagedUser>>(`/users/${id}/status`, payload);
    return response.data.data;
  },

  // --------------------------------------------------
  // Franchise Owner Self-Service API
  // --------------------------------------------------
  getMyFranchise: async (): Promise<Franchise> => {
    const response = await apiClient.get<ApiResponse<Franchise>>('/my/franchise');
    return response.data.data;
  },

  getMyOutlets: async (): Promise<Outlet[]> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<Outlet> | Outlet[]>>('/my/outlets');
    const data = response.data.data;
    if (Array.isArray(data)) return data;
    if (data && 'content' in data && Array.isArray(data.content)) return data.content;
    return [];
  },

  getMyMachines: async (): Promise<Machine[]> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<Machine> | Machine[]>>('/my/machines');
    const data = response.data.data;
    if (Array.isArray(data)) return data;
    if (data && 'content' in data && Array.isArray(data.content)) return data.content;
    return [];
  },
};
