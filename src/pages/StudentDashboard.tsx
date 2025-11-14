import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, Row, Col, List, Typography, Space, Button, Spin, 
  Avatar, Tag, Alert
} from 'antd';
import { 
  BookOutlined, UserOutlined
} from '@ant-design/icons';
import StudentLayout from '../components/StudentLayout';
import { userService, isApiError, isUserResponse } from '../services/userService';
import { teamService, isApiError as isTeamApiError, isTeamListResponse } from '../services/teamService';
import type { User } from '../types/user';
import type { Team } from '../types/team';

const { Title, Text, Paragraph } = Typography;

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current user
        const userResponse = await userService.getCurrentUser();
        if (isApiError(userResponse)) {
          throw new Error(userResponse.message);
        }
        if (isUserResponse(userResponse)) {
          setUser(userResponse.data);
        }

        // Fetch my teams
        if (userResponse.data?.userId) {
          try {
            console.log('📋 [StudentDashboard] Fetching teams for user:', userResponse.data.userId);
            const teamsResponse = await teamService.getMyTeams();
            console.log('📋 [StudentDashboard] Teams response:', teamsResponse);
            
            if (isTeamApiError(teamsResponse)) {
              console.warn('⚠️ [StudentDashboard] Cannot load teams:', teamsResponse.message);
              setMyTeams([]);
            } else if (isTeamListResponse(teamsResponse)) {
              const validTeams = teamsResponse.data.filter((t: any) => t != null);
              console.log('✅ [StudentDashboard] Loaded teams:', validTeams);
              setMyTeams(validTeams);
            } else {
              console.warn('⚠️ [StudentDashboard] Unexpected teams response format');
              setMyTeams([]);
            }
          } catch (teamErr) {
            console.error('❌ [StudentDashboard] Error fetching teams:', teamErr);
            setMyTeams([]);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div style={{ padding: '24px' }}>
          <Alert
            message="Lỗi tải dữ liệu"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            }
          />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        {/* Welcome Header */}
        <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
          <Row align="middle">
            <Col flex="auto">
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                👥 Chào mừng trở lại, {user?.fullName || 'Sinh viên'}!
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '16px' }}>
                Quản lý nhóm học của bạn một cách dễ dàng và hiệu quả!
              </Paragraph>
            </Col>
            <Col>
              <Space>
                <Avatar 
                  size={64} 
                  src={user?.avatarUrl} 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#ffffff20', color: 'white' }} 
                />
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Main Content */}
        <Row gutter={[16, 16]}>
          {/* Left Column */}
          <Col xs={24} lg={16}>
            {/* My Teams */}
            <Card 
              title={<><UserOutlined /> Nhóm của tôi ({myTeams.length})</> }
              extra={
                <Button 
                  type="primary" 
                  onClick={() => navigate('/student/groups')}
                >
                  Xem tất cả nhóm
                </Button>
              }
            >
              {myTeams.length === 0 ? (
                <Alert
                  message="Bạn chưa tham gia nhóm nào"
                  description="Hãy tham gia hoặc tạo nhóm mới để bắt đầu làm việc cùng nhau!"
                  type="info"
                  showIcon
                  action={
                    <Button 
                      type="primary" 
                      onClick={() => navigate('/student/groups')}
                    >
                      Tạo nhóm ngay
                    </Button>
                  }
                />
              ) : (
                <List
                  dataSource={myTeams.filter(t => t != null)}
                  renderItem={(team) => (
                    <List.Item
                      actions={[
                        <Button 
                          type="link" 
                          onClick={() => navigate(`/student/group/${team.id}`)}
                        >
                          Xem chi tiết
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar style={{ backgroundColor: '#1890ff' }} size="large">
                            {team.name.charAt(0).toUpperCase()}
                          </Avatar>
                        }
                        title={
                          <Space>
                            <Text strong>{team.name}</Text>
                            <Tag color={team.status === 'OPENING' ? 'green' : 'default'}>
                              {team.status === 'OPENING' ? 'Đang mở' : team.status}
                            </Tag>
                            {team.leaderId === user?.userId && (
                              <Tag color="gold">👑 Trưởng nhóm</Tag>
                            )}
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size={4}>
                            <Text type="secondary">Thành viên: {team.members?.length || 0} người</Text>
                            <Text type="secondary">Môn học: {team.courseName || 'N/A'}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
          
          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Quick Actions */}
            <Card title="🚀 Thao tác nhanh" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Button 
                  type="primary" 
                  icon={<UserOutlined />}
                  block 
                  size="large"
                  onClick={() => navigate('/student/groups')}
                >
                  👥 Quản lý nhóm
                </Button>
                <Button 
                  icon={<BookOutlined />}
                  block 
                  size="large"
                  onClick={() => navigate('/student/discover')}
                >
                  📚 Khóa học của tôi
                </Button>
              </Space>
            </Card>

            {/* Team Statistics */}
            <Card title="📊 Thống kê nhóm">
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <Text type="secondary">Tổng số nhóm đã tham gia</Text>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>
                    {myTeams.length}
                  </div>
                </div>
                <div>
                  <Text type="secondary">Vai trò trưởng nhóm</Text>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#faad14' }}>
                    {myTeams.filter(team => team.leaderId === user?.userId).length}
                  </div>
                </div>
                <div>
                  <Text type="secondary">Nhóm đang mở</Text>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>
                    {myTeams.filter(team => team.status === 'OPENING').length}
                  </div>
                </div>
              </Space>
            </Card>

            {/* Quick Info */}
            <Alert
              message="💡 Mẹo quản lý nhóm"
              description="Hãy thường xuyên giao tiếp với các thành viên trong nhóm để đảm bảo mọi người đều nắm rõ tiến độ công việc!"
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          </Col>
        </Row>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;