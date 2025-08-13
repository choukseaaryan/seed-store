import { toast } from 'react-hot-toast';
import { createElement } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

/**
 * Custom hook for displaying toast notifications
 * @returns {{ showToast: (options: ToastOptions) => void }} Object containing showToast function
 * @example
 * const { showToast } = useToast();
 * showToast({
 *   type: 'success',
 *   title: 'Success',
 *   message: 'Operation completed successfully'
 * });
 */
export function useToast() {
  const renderToastContent = (title: string, message: string) => {
    return createElement(
      'div',
      { className: 'flex flex-col' },
      createElement('span', { className: 'font-semibold' }, title),
      createElement('span', { className: 'text-sm' }, message)
    );
  };

  const showToast = (options: ToastOptions): void => {
    const { type, title, message, duration = 3000 } = options;
    const content = renderToastContent(title, message);

    switch (type) {
      case 'success':
        toast.success(content, { duration });
        break;
      case 'error':
        toast.error(content, { duration });
        break;
      case 'warning':
      case 'info':
      default:
        toast(content, { duration });
        break;
    }
  };

  return { showToast };
}
