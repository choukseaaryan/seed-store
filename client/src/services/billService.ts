import { createCrudService } from './crudService';
import type { Bill } from '../types/models';
import type { ApiResponse } from '../types/api';
import api from './api';

const baseService = createCrudService<Bill>('bills');

export interface CreateBillRequest {
  customerId?: string;
  paymentMethod: 'CASH' | 'CREDIT';
  billItems: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export const billService = {
  ...baseService,
  
  // Create a new bill with items
  createBill: async (data: CreateBillRequest): Promise<ApiResponse<Bill>> => {
    const response = await api.post<ApiResponse<Bill>>('/bills', data);
    return response.data;
  },
  
  // Get bill by invoice number
  getByInvoiceNo: async (invoiceNo: string): Promise<ApiResponse<Bill>> => {
    const response = await api.get<ApiResponse<Bill>>(`/bills/invoice/${invoiceNo}`);
    return response.data;
  },
  
  // Get recent bills
  getRecent: async (limit: number = 10): Promise<ApiResponse<Bill[]>> => {
    const response = await api.get<ApiResponse<Bill[]>>('/bills/recent', { params: { limit } });
    return response.data;
  }
};
