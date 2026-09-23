import { UserRole } from './auth.types';

// Pagination wrapper for backend response
export interface PaginatedData<T> {
  content: T[];
  page?: number;
  number?: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface StatusUpdateRequest {
  active: boolean;
}

// ----------------------------------------------------
// Franchise Types
// ----------------------------------------------------
export interface Franchise {
  id: string;
  franchiseCode: string;
  businessName: string;
  ownerName: string;
  mobile: string;
  email?: string;
  fssaiNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  outletsCount?: number;
}

export interface FranchiseFormData {
  franchiseCode: string;
  businessName: string;
  ownerName: string;
  mobile: string;
  email?: string;
  fssaiNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface FranchiseFilterParams {
  search?: string;
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  page?: number;
  size?: number;
}

// ----------------------------------------------------
// Outlet Types
// ----------------------------------------------------
export interface Outlet {
  id: string;
  outletCode: string;
  outletName: string;
  franchiseId: string;
  franchiseName?: string;
  franchiseCode?: string;
  contactPersonName?: string;
  contactMobile?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  active: boolean;
  createdAt?: string;
  machinesCount?: number;
}

export interface OutletFormData {
  franchiseId: string;
  outletCode: string;
  outletName: string;
  contactPersonName?: string;
  contactMobile?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface OutletFilterParams {
  franchiseId?: string;
  search?: string;
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  page?: number;
  size?: number;
}

// ----------------------------------------------------
// Machine Types
// ----------------------------------------------------
export interface Machine {
  id: string;
  machineCode: string;
  machineName?: string;
  outletId: string;
  outletName?: string;
  franchiseId?: string;
  franchiseName?: string;
  deviceId?: string;
  installationDate?: string;
  lastSeenAt?: string;
  active: boolean;
  createdAt?: string;
}

export interface MachineFormData {
  franchiseId?: string; // used in UI for cascading outlet lookup
  outletId: string;
  machineCode: string;
  machineName?: string;
  deviceId?: string;
  installationDate?: string;
}

export interface MachineFilterParams {
  franchiseId?: string;
  outletId?: string;
  search?: string;
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  page?: number;
  size?: number;
}

// ----------------------------------------------------
// Product / Flavour Types
// ----------------------------------------------------
export interface Product {
  id: string;
  itemCode: string;
  flavourName: string;
  bottleSizeLitre: number;
  defaultSellingPrice?: number;
  description?: string;
  active: boolean;
  createdAt?: string;
}

export interface ProductFormData {
  itemCode: string;
  flavourName: string;
  bottleSizeLitre: number;
  defaultSellingPrice?: number;
  description?: string;
}

export interface ProductFilterParams {
  search?: string;
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  page?: number;
  size?: number;
}

// ----------------------------------------------------
// Supplier Types
// ----------------------------------------------------
export interface Supplier {
  id: string;
  supplierCode: string;
  supplierName: string;
  contactPersonName?: string;
  mobile?: string;
  email?: string;
  gstin?: string;
  address?: string;
  active: boolean;
  createdAt?: string;
}

export interface SupplierFormData {
  supplierCode: string;
  supplierName: string;
  contactPersonName?: string;
  mobile?: string;
  email?: string;
  gstin?: string;
  address?: string;
}

export interface SupplierFilterParams {
  search?: string;
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  page?: number;
  size?: number;
}

// ----------------------------------------------------
// User Management Types (Super Admin)
// ----------------------------------------------------
export interface ManagedUser {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
  role: UserRole;
  franchiseId?: string;
  franchiseName?: string;
  active: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface CreateUserFormData {
  fullName: string;
  mobile: string;
  email?: string;
  temporaryPassword?: string;
  role: 'MANAGER' | 'FRANCHISE_OWNER';
  franchiseId?: string;
}

export interface UpdateUserFormData {
  fullName: string;
  mobile: string;
  email?: string;
  role: 'MANAGER' | 'FRANCHISE_OWNER';
  franchiseId?: string;
  temporaryPassword?: string;
}

export interface UserFilterParams {
  role?: 'ALL' | 'MANAGER' | 'FRANCHISE_OWNER';
  franchiseId?: string;
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  search?: string;
  page?: number;
  size?: number;
}
