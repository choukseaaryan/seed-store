import { createCrudService } from './crudService';
import type { ProductCategory } from '../types/models';

const baseService = createCrudService<ProductCategory>('product-categories');

export const productCategoryService = {
  ...baseService,
};
