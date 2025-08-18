import React, { useRef, useEffect, forwardRef } from 'react';
import { useKeyboard } from '../hooks/useKeyboard';

interface FocusableElementProps {
  children: React.ReactElement;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
  tabIndex?: number;
  'data-testid'?: string;
}

export const FocusableElement = forwardRef<HTMLElement, FocusableElementProps>(
  ({ children, onFocus, onBlur, onKeyDown, className, tabIndex = 0, ...props }, ref) => {
    const elementRef = useRef<HTMLElement>(null);
    const isMountedRef = useRef(true);
    const { registerFocusableElement, unregisterFocusableElement, isKeyboardMode } = useKeyboard();

    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    useEffect(() => {
      const element = elementRef.current;
      if (element && isMountedRef.current) {
        registerFocusableElement(element);
        return () => {
          if (isMountedRef.current) {
            unregisterFocusableElement(element);
          }
        };
      }
    }, [registerFocusableElement, unregisterFocusableElement]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isKeyboardMode) {
        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (elementRef.current) {
              elementRef.current.click();
            }
            break;
          case 'Escape':
            e.preventDefault();
            // Close any open modals or return to previous state
            break;
        }
      }
      
      onKeyDown?.(e);
    };

    const handleFocus = () => {
      onFocus?.();
    };

    const handleBlur = () => {
      onBlur?.();
    };

    // Use a div wrapper to avoid TypeScript issues with cloneElement
    return (
      <div
        ref={(node) => {
          if (node) {
            elementRef.current = node;
            if (ref) {
              if (typeof ref === 'function') {
                ref(node);
              } else {
                ref.current = node;
              }
            }
          }
        }}
        tabIndex={tabIndex}
        className={`focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className || ''}`.trim()}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FocusableElement.displayName = 'FocusableElement';
