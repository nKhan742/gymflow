import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePlatformAuthStore } from '../../../core/store/platformAuthStore';

interface IPlatformAdminProtectedRouteProps {
  children?: React.ReactNode;
}

export const PlatformAdminProtectedRoute: React.FC<IPlatformAdminProtectedRouteProps> = ({ children }) => {
  const { isPlatformAuthenticated } = usePlatformAuthStore();
  const location = useLocation();

  if (!isPlatformAuthenticated) {
    return <Navigate to="/platform-admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PlatformAdminProtectedRoute;
