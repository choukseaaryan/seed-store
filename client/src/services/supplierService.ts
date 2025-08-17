import { createCrudService } from './crudService';
import type { Supplier } from '../types/models';
import type { ApiResponse, PaginatedResponse, QueryParams } from '../types/api';
import api from './api';

const baseService = createCrudService<Supplier>('suppliers');

export const supplierService = {
  ...baseService,
  // Additional supplier-specific endpoints can be added here
};
