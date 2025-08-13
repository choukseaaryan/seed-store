import type { CrudEndpoints, QueryParams } from '../types/api';
import api from './api';

export function createCrudService<T>(endpoint: string): CrudEndpoints<T> {
  return {
    getAll: (params?: QueryParams) => api.get(`/${endpoint}`, { params }),
    getById: (id: string) => api.get(`/${endpoint}/${id}`),
    create: (data: Partial<T>) => api.post(`/${endpoint}`, data),
    update: (id: string, data: Partial<T>) => api.put(`/${endpoint}/${id}`, data),
    delete: (id: string) => api.delete(`/${endpoint}/${id}`),
  };
}
