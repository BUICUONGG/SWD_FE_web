import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { userService } from '../services/userService';

const { Content } = Layout;

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      await userService.getCurrentUser();
      // Just load to verify user is authenticated
    } catch (error) {
      console.error('Failed to load user info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{
        background: '#f0f2f5',
        minHeight: '100vh',
        overflow: 'auto'
      }}>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            Đang tải...
          </div>
        ) : (
          children
        )}
      </Content>
    </Layout>
  );
};

export default StudentLayout;