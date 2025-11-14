import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  ApartmentOutlined,
  TeamOutlined,
  CalendarOutlined,
  UsergroupAddOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { CourseManagement } from '../components/CourseManagement';
import { EnrollmentManagement } from '../components/EnrollmentManagement';
import { MajorManagement } from '../components/MajorManagement';
import { MentorProfileManagement } from '../components/MentorProfileManagement';
import { SemesterManagement } from '../components/SemesterManagement';
import UserManagement from '../components/UserManagement';
import AdminReportDashboard from './AdminReportDashboard';

const { Sider, Content } = Layout;

type MenuKey = 'dashboard' | 'courses' | 'enrollments' | 'majors' | 'mentors' | 'semesters' | 'users';

const AdminDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState<MenuKey>('dashboard');

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: 'Quản lý Khóa học',
    },
    {
      key: 'enrollments',
      icon: <UserOutlined />,
      label: 'Quản lý Đăng ký',
    },
    {
      key: 'majors',
      icon: <ApartmentOutlined />,
      label: 'Quản lý Chuyên ngành',
    },
    {
      key: 'mentors',
      icon: <TeamOutlined />,
      label: 'Quản lý Giảng viên',
    },
    {
      key: 'semesters',
      icon: <CalendarOutlined />,
      label: 'Quản lý Kỳ học',
    },
    {
      key: 'users',
      icon: <UsergroupAddOutlined />,
      label: 'Quản lý Người dùng',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <AdminReportDashboard />;
      case 'courses':
        return <CourseManagement />;
      case 'enrollments':
        return <EnrollmentManagement />;
      case 'majors':
        return <MajorManagement />;
      case 'mentors':
        return <MentorProfileManagement />;
      case 'semesters':
        return <SemesterManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <AdminReportDashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        }}
        width={250}
      >
        {/* Logo */}
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 24px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <div style={{ color: '#fff', fontSize: '18px', fontWeight: 600 }}>
            {collapsed ? '🎓' : '🎓 SWD Admin'}
          </div>
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key as MenuKey)}
          style={{
            background: 'transparent',
            border: 'none',
            marginTop: '16px',
          }}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        {/* Header */}
        <div
          style={{
            background: '#fff',
            padding: '0 16px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <div style={{ marginLeft: '16px', fontSize: '16px', fontWeight: 500 }}>
            {selectedKey === 'dashboard' && 'Tổng quan'}
            {selectedKey === 'courses' && 'Quản lý Khóa học'}
            {selectedKey === 'enrollments' && 'Quản lý Đăng ký'}
            {selectedKey === 'majors' && 'Quản lý Chuyên ngành'}
            {selectedKey === 'mentors' && 'Quản lý Giảng viên'}
            {selectedKey === 'semesters' && 'Quản lý Kỳ học'}
            {selectedKey === 'users' && 'Quản lý Người dùng'}
          </div>
        </div>

        {/* Content */}
        <Content
          style={{
            background: '#f0f2f5',
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;