import { Component, type ReactNode } from 'react';
import { EmptyState, Button } from './ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in their child
 * component tree, logs those errors, and displays a fallback UI.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center p-4">
            <EmptyState
              title="Something went wrong"
              description={this.state.error?.message || 'An unexpected error occurred'}
              action={
                <div className="flex gap-4">
                  <Button onClick={() => window.location.reload()}>
                    Refresh Page
                  </Button>
                  <Button variant="primary" onClick={this.handleReset}>
                    Try Again
                  </Button>
                </div>
              }
            />
          </div>
        )
      );
    }

    return this.props.children;
  }
}
