import type { AxiosResponse, AxiosError } from 'axios';

// Generic API Response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Error Response type
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
  };
}

// Query params type
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

// Common CRUD endpoints type
export type CrudEndpoints<T> = {
  getAll: (params?: QueryParams) => Promise<AxiosResponse<PaginatedResponse<T>>>;
  getById: (id: string) => Promise<AxiosResponse<ApiResponse<T>>>;
  create: (data: Partial<T>) => Promise<AxiosResponse<ApiResponse<T>>>;
  update: (id: string, data: Partial<T>) => Promise<AxiosResponse<ApiResponse<T>>>;
  delete: (id: string) => Promise<AxiosResponse<ApiResponse<void>>>;
};

// Error handling type
export type ErrorHandler = (error: AxiosError<ApiError>) => void;
