import { createCrudService } from './crudService';
import type { Product } from '../types/models';
import type { ApiResponse, PaginatedResponse, QueryParams } from '../types/api';
import api from './api';

const baseService = createCrudService<Product>('products');

export const productService = {
  ...baseService,
  // Additional product-specific endpoints
  updateStock: (id: string, quantity: number) => 
    api.patch<ApiResponse<Product>>(`/products/${id}/stock`, { quantity }),
  
  getByCategory: (categoryId: string, params?: QueryParams) => 
    api.get<PaginatedResponse<Product>>(`/products/category/${categoryId}`, { params }),
  
  getLowStock: (params?: QueryParams) => 
    api.get<PaginatedResponse<Product>>('/products/low-stock', { params }),
};
