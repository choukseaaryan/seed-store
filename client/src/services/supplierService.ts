import { createCrudService } from './crudService';
import type { Supplier } from '../types/models';

const baseService = createCrudService<Supplier>('suppliers');

export const supplierService = {
  ...baseService,
};
