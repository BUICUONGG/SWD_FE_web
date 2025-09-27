import React from 'react';
import { Layout } from 'antd';
import { Header } from './Header';
import { Footer } from './Footer';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  onLoginClick: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, onLoginClick }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header onLoginClick={onLoginClick} />
      <Content>
        {children}
      </Content>
      <Footer />
    </Layout>
  );
};