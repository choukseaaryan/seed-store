import { useCallback } from 'react';
import { useToast } from './useToast';

export function useErrorHandler() {
  const { showToast } = useToast();

  const handleError = useCallback((error: any) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      showToast({
        type: 'error',
        title: 'Error',
        message: Array.isArray(message) ? message[0] : message,
      });
    } else if (error.request) {
      // Request made but no response
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to server',
      });
    } else {
      // Something else went wrong
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'An unexpected error occurred',
      });
    }
  }, [showToast]);

  return { handleError };
}
