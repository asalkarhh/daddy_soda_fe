export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  data?: unknown;
  timestamp?: string;
  status?: number;
  errors?: Record<string, string> | string[];
}

export interface PublicStatusResponse {
  status?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedData<T> {
  content: T[];
  items?: T[];
  page?: number;
  number?: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type PaginatedResponse<T> = PaginatedData<T>;
