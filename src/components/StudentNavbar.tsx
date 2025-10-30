import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Button,
  Badge,
  Tooltip,
  message,
  Space,
  Dropdown,
  Avatar
} from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  HistoryOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { TokenStorage } from '../utils/jwt';
import { userService, isApiError, isUserResponse } from '../services/userService';
import type { User } from '../types/user';

const { Header } = Layout;

interface StudentNavbarProps {
  currentPage?: string;
}

const StudentNavbar: React.FC<StudentNavbarProps> = ({ 
  currentPage = '/student/dashboard'
}) => {
  const [notifications] = useState(3);
  const [currentPath, setCurrentPath] = useState(currentPage);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const response = await userService.getCurrentUser();
      if (isApiError(response)) {
        console.error('Failed to load user:', response.message);
      } else if (isUserResponse(response)) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const getUserAvatar = () => {
    if (userInfo?.avatarUrl) {
      return userInfo.avatarUrl;
    }
    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#87d068'];
    const nameHash = (userInfo?.fullName || 'User').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = nameHash % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.fullName || 'Student')}&background=${colors[colorIndex].slice(1)}&color=fff&size=128&font-size=0.5`;
  };

  const handleLogout = () => {
    TokenStorage.clearTokens();
    message.success('Đăng xuất thành công!');
    window.location.href = '/login';
  };

  const userMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '📊 Bảng điều khiển',
      onClick: () => window.location.href = '/student/dashboard'
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '👤 Thông tin cá nhân',
      onClick: () => window.location.href = '/student/profile'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '⚙️ Cài đặt',
      onClick: () => window.location.href = '/student/settings'
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '🚪 Đăng xuất',
      danger: true,
      onClick: handleLogout
    }
  ];

  const menuItems = [
    {
      key: '/student/dashboard',
      icon: <DashboardOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/student/courses',
      icon: <BookOutlined />,
      label: 'Khám phá khóa học',
    },
    {
      key: '/student/enrollments',
      icon: <HistoryOutlined />,
      label: 'Lịch sử đăng ký',
    },
    {
      key: '/student/grades',
      icon: <FileTextOutlined />,
      label: 'Điểm số',
    },
    {
      key: '/student/schedule',
      icon: <CalendarOutlined />,
      label: 'Lịch học',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    setCurrentPath(key);
    window.location.href = key;
  };

  const handleNotificationClick = () => {
    message.info('Chức năng thông báo đang được phát triển');
  };

  return (
    <Header style={{ 
      padding: '0 24px', 
      background: '#fff', 
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Left side - Navigation Menu */}
      <Menu
        mode="horizontal"
        selectedKeys={[currentPath]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ 
          border: 'none',
          flex: 1,
          minWidth: 0
        }}
      />

      {/* Right side - Notifications and User */}
      <Space size={16}>
        <Tooltip title="Thông báo">
          <Badge count={notifications} size="small">
            <Button 
              type="text" 
              icon={<BellOutlined />} 
              onClick={handleNotificationClick}
              style={{ color: '#666' }}
            />
          </Badge>
        </Tooltip>

        {/* User Dropdown */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <Space
            style={{
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
            }}
          >
            <Avatar size={28} src={getUserAvatar()} icon={<UserOutlined />} />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#262626' }}>
                {userInfo?.fullName || 'Sinh viên'}
              </div>
              <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                {userInfo?.email || 'student@example.com'}
              </div>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default StudentNavbar;