import React, { useState } from 'react';
import { ConfigProvider, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { HomePage, LoginPage } from './pages';
import { MainLayout } from './layouts';
import viVN from 'antd/locale/vi_VN';
import 'antd/dist/reset.css';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login'>('home');

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <ConfigProvider locale={viVN}>
      <div className="App">
        {currentPage === 'login' ? (
          <>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleHomeClick}
              style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
            </Button>
            {renderPage()}
          </>
        ) : (
          <MainLayout onLoginClick={handleLoginClick}>
            {renderPage()}
          </MainLayout>
        )}
      </div>
    </ConfigProvider>
  );
}

export default App;
