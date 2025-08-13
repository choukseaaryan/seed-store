import { type InputHTMLAttributes, forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={classNames(
            'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
            'placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6',
            error ? 'ring-red-500' : '',
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
