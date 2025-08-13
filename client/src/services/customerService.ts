import { createCrudService } from './crudService';
import type { Customer } from '../types/models';
import type { ApiResponse, PaginatedResponse } from '../types/api';
import api from './api';

const baseService = createCrudService<Customer>('customers');

export const customerService = {
  ...baseService,
  // Additional customer-specific endpoints
  getBills: (customerId: string) => 
    api.get<PaginatedResponse<any>>(`/customers/${customerId}/bills`),
  
  getTopCustomers: () => 
    api.get<ApiResponse<Customer[]>>('/customers/top'),
};
