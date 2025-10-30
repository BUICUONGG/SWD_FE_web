import React from 'react';
import { Layout } from 'antd';
import { Header } from './Header';
import { Footer } from './Footer';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
  userType?: 'admin' | 'student' | null;
  userName?: string;
  onLogout?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  isLoggedIn = false,
  userType = null,
  userName,
  onLogout
}) => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header 
        isLoggedIn={isLoggedIn}
        userType={userType}
        userName={userName}
        onLogout={onLogout}
      />
      <Content style={{ 
        padding: '0',
        background: 'transparent',
        minHeight: 'calc(100vh - 140px)' // 70px header + 70px footer
      }}>
        {children}
      </Content>
      <Footer />
    </Layout>
  );
};