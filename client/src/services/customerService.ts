import { createCrudService } from './crudService';
import type { Customer, Bill } from '../types/models';
import type { ApiResponse, PaginatedResponse, QueryParams } from '../types/api';
import api from './api';

const baseService = createCrudService<Customer>('customers');

export const customerService = {
  ...baseService,
  // Additional customer-specific endpoints
  getBills: (customerId: string, params?: QueryParams) => 
    api.get<PaginatedResponse<Bill>>(`/customers/${customerId}/bills`, { params }),
  
  getTopCustomers: () => 
    api.get<ApiResponse<Customer[]>>('/customers/top'),
};
