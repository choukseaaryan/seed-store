import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types/api';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const separator = config.url?.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}_t=${timestamp}`;

    // Add any auth headers if needed (in addition to cookies)
    // const token = localStorage.getItem('additional_auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (!error.response) {
      // Network error
      return Promise.reject({
        message: 'Network error - please check your connection',
        status: 0,
      });
    }

    switch (error.response.status) {
      case 401:
        // Unauthorized - redirect to login if not at login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
      
      case 403:
        // Forbidden - user doesn't have necessary permissions
        break;
      
      case 404:
        // Not found
        break;
      
      case 422:
        // Validation error
        break;
      
      case 429:
        // Too many requests
        break;
      
      case 500:
      case 501:
      case 502:
      case 503:
        // Server errors
        break;
    }

    return Promise.reject(error.response.data);
  }
);

export default api;
