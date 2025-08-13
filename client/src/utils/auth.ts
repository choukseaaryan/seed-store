import api from '../services/api';
import type { AxiosError } from 'axios';

export async function checkAuthStatus() {
  try {
    const { data: user } = await api.get('/auth/me');
    return { isAuthenticated: true, user, isLoading: false };
  } catch (error) {
    // Only reset auth if it's a 401 error or network error
    const axiosError = error as AxiosError;
    if (!axiosError.response || axiosError.response.status === 401) {
      return { isAuthenticated: false, user: null, isLoading: false };
    }
    // For other errors, maintain current auth state but set loading to false
    return { isAuthenticated: false, user: null, isLoading: false };
  }
}
