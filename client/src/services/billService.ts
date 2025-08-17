import { createCrudService } from './crudService';
import type { Bill } from '../types/models';

const baseService = createCrudService<Bill>('bills');

export const billService = {
  ...baseService,
  // Additional bill-specific endpoints can be added here
};
