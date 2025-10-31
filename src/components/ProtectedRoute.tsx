import { Navigate } from 'react-router-dom';
import { TokenStorage, getUserFromToken } from '../utils/jwt';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Protected Route Component cho Admin
export const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = TokenStorage.getAccessToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = getUserFromToken(token);
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Protected Route Component cho Student
export const StudentProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = TokenStorage.getAccessToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = getUserFromToken(token);
  if (!user || !user.isStudent) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Protected Route Component cho Mentor
export const MentorProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = TokenStorage.getAccessToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = getUserFromToken(token);
  if (!user || !user.isMentor) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route - chuyển hướng nếu đã đăng nhập
export const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = TokenStorage.getAccessToken();
  
  if (token) {
    const user = getUserFromToken(token);
    if (user?.isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user?.isStudent) {
      return <Navigate to="/student/dashboard" replace />;
    }
    if (user?.isMentor) {
      return <Navigate to="/mentor/dashboard" replace />;
    }
  }

  return <>{children}</>;
};