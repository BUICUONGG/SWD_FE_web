import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import { HomePage, LoginPage, AdminDashboard, StudentDashboard } from './pages';
import { MainLayout } from './layouts';
import viVN from 'antd/locale/vi_VN';
import 'antd/dist/reset.css';
import './App.css';

type PageType = 'home' | 'login' | 'admin' | 'student';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleAdminLogin = () => {
    setCurrentPage('admin');
  };

  const handleStudentLogin = () => {
    setCurrentPage('student');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage 
            onAdminLogin={handleAdminLogin}
            onStudentLogin={handleStudentLogin}
          />
        );
      case 'admin':
        return <AdminDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <ConfigProvider locale={viVN}>
      <div className="App">
        {currentPage === 'home' ? (
          <MainLayout onLoginClick={handleLoginClick}>
            {renderPage()}
          </MainLayout>
        ) : (
          renderPage()
        )}
      </div>
    </ConfigProvider>
  );
}

export default App;
