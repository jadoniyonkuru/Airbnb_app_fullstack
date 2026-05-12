import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../app/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'GUEST' | 'HOST' | 'ADMIN';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to signin with return url
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // User doesn't have required role, redirect to their appropriate dashboard
    if (user?.role === 'HOST') {
      return <Navigate to="/host/dashboard" replace />;
    } else if (user?.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}