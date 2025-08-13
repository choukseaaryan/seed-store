import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from './ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Only show loading state for initial auth check
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated and not already on login page
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated or on login page, render children
  return <>{children}</>;
}
