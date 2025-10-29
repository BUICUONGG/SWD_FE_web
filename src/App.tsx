import { useState, useEffect } from "react";
import { ConfigProvider, message } from "antd";
import { HomePage, LoginPage, RegisterPage, AdminDashboard, StudentDashboard } from "./pages";
import { MainLayout } from "./layouts";
import { TokenStorage, getUserFromToken } from "./utils/jwt";
import { authService, isApiError } from "./services/authService";
import viVN from "antd/locale/vi_VN";
import "antd/dist/reset.css";
import "./App.css";

type PageType = "home" | "login" | "register" | "admin" | "student";
type UserType = "admin" | "student" | null;

interface UserInfo {
  type: UserType;
  name: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ type: null, name: "" });
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Check for existing token on app startup
  useEffect(() => {
    const checkAuthStatus = () => {
      if (TokenStorage.isLoggedIn()) {
        const token = TokenStorage.getAccessToken();
        if (token) {
          const user = getUserFromToken(token);
          if (user) {
            setIsLoggedIn(true);
            setUserInfo({ 
              type: user.role.toLowerCase() as UserType, 
              name: user.email 
            });
            
            // Redirect to appropriate dashboard
            if (user.isAdmin) {
              setCurrentPage("admin");
            } else if (user.isStudent) {
              setCurrentPage("student");
            }
          }
        }
      }
      setIsInitialized(true);
    };

    checkAuthStatus();
  }, []);

  const handleLoginClick = () => {
    setCurrentPage("login");
  };

  const handleRegisterClick = () => {
    setCurrentPage("register");
  };

  const handleBackToLogin = () => {
    setCurrentPage("login");
  };

  const handleAdminLogin = (userName?: string) => {
    setIsLoggedIn(true);
    setUserInfo({ type: "admin", name: userName || "Quản trị viên" });
    setCurrentPage("admin");
    message.success("Đăng nhập thành công!");
  };

  const handleStudentLogin = (userName?: string) => {
    setIsLoggedIn(true);
    setUserInfo({ type: "student", name: userName || "Sinh viên" });
    setCurrentPage("student");
    message.success("Đăng nhập thành công!");
  };

  const handleLogout = async () => {
    try {
      const accessToken = TokenStorage.getAccessToken();
      const refreshToken = TokenStorage.getRefreshToken();
      
      if (accessToken && refreshToken) {
        // Call logout API với cả 2 tokens
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
      // Clear local state regardless of API success/failure
      TokenStorage.clearTokens();
      setIsLoggedIn(false);
      setUserInfo({ type: null, name: "" });
      setCurrentPage("home");
      message.success("Đăng xuất thành công!");
    }
  };

  const handleNavigate = (page: string) => {
    if (page === "home") {
      setCurrentPage("home");
    } else if (page === "dashboard") {
      if (userInfo.type === "admin") {
        setCurrentPage("admin");
      } else if (userInfo.type === "student") {
        setCurrentPage("student");
      }
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return (
          <LoginPage
            onAdminLogin={handleAdminLogin}
            onStudentLogin={handleStudentLogin}
            onRegisterClick={handleRegisterClick}
          />
        );
      case "register":
        return (
          <RegisterPage
            onRegisterSuccess={handleBackToLogin}
            onBackToLogin={handleBackToLogin}
          />
        );
      case "admin":
        return <AdminDashboard />;
      case "student":
        return <StudentDashboard />;
      case "home":
      default:
        return <HomePage />;
    }
  };

  // Show loading while checking auth status
  if (!isInitialized) {
    return (
      <ConfigProvider locale={viVN}>
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
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider locale={viVN}>
      <div className="App">
        <MainLayout 
          onLoginClick={handleLoginClick}
          isLoggedIn={isLoggedIn}
          userType={userInfo.type}
          userName={userInfo.name}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        >
          {renderPage()}
        </MainLayout>
      </div>
    </ConfigProvider>
  );
}

export default App;
