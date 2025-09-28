import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Card, 
  Typography, 
  Space,
  Avatar,
  Button,
  Table,
  Tag,
  Statistic,
  Row,
  Col,
  Progress,
  List,
  Tabs
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

// Fake data for the system
const fakeData = {
  statistics: {
    totalUsers: 1250,
    totalStudents: 1100,
    totalMentors: 45,
    totalAdmins: 5,
    activeSemesters: 2,
    totalCourses: 8,
    totalTeams: 85,
    totalIdeas: 120,
    pendingApplications: 23
  },
  recentActivities: [
    { id: 1, action: 'Sinh viên Nguyễn Văn A đăng ký khóa học SWD392', time: '2 phút trước', type: 'info' },
    { id: 2, action: 'Mentor Trần Thị B phê duyệt ý tưởng "E-commerce Platform"', time: '15 phút trước', type: 'success' },
    { id: 3, action: 'Nhóm 5 nộp báo cáo cuối kỳ', time: '1 giờ trước', type: 'warning' },
    { id: 4, action: 'Admin tạo học kỳ mới Fall 2025', time: '3 giờ trước', type: 'success' }
  ],
  topTeams: [
    { name: 'Team Alpha', members: 5, course: 'SWD392', progress: 95, status: 'Hoàn thành' },
    { name: 'Team Beta', members: 4, course: 'SWD391', progress: 80, status: 'Đang thực hiện' },
    { name: 'Team Gamma', members: 5, course: 'SWD392', progress: 75, status: 'Đang thực hiện' },
    { name: 'Team Delta', members: 4, course: 'SWD391', progress: 60, status: 'Đang thực hiện' }
  ]
};

// Import components for each management section
const DashboardOverview = () => (
  <div>
    {/* Statistics Cards */}
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Tổng người dùng"
            value={fakeData.statistics.totalUsers}
            valueStyle={{ color: '#3f8600' }}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Sinh viên"
            value={fakeData.statistics.totalStudents}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Mentors"
            value={fakeData.statistics.totalMentors}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Ứng dụng chờ duyệt"
            value={fakeData.statistics.pendingApplications}
            valueStyle={{ color: '#f5222d' }}
          />
        </Card>
      </Col>
    </Row>

    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title="Hoạt động gần đây" size="small">
          <List
            dataSource={fakeData.recentActivities}
            renderItem={item => (
              <List.Item>
                <Text style={{ fontSize: '14px' }}>
                  {item.action}
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {item.time}
                  </Text>
                </Text>
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Top Teams" size="small">
          <List
            dataSource={fakeData.topTeams}
            renderItem={item => (
              <List.Item>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text strong>{item.name}</Text>
                    <Tag color={item.progress >= 90 ? 'green' : item.progress >= 70 ? 'blue' : 'orange'}>
                      {item.status}
                    </Tag>
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                    <Text type="secondary">
                      {item.members} thành viên • {item.course}
                    </Text>
                  </div>
                  <Progress percent={item.progress} size="small" />
                </div>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  </div>
);

const UserManagement = () => {
  const userColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : role === 'mentor' ? 'blue' : 'green'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
        </Tag>
      ),
    },
  ];

  const userData = [
    {
      key: '1',
      id: 1,
      username: 'nguyenvana',
      email: 'nguyenvana@fpt.edu.vn',
      fullName: 'Nguyễn Văn A',
      role: 'student',
      status: 'active'
    },
    {
      key: '2',
      id: 2,
      username: 'tranthib',
      email: 'tranthib@fe.edu.vn',
      fullName: 'Trần Thị B',
      role: 'mentor',
      status: 'active'
    },
    {
      key: '3',
      id: 3,
      username: 'admin',
      email: 'admin@fpt.edu.vn',
      fullName: 'Quản trị viên',
      role: 'admin',
      status: 'active'
    },
    {
      key: '4',
      id: 4,
      username: 'levand',
      email: 'levand@fpt.edu.vn',
      fullName: 'Lê Văn D',
      role: 'student',
      status: 'active'
    },
    {
      key: '5',
      id: 5,
      username: 'phamthie',
      email: 'phamthie@fe.edu.vn',
      fullName: 'Phạm Thị E',
      role: 'mentor',
      status: 'inactive'
    },
  ];

  return (
    <Card>
      <Title level={3}>Quản lý Người dùng</Title>
      <Table 
        columns={userColumns} 
        dataSource={userData}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
};

const RolePermissionManagement = () => (
  <Card>
    <Title level={3}>Quản lý Vai trò & Quyền</Title>
    <Text>Phân quyền và vai trò cho người dùng</Text>
  </Card>
);

const SemesterManagement = () => {
  const semesterColumns = [
    {
      title: 'Tên học kỳ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã học kỳ',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Số khóa học',
      dataIndex: 'courseCount',
      key: 'courseCount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? 'green' : 
                     status === 'completed' ? 'blue' : 'orange';
        const text = status === 'active' ? 'Đang diễn ra' : 
                     status === 'completed' ? 'Hoàn thành' : 'Sắp bắt đầu';
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  const semesterData = [
    {
      key: '1',
      name: 'Fall 2025',
      code: 'FA25',
      startDate: '2025-09-01',
      endDate: '2025-12-20',
      courseCount: 4,
      status: 'active'
    },
    {
      key: '2',
      name: 'Summer 2025',
      code: 'SU25',
      startDate: '2025-05-15',
      endDate: '2025-08-30',
      courseCount: 2,
      status: 'completed'
    },
    {
      key: '3',
      name: 'Spring 2026',
      code: 'SP26',
      startDate: '2026-01-15',
      endDate: '2026-05-10',
      courseCount: 0,
      status: 'upcoming'
    },
  ];

  return (
    <Card>
      <Title level={3}>Quản lý Học kỳ</Title>
      <Table 
        columns={semesterColumns} 
        dataSource={semesterData}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

const CourseManagement = () => {
  const courseColumns = [
    {
      title: 'Mã khóa học',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Học kỳ',
      dataIndex: 'semester',
      key: 'semester',
    },
    {
      title: 'Mentor',
      dataIndex: 'mentor',
      key: 'mentor',
    },
    {
      title: 'Số nhóm',
      dataIndex: 'teamCount',
      key: 'teamCount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'completed' ? 'blue' : 'orange'}>
          {status === 'active' ? 'Đang diễn ra' : status === 'completed' ? 'Hoàn thành' : 'Sắp bắt đầu'}
        </Tag>
      ),
    },
  ];

  const courseData = [
    {
      key: '1',
      code: 'SWD392',
      name: 'Software Architecture and Design',
      semester: 'Fall 2025',
      mentor: 'Trần Thị B',
      teamCount: 12,
      status: 'active'
    },
    {
      key: '2',
      code: 'SWD391',
      name: 'Software Development Project',
      semester: 'Fall 2025',
      mentor: 'Nguyễn Văn C',
      teamCount: 15,
      status: 'active'
    },
    {
      key: '3',
      code: 'PRJ301',
      name: 'Java Web Application Development',
      semester: 'Summer 2025',
      mentor: 'Lê Thị D',
      teamCount: 8,
      status: 'completed'
    },
    {
      key: '4',
      code: 'SWP391',
      name: 'Software development project',
      semester: 'Spring 2026',
      mentor: 'Phạm Văn E',
      teamCount: 0,
      status: 'upcoming'
    },
  ];

  return (
    <Card>
      <Title level={3}>Quản lý Khóa học</Title>
      <Table 
        columns={courseColumns} 
        dataSource={courseData}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

const TeamManagement = () => {
  const teamColumns = [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Khóa học',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Thành viên',
      dataIndex: 'memberCount',
      key: 'memberCount',
    },
    {
      title: 'Ý tưởng',
      dataIndex: 'idea',
      key: 'idea',
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" style={{ width: '120px' }} />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? 'green' : 
                     status === 'completed' ? 'blue' : 
                     status === 'pending' ? 'orange' : 'red';
        const text = status === 'active' ? 'Hoạt động' : 
                     status === 'completed' ? 'Hoàn thành' : 
                     status === 'pending' ? 'Chờ duyệt' : 'Tạm dừng';
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  const teamData = [
    {
      key: '1',
      name: 'Team Alpha',
      course: 'SWD392',
      memberCount: 5,
      idea: 'E-commerce Platform',
      progress: 95,
      status: 'active'
    },
    {
      key: '2',
      name: 'Team Beta',
      course: 'SWD391',
      memberCount: 4,
      idea: 'Task Management System',
      progress: 80,
      status: 'active'
    },
    {
      key: '3',
      name: 'Team Gamma',
      course: 'SWD392',
      memberCount: 5,
      idea: 'Social Media App',
      progress: 75,
      status: 'active'
    },
    {
      key: '4',
      name: 'Team Delta',
      course: 'SWD391',
      memberCount: 4,
      idea: 'Learning Management System',
      progress: 60,
      status: 'active'
    },
    {
      key: '5',
      name: 'Team Epsilon',
      course: 'SWD392',
      memberCount: 3,
      idea: 'Food Delivery App',
      progress: 0,
      status: 'pending'
    },
  ];

  return (
    <Card>
      <Title level={3}>Quản lý Nhóm</Title>
      <Table 
        columns={teamColumns} 
        dataSource={teamData}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 900 }}
      />
    </Card>
  );
};

const IdeaManagement = () => {
  const ideaColumns = [
    {
      title: 'Tên ý tưởng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 300,
    },
    {
      title: 'Người tạo',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: 'Nhóm',
      dataIndex: 'team',
      key: 'team',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'approved' ? 'green' : 
                     status === 'rejected' ? 'red' : 'orange';
        const text = status === 'approved' ? 'Đã duyệt' : 
                     status === 'rejected' ? 'Từ chối' : 'Chờ duyệt';
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  const ideaData = [
    {
      key: '1',
      name: 'E-commerce Platform',
      description: 'Xây dựng nền tảng thương mại điện tử với tính năng thanh toán online, quản lý kho hàng và hệ thống đánh giá sản phẩm',
      owner: 'Nguyễn Văn A',
      team: 'Team Alpha',
      createdDate: '2025-09-15',
      status: 'approved'
    },
    {
      key: '2',
      name: 'Task Management System',
      description: 'Hệ thống quản lý công việc cho nhóm với tính năng phân công, theo dõi tiến độ và thống kê hiệu suất',
      owner: 'Trần Thị B',
      team: 'Team Beta',
      createdDate: '2025-09-20',
      status: 'approved'
    },
    {
      key: '3',
      name: 'Social Media App',
      description: 'Ứng dụng mạng xã hội với tính năng chia sẻ hình ảnh, video, tin nhắn và tương tác realtime',
      owner: 'Lê Văn C',
      team: 'Team Gamma',
      createdDate: '2025-09-22',
      status: 'pending'
    },
    {
      key: '4',
      name: 'Learning Management System',
      description: 'Hệ thống quản lý học tập với tính năng tạo khóa học, bài tập trực tuyến và theo dõi kết quả học tập',
      owner: 'Phạm Thị D',
      team: 'Team Delta',
      createdDate: '2025-09-25',
      status: 'pending'
    },
    {
      key: '5',
      name: 'Food Delivery App',
      description: 'Ứng dụng giao đồ ăn với tính năng đặt hàng, theo dõi shipper và thanh toán đa dạng',
      owner: 'Hoàng Văn E',
      team: 'Team Epsilon',
      createdDate: '2025-09-28',
      status: 'rejected'
    },
  ];

  return (
    <Card>
      <Title level={3}>Quản lý Ý tưởng</Title>
      <Table 
        columns={ideaColumns} 
        dataSource={ideaData}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />
    </Card>
  );
};

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