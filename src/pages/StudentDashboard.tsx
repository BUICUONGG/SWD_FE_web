import React from 'react';
import { 
  Layout, 
  Row, 
  Col, 
  Card, 
  Progress, 
  List, 
  Avatar,
  Button,
  Typography,
  Space,
  Tag,
  Calendar,
  Badge
} from 'antd';
import { 
  BookOutlined, 
  TeamOutlined, 
  BulbOutlined,
  TrophyOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

const StudentDashboard: React.FC = () => {
  // Mock data
  const courses = [
    {
      id: 1,
      title: 'Lập trình React cơ bản',
      progress: 75,
      instructor: 'TS. Nguyễn Văn A',
      status: 'Đang học',
    },
    {
      id: 2,
      title: 'Thiết kế UI/UX',
      progress: 45,
      instructor: 'ThS. Trần Thị B',
      status: 'Đang học',
    },
    {
      id: 3,
      title: 'Quản trị dự án',
      progress: 100,
      instructor: 'TS. Lê Văn C',
      status: 'Hoàn thành',
    },
  ];

  const teams = [
    {
      id: 1,
      name: 'Team Alpha',
      members: 4,
      project: 'Ứng dụng quản lý học tập',
      status: 'Đang thực hiện',
    },
    {
      id: 2,
      name: 'Team Beta',
      members: 3,
      project: 'Website bán hàng',
      status: 'Đã hoàn thành',
    },
  ];

  const ideas = [
    {
      id: 1,
      title: 'Ứng dụng học tiếng Anh bằng AI',
      description: 'Tạo ứng dụng sử dụng AI để dạy phát âm tiếng Anh...',
      likes: 25,
      status: 'Đang phát triển',
    },
    {
      id: 2,
      title: 'Hệ thống quản lý thư viện thông minh',
      description: 'Hệ thống quản lý sách với QR code và AI recommendation...',
      likes: 18,
      status: 'Ý tưởng',
    },
  ];

  const assignments = [
    { title: 'Bài tập React - Component', dueDate: '2025-10-05', status: 'pending' },
    { title: 'Thiết kế mockup trang web', dueDate: '2025-10-08', status: 'submitted' },
    { title: 'Báo cáo tiến độ dự án', dueDate: '2025-10-12', status: 'pending' },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Space align="start">
            <Avatar size={64} icon={<UserOutlined />} />
            <div>
              <Title level={2} style={{ margin: 0 }}>Xin chào, Nguyễn Văn A!</Title>
              <Text type="secondary">Sinh viên khoa Công nghệ thông tin</Text>
            </div>
          </Space>
        </div>

        {/* Stats Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <TrophyOutlined style={{ fontSize: '32px', color: '#faad14' }} />
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>3</div>
                  <div style={{ color: '#666' }}>Khóa học</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <TeamOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>2</div>
                  <div style={{ color: '#666' }}>Nhóm</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <BulbOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>2</div>
                  <div style={{ color: '#666' }}>Ý tưởng</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <FileTextOutlined style={{ fontSize: '32px', color: '#f5222d' }} />
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>5</div>
                  <div style={{ color: '#666' }}>Bài tập</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[16, 16]}>
          {/* Left Column */}
          <Col xs={24} lg={16}>
            {/* Courses */}
            <Card title="Khóa học của tôi" style={{ marginBottom: 16 }}>
              <List
                dataSource={courses}
                renderItem={(course) => (
                  <List.Item
                    actions={[
                      <Button type="primary" size="small">Tiếp tục học</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<BookOutlined />} />}
                      title={course.title}
                      description={`Giảng viên: ${course.instructor}`}
                    />
                    <div style={{ width: 200 }}>
                      <Progress 
                        percent={course.progress} 
                        size="small"
                        status={course.progress === 100 ? 'success' : 'active'}
                      />
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Teams */}
            <Card title="Nhóm của tôi" style={{ marginBottom: 16 }}>
              <List
                dataSource={teams}
                renderItem={(team) => (
                  <List.Item
                    actions={[
                      <Button size="small">Xem chi tiết</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<TeamOutlined />} />}
                      title={team.name}
                      description={
                        <div>
                          <div>Dự án: {team.project}</div>
                          <div>Thành viên: {team.members} người</div>
                        </div>
                      }
                    />
                    <Tag color={team.status === 'Đã hoàn thành' ? 'green' : 'blue'}>
                      {team.status}
                    </Tag>
                  </List.Item>
                )}
              />
            </Card>

            {/* Ideas */}
            <Card title="Ý tưởng của tôi">
              <List
                dataSource={ideas}
                renderItem={(idea) => (
                  <List.Item
                    actions={[
                      <Button size="small">Chỉnh sửa</Button>,
                      <span>❤️ {idea.likes}</span>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<BulbOutlined />} />}
                      title={idea.title}
                      description={idea.description}
                    />
                    <Tag color={idea.status === 'Đang phát triển' ? 'orange' : 'blue'}>
                      {idea.status}
                    </Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Assignments */}
            <Card title="Bài tập sắp hạn" style={{ marginBottom: 16 }}>
              <List
                size="small"
                dataSource={assignments}
                renderItem={(assignment) => (
                  <List.Item>
                    <div style={{ width: '100%' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                        {assignment.title}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary">
                          <CalendarOutlined /> {assignment.dueDate}
                        </Text>
                        <Tag color={assignment.status === 'submitted' ? 'green' : 'orange'}>
                          {assignment.status === 'submitted' ? 'Đã nộp' : 'Chưa nộp'}
                        </Tag>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Calendar */}
            <Card title="Lịch học">
              <Calendar 
                fullscreen={false}
                dateCellRender={(value) => {
                  const date = value.date();
                  if (date === 5 || date === 10 || date === 15) {
                    return <Badge status="success" />;
                  }
                  return null;
                }}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default StudentDashboard;