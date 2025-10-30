import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Space } from 'antd';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onLoginClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate('/login');
    }
  };

  return (
    <AntHeader style={{ 
      background: 'linear-gradient(135deg, #ff8c28 0%, #ff7a00 100%)',
      boxShadow: '0 4px 16px rgba(255, 140, 40, 0.15)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '3px solid #e67300'
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{ 
          cursor: 'pointer', 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: 'white',
          letterSpacing: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        🚀 EXE
      </div>

      {/* Navigation */}
      <Space size="large">
        <Button 
          type="text" 
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
          style={{ color: 'white', fontWeight: '500' }}
        >
          Trang chủ
        </Button>
      </Space>

      {/* Login Button */}
      <Button 
        type="primary" 
        icon={<LoginOutlined />}
        onClick={handleLoginClick}
        size="large"
        style={{ 
          background: 'white',
          color: '#ff8c28',
          borderColor: 'white',
          fontWeight: '600'
        }}
      >
        Đăng nhập
      </Button>
    </AntHeader>
  );
};