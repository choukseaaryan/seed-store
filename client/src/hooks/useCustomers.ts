import { useQuery } from '@tanstack/react-query';
import { customerService } from '../services';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await customerService.getAll();
      return response.data.data;
    },
  });
}

export function useCustomerSearch(searchTerm: string) {
  return useQuery({
    queryKey: ['customers', 'search', searchTerm],
    queryFn: async () => {
      const response = await customerService.getAll({ search: searchTerm });
      return response.data.data;
    },
    enabled: searchTerm.length > 0,
  });
}

export function useTopCustomers() {
  return useQuery({
    queryKey: ['customers', 'top'],
    queryFn: async () => {
      const response = await customerService.getTopCustomers();
      return response.data.data;
    },
  });
}

