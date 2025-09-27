import React from 'react';
import { Layout, Button, Typography, Space } from 'antd';
import { LoginOutlined, HomeOutlined, InfoCircleOutlined, PhoneOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  return (
    <AntHeader style={{ 
      background: '#fff', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Logo */}
      <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
        SWD FE Web
      </Title>

      {/* Navigation */}
      <Space size="large" className="hidden md:flex">
        <Button type="text" icon={<HomeOutlined />}>
          Trang chủ
        </Button>
        <Button type="text" icon={<InfoCircleOutlined />}>
          Giới thiệu
        </Button>
        <Button type="text" icon={<PhoneOutlined />}>
          Liên hệ
        </Button>
      </Space>

      {/* Login Button */}
      <Button 
        type="primary" 
        icon={<LoginOutlined />}
        onClick={onLoginClick}
        size="large"
      >
        Đăng nhập
      </Button>
    </AntHeader>
  );
};