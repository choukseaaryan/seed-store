import { useCallback } from 'react';
import { useToast } from './useToast';

export function useErrorHandler() {
  const { showToast } = useToast();

  const handleError = useCallback((error: unknown) => {
    if (error && typeof error === 'object' && 'response' in error) {
      // Server responded with error
      const responseError = error as { response: { data?: { message?: string | string[] } } };
      const message = responseError.response.data?.message || 'An error occurred';
      showToast({
        type: 'error',
        title: 'Error',
        message: Array.isArray(message) ? message[0] : message,
      });
    } else if (error && typeof error === 'object' && 'request' in error) {
      // Request made but no response
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to server',
      });
    } else {
      // Something else went wrong
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    }
  }, [showToast]);

  return { handleError };
}
