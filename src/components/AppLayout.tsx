import { Outlet, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { MainLayout } from '../layouts';
import { TokenStorage } from '../utils/jwt';
import { authService, isApiError } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

export const AppLayout: React.FC = () => {
  const { isLoggedIn, userInfo, isInitialized } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      const accessToken = TokenStorage.getAccessToken();
      const refreshToken = TokenStorage.getRefreshToken();
      
      if (accessToken && refreshToken) {
        const response = await authService.logout(accessToken, refreshToken);
        if (isApiError(response)) {
          console.warn('Logout API failed:', response.message);
        } else {
          console.log('Logout success:', response.data);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenStorage.clearTokens();
      navigate('/');
      message.success("Đăng xuất thành công!");
      // Force a page reload to update auth state
      window.location.reload();
    }
  };

  const handleNavigate = (page: string) => {
    if (page === "home") {
      navigate('/');
    } else if (page === "dashboard") {
      if (userInfo.type === "admin") {
        navigate('/admin/dashboard');
      } else if (userInfo.type === "student") {
        navigate('/student/dashboard');
      }
    }
  };

  // Show loading while checking auth status
  if (!isInitialized) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '18px', 
            color: '#667eea',
            marginBottom: '16px'
          }}>
            🎓 SWD Academy
          </div>
          <div>Đang khởi tạo...</div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout 
      onLoginClick={handleLoginClick}
      isLoggedIn={isLoggedIn}
      userType={userInfo.type}
      userName={userInfo.name}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
    >
      <Outlet />
    </MainLayout>
  );
};