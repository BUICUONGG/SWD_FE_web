import React, { useState } from 'react';
import { Layout, Button, Typography, Menu, Drawer, Avatar, Dropdown } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LoginOutlined, 
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined
} from '@ant-design/icons';
import './Header.css';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  isLoggedIn?: boolean;
  userType?: 'admin' | 'student' | null;
  userName?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isLoggedIn = false, 
  userType = null,
  userName,
  onLogout
}) => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const navigate = useNavigate();

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'dashboard') {
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else if (userType === 'student') {
        navigate('/student/dashboard');
      }
    } else if (key === 'logout') {
      onLogout?.();
    }
  };

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

  const mobileMenuItems = [
    ...(isLoggedIn ? [
      {
        key: 'dashboard',
        label: userType === 'admin' ? 'Quản trị' : 'Bảng điều khiển',
        icon: <DashboardOutlined />,
      },
      {
        key: 'logout',
        label: 'Đăng xuất',
        icon: <LogoutOutlined />,
        danger: true,
      }
    ] : [
      {
        key: 'login',
        label: <Link to="/login">Đăng nhập</Link>,
        icon: <LoginOutlined />,
      }
    ])
  ];

  const handleMobileMenuClick = ({ key }: { key: string }) => {
    if (key === 'dashboard') {
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else if (userType === 'student') {
        navigate('/student/dashboard');
      }
    } else if (key === 'logout') {
      onLogout?.();
    }
    setMobileMenuVisible(false);
  };

  return (
    <AntHeader style={{ 
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #f0f0f0',
      padding: '0 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: '70px',
      lineHeight: '70px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        height: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                fontSize: '24px', 
                marginRight: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🎓
              </div>
              <Title 
                level={3} 
                style={{ 
                  margin: 0, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600
                }}
              >
                SWD Academy
              </Title>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px'
          }} 
          className="desktop-nav"
        >
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Dropdown 
                menu={{ 
                  items: userMenuItems,
                  onClick: handleUserMenuClick
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button 
                  type="text"
                  style={{
                    height: '40px',
                    borderRadius: '20px',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid #e0e7ff',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                  }}
                >
                  <Avatar 
                    size="small" 
                    icon={<UserOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  />
                  <span style={{ 
                    color: '#1f2937',
                    fontWeight: '500',
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {userName || (userType === 'admin' ? 'Quản trị viên' : 'Sinh viên')}
                  </span>
                </Button>
              </Dropdown>
            </div>
          ) : (
            <Link to="/login">
              <Button 
                type="primary" 
                icon={<LoginOutlined />}
                style={{
                  height: '40px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  fontWeight: '500',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
              >
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuVisible(true)}
          style={{
            height: '40px',
            width: '40px',
            borderRadius: '8px'
          }}
          className="mobile-menu-btn"
        />
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              fontSize: '20px', 
              marginRight: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🎓
            </div>
            <span style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600
            }}>
              SWD Academy
            </span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
      >
        {isLoggedIn && (
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '12px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <Avatar 
              size={48} 
              icon={<UserOutlined />}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                marginBottom: '8px'
              }}
            />
            <div style={{ fontWeight: '500', color: '#1f2937' }}>
              {userName || (userType === 'admin' ? 'Quản trị viên' : 'Sinh viên')}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {userType === 'admin' ? 'Quản trị viên' : 'Sinh viên'}
            </div>
          </div>
        )}

        <Menu
          mode="vertical"
          items={mobileMenuItems}
          onClick={handleMobileMenuClick}
          style={{
            border: 'none',
            background: 'transparent'
          }}
        />
      </Drawer>
    </AntHeader>
  );
};