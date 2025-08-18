import { Component, type ReactNode } from 'react';
import { Button, Box, Typography } from '@mui/material';

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
          <Box className="min-h-screen flex items-center justify-center p-4">
            <Box className="text-center">
              <Typography variant="h5" component="h3" className="mt-2 text-sm font-semibold text-gray-900">
                Something went wrong
              </Typography>
              <Typography variant="body2" className="mt-1 text-sm text-gray-500">
                {this.state.error?.message || 'An unexpected error occurred'}
              </Typography>
              <Box className="mt-6 flex gap-4 justify-center">
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
                <Button variant="contained" onClick={this.handleReset}>
                  Try Again
                </Button>
              </Box>
            </Box>
          </Box>
        )
      );
    }

    return this.props.children;
  }
}
