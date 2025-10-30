import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'MENTOR' | 'STUDENT';
}

/**
 * Protected Route Component
 * ⚠️ TEMPORARILY DISABLED FOR TESTING - ALLOW ALL ACCESS
 * TODO: Re-enable protection after testing
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  // All users can access all routes during testing
  return <>{children}</>;
};

export default ProtectedRoute;
