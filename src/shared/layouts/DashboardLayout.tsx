import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard Layout Component
 * Layout cho authenticated pages (dashboard, admin pages)
 * Navbar được render globally từ App.tsx
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        {children}
      </Content>
    </Layout>
  );
};

export default DashboardLayout;
