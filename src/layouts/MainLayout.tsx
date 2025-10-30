import React from 'react';
import { Layout } from 'antd';
import { Footer } from './Footer';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Navbar is now rendered by App.tsx globally, no need to include it here */}
      <Content>
        {children}
      </Content>
      <Footer />
    </Layout>
  );
};