import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Button, Avatar, Space, Drawer, message } from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
  MenuOutlined,
  CloseOutlined,
  BookOutlined,
  TeamOutlined,
  BankOutlined,
  UsergroupAddOutlined,
  CalendarOutlined,
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import './Navbar.css';

const { Header } = Layout;

/**
 * Navbar Component
 * Navigation bar với user menu, logout, role-based menu, welcome message
 */
export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isStudent, isMentor } = useAuth();
  const { logout } = useAuthStore();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    message.success('Đăng xuất thành công');
  };

  // Menu items based on user role
  const getMenuItems = () => {
    const items: any[] = [];

    if (isAdmin) {
      items.push(
        {
          label: 'Dashboard',
          key: '/dashboard',
          icon: <DashboardOutlined />,
          onClick: () => {
            navigate('/dashboard');
            setMobileDrawerOpen(false);
          },
        },
        {
          label: 'Quản Lý',
          key: 'admin-group',
          icon: <UsergroupAddOutlined />,
          children: [
            {
              label: 'Sinh Viên',
              key: '/users',
              icon: <UserOutlined />,
              onClick: () => {
                navigate('/users');
                setMobileDrawerOpen(false);
              },
            },
            {
              label: 'Khoá Học',
              key: '/courses',
              icon: <BookOutlined />,
              onClick: () => {
                navigate('/courses');
                setMobileDrawerOpen(false);
              },
            },
            {
              label: 'Ghi Danh',
              key: '/enrollments',
              icon: <TeamOutlined />,
              onClick: () => {
                navigate('/enrollments');
                setMobileDrawerOpen(false);
              },
            },
            {
              label: 'Giáo Viên',
              key: '/mentors',
              icon: <BankOutlined />,
              onClick: () => {
                navigate('/mentors');
                setMobileDrawerOpen(false);
              },
            },
            {
              label: 'Kỳ Học',
              key: '/semesters',
              icon: <CalendarOutlined />,
              onClick: () => {
                navigate('/semesters');
                setMobileDrawerOpen(false);
              },
            },
          ],
        }
      );
    }

    if (isStudent) {
      items.push({
        label: 'Bảng Điều Khiển',
        key: '/student-dashboard',
        icon: <DashboardOutlined />,
        onClick: () => {
          navigate('/student-dashboard');
          setMobileDrawerOpen(false);
        },
      });
    }

    if (isMentor) {
      items.push({
        label: 'Khoá Học',
        key: '/courses',
        icon: <BookOutlined />,
        onClick: () => {
          navigate('/courses');
          setMobileDrawerOpen(false);
        },
      });
    }

    return items;
  };

  // User menu dropdown
  const userMenuItems = [
    {
      label: (
        <div style={{ padding: '8px 0' }}>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>👋 Xin chào</div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
            {user?.fullName}
          </div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
            {user?.role === 'ADMIN' && '👨‍💼 Quản Trị Viên'}
            {user?.role === 'STUDENT' && '📚 Sinh Viên'}
            {user?.role === 'MENTOR' && '👨‍🏫 Giáo Viên'}
          </div>
        </div>
      ),
      key: 'profile',
      disabled: true,
    },
    {
      type: 'divider' as const,
    },
    {
      label: 'Đăng Xuất',
      key: 'logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const menuItems = getMenuItems();

  return (
    <>
      {/* Desktop Navbar */}
      <Header
        className="navbar-desktop"
        style={{
          background: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '2px solid #ff8c28'
        }}
      >
        {/* Logo */}
        <div
          className="navbar-logo"
          onClick={() => navigate(user ? '/welcome' : '/')}
          style={{ 
            cursor: 'pointer', 
            fontSize: '24px', 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #ff8c28 0%, #ff7a00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '120px'
          }}
        >
          🚀 EXE
        </div>

        {/* Main Menu - Desktop */}
        {user && menuItems.length > 0 && (
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ 
              flex: 1, 
              border: 'none',
              background: 'transparent'
            }}
          />
        )}

        {/* Right Side: Auth Buttons or User Profile */}
        <Space size="middle">
          {!user ? (
            // Not logged in - Show Login and Register buttons
            <>
              <Button 
                type="text"
                icon={<LoginOutlined />}
                onClick={() => navigate('/login')}
                style={{ 
                  color: '#ff8c28',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                Đăng Nhập
              </Button>
              <Button 
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => navigate('/register')}
                style={{ 
                  background: 'linear-gradient(135deg, #ff8c28 0%, #ff7a00 100%)',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Đăng Ký
              </Button>
            </>
          ) : (
            // Logged in - Show user profile with dropdown (minimal view)
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}>
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  src={user.avatar}
                  style={{ 
                    backgroundColor: 'linear-gradient(135deg, #ff8c28 0%, #ff7a00 100%)',
                    flexShrink: 0
                  }}
                />
                <div style={{ marginLeft: '8px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#333', lineHeight: '1.2' }}>
                    {user.fullName}
                  </div>
                </div>
              </div>
            </Dropdown>
          )}
        </Space>
      </Header>

      {/* Mobile Menu Button - appears only on small screens */}
      <div className="navbar-mobile-button">
        {!user && (
          <Space size="small">
            <Button 
              type="text"
              size="small"
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
              style={{ color: 'white' }}
            />
            <Button 
              type="text"
              size="small"
              icon={<UserAddOutlined />}
              onClick={() => navigate('/register')}
              style={{ color: 'white' }}
            />
          </Space>
        )}
        <Button
          type="text"
          icon={mobileDrawerOpen ? <CloseOutlined /> : <MenuOutlined />}
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          size="large"
          style={{ color: 'white' }}
        />
      </div>

      {/* Mobile Drawer Menu */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={[
            ...menuItems,
            user && {
              type: 'divider' as const,
            },
            user && {
              label: 'Đăng Xuất',
              key: 'logout',
              icon: <LogoutOutlined />,
              onClick: handleLogout,
            },
          ].filter(Boolean)}
        />
      </Drawer>
    </>
  );
};

export default Navbar;
