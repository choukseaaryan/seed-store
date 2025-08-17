import { createCrudService } from './crudService';
import type { ProductCategory } from '../types/models';
import type { ApiResponse, PaginatedResponse, QueryParams } from '../types/api';
import api from './api';

const baseService = createCrudService<ProductCategory>('product-categories');

export const productCategoryService = {
  ...baseService,
  // Additional product category-specific endpoints can be added here
};
