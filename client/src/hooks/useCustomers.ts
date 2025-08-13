import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Customer } from '../types/models';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await api.get<Customer[]>('/customers');
      return data;
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      const { data } = await api.get<Customer>(`/customers/${id}`);
      return data;
    },
  });
}
