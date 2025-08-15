import type { ButtonHTMLAttributes } from 'react';
import { classNames } from '../../utils/helpers';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  isLoading,
  disabled,
  ...props 
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-focus text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={classNames(
        'font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Loading...
        </div>
      ) : children}
    </button>
  );
}
