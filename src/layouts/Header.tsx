import React, { useState } from 'react';
import { Layout, Button, Typography, Menu, Drawer, Avatar, Dropdown } from 'antd';
import { 
  LoginOutlined, 
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  onLoginClick?: () => void;
  isLoggedIn?: boolean;
  userType?: 'admin' | 'student' | null;
  userName?: string;
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onLoginClick, 
  isLoggedIn = false, 
  userType = null,
  userName,
  onLogout,
  onNavigate 
}) => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const userMenuItems = [
    {
      key: 'dashboard',
      label: userType === 'admin' ? 'Quản trị' : 'Bảng điều khiển',
      icon: <DashboardOutlined />,
    },
    {
      key: 'settings',
      label: 'Cài đặt',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'logout') {
      onLogout?.();
    } else {
      onNavigate?.(e.key);
    }
  };

  return (
    <>
      <AntHeader style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: '70px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => onNavigate?.('home')}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '8px 16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Title level={3} style={{ 
              margin: 0, 
              color: '#fff',
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              🎓 SWD Academy
            </Title>
          </div>
        </div>

        {/* Desktop Navigation - Removed */}

        {/* User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isLoggedIn ? (
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleMenuClick,
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="text"
                style={{
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '25px',
                  padding: '4px 16px 4px 4px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  style={{ background: '#fff', color: '#667eea' }}
                />
                <span style={{ fontWeight: 500 }}>
                  {userName || (userType === 'admin' ? 'Admin' : 'Sinh viên')}
                </span>
              </Button>
            </Dropdown>
          ) : (
            <Button 
              type="primary" 
              icon={<LoginOutlined />}
              onClick={onLoginClick}
              size="large"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '25px',
                color: '#fff',
                fontWeight: 600,
                height: '40px',
                padding: '0 24px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Đăng nhập
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(true)}
            style={{
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.1)',
              display: 'none'
            }}
            className="mobile-menu-btn"
          />
        </div>
      </AntHeader>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎓</span>
            <span style={{ color: '#667eea', fontWeight: 700 }}>SWD Academy</span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
      >
        <Menu
          mode="vertical"
          style={{ border: 'none' }}
        >
          {!isLoggedIn && (
            <Menu.Item 
              key="login" 
              icon={<LoginOutlined />}
              onClick={onLoginClick}
              style={{ marginTop: '16px', color: '#667eea' }}
            >
              Đăng nhập
            </Menu.Item>
          )}
        </Menu>
      </Drawer>

      {/* CSS for responsive */}
      <style>{`
        @media (max-width: 767px) {
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
};