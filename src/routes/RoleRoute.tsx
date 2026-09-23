import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/auth.types';
import { LoadingScreen } from '../components/common/LoadingScreen';

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
