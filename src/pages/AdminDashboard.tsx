import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Card, 
  Typography, 
  Space,
  Avatar,
  Button
} from 'antd';
import { 
  DashboardOutlined,
  UserOutlined, 
  TeamOutlined,
  BookOutlined,
  BulbOutlined,
  SettingOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;

// Import components for each management section
const DashboardOverview = () => (
  <Card>
    <Title level={3}>Dashboard Tổng quan</Title>
    <Text>Chào mừng đến với hệ thống quản trị</Text>
  </Card>
);

const UserManagement = () => (
  <Card>
    <Title level={3}>Quản lý Người dùng</Title>
    <Text>Quản lý sinh viên và admin trong hệ thống</Text>
  </Card>
);

const RolePermissionManagement = () => (
  <Card>
    <Title level={3}>Quản lý Vai trò & Quyền</Title>
    <Text>Phân quyền và vai trò cho người dùng</Text>
  </Card>
);

const SemesterManagement = () => (
  <Card>
    <Title level={3}>Quản lý Học kỳ</Title>
    <Text>Quản lý thông tin các học kỳ</Text>
  </Card>
);

const CourseManagement = () => (
  <Card>
    <Title level={3}>Quản lý Khóa học</Title>
    <Text>Quản lý khóa học và môn học</Text>
  </Card>
);

const TeamManagement = () => (
  <Card>
    <Title level={3}>Quản lý Nhóm</Title>
    <Text>Quản lý các nhóm sinh viên và ứng dụng</Text>
  </Card>
);

const IdeaManagement = () => (
  <Card>
    <Title level={3}>Quản lý Ý tưởng</Title>
    <Text>Quản lý ý tưởng dự án của sinh viên</Text>
  </Card>
);

const EnvironmentManagement = () => (
  <Card>
    <Title level={3}>Quản lý Môi trường</Title>
    <Text>Quản lý môi trường phát triển và khóa học</Text>
  </Card>
);

const MentorManagement = () => (
  <Card>
    <Title level={3}>Quản lý Mentor</Title>
    <Text>Quản lý thông tin mentor/giảng viên</Text>
  </Card>
);

const SystemConfig = () => (
  <Card>
    <Title level={3}>Cấu hình Hệ thống</Title>
    <Text>Cài đặt và cấu hình hệ thống</Text>
  </Card>
);

const AdminDashboard: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('1');
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      component: DashboardOverview
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: 'Quản lý Người dùng',
      component: UserManagement
    },
    {
      key: '3',
      icon: <SafetyOutlined />,
      label: 'Vai trò & Quyền',
      component: RolePermissionManagement
    },
    {
      key: '4',
      icon: <CalendarOutlined />,
      label: 'Quản lý Học kỳ',
      component: SemesterManagement
    },
    {
      key: '5',
      icon: <BookOutlined />,
      label: 'Quản lý Khóa học',
      component: CourseManagement
    },
    {
      key: '6',
      icon: <TeamOutlined />,
      label: 'Quản lý Nhóm',
      component: TeamManagement
    },
    {
      key: '7',
      icon: <BulbOutlined />,
      label: 'Quản lý Ý tưởng',
      component: IdeaManagement
    },
    {
      key: '8',
      icon: <EnvironmentOutlined />,
      label: 'Quản lý Môi trường',
      component: EnvironmentManagement
    },
    {
      key: '9',
      icon: <FileTextOutlined />,
      label: 'Quản lý Mentor',
      component: MentorManagement
    },
    {
      key: '10',
      icon: <SettingOutlined />,
      label: 'Cấu hình Hệ thống',
      component: SystemConfig
    }
  ];

  const getCurrentComponent = () => {
    const currentItem = menuItems.find(item => item.key === selectedKey);
    if (currentItem) {
      const Component = currentItem.component;
      return <Component />;
    }
    return <DashboardOverview />;
  };

  const handleLogout = () => {
    // Logic logout sẽ được thêm sau
    console.log('Đăng xuất');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={250}
        style={{
          background: '#001529',
        }}
      >
        {/* Logo */}
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #1f2937'
        }}>
          <Title 
            level={4} 
            style={{ 
              color: '#fff', 
              margin: 0,
              display: collapsed ? 'none' : 'block'
            }}
          >
            Admin Panel
          </Title>
          {collapsed && (
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
              A
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ borderRight: 0 }}
        >
          {menuItems.map(item => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>

        {/* User Profile & Logout at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          borderTop: '1px solid #1f2937',
          background: '#001529'
        }}>
          {!collapsed ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <div>
                  <Text strong style={{ color: '#fff', fontSize: '14px' }}>
                    Admin User
                  </Text>
                  <br />
                  <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                    Quản trị viên
                  </Text>
                </div>
              </Space>
              <Button 
                type="text" 
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ 
                  color: '#8c8c8c',
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: '4px 0'
                }}
              >
                Đăng xuất
              </Button>
            </Space>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Avatar size="small" icon={<UserOutlined />} style={{ marginBottom: 8 }} />
              <Button 
                type="text" 
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ 
                  color: '#8c8c8c',
                  padding: '4px'
                }}
              />
            </div>
          )}
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header 
          style={{ 
            background: '#fff', 
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Title level={4} style={{ margin: 0, color: '#333' }}>
            {menuItems.find(item => item.key === selectedKey)?.label || 'Dashboard'}
          </Title>
        </Header>

        {/* Content */}
        <Content style={{ 
          padding: '24px',
          background: '#f0f2f5',
          minHeight: 'calc(100vh - 64px)'
        }}>
          {getCurrentComponent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;