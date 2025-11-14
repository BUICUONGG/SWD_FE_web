import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  List,
  Typography,
  Space,
  Button,
  Spin,
  Avatar,
  Badge,
  Tag,
  Alert,
  Empty,
  Statistic,
  Progress
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  CrownOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  CalendarOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { teamService, isApiError as isTeamApiError, isTeamListResponse } from '../services/teamService';
import { courseService, isCourseResponse } from '../services/courseService';
import type { Team } from '../types/team';
import type { Course } from '../types/course';

const { Title, Text, Paragraph } = Typography;

const MentorTeamManagement: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!courseId) {
          setError('Không tìm thấy khóa học');
          return;
        }

        // Fetch course info
        const courseResponse = await courseService.getCourseById(parseInt(courseId));
        if (isCourseResponse(courseResponse)) {
          setCourse(courseResponse.data);
          
          // Fetch teams for this course using the course's mentorId
          const teamsResponse = await teamService.getTeamsByCourse(
            parseInt(courseId), 
            courseResponse.data.mentorId
          );
          if (!isTeamApiError(teamsResponse) && isTeamListResponse(teamsResponse)) {
            setTeams(teamsResponse.data);
          } else if (isTeamApiError(teamsResponse)) {
            setError(teamsResponse.message);
          }
        } else {
          throw new Error('Không thể tải thông tin khóa học');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleViewTeamDetail = (team: Team) => {
    setSelectedTeam(team);
  };

  const handleBackToList = () => {
    setSelectedTeam(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={{ padding: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/mentor/dashboard')}>
          Quay lại
        </Button>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error || 'Không tìm thấy khóa học'}
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      </div>
    );
  }

  // Show team detail view
  if (selectedTeam) {
    const leader = selectedTeam.members?.find(m => m.role === 'LEADER');
    const members = selectedTeam.members?.filter(m => m.role !== 'LEADER') || [];

    return (
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
        {/* Back Button */}
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToList}
          style={{ marginBottom: 16 }}
        >
          Quay lại danh sách nhóm
        </Button>

        {/* Team Info Card */}
        <Card 
          style={{ 
            marginBottom: 24, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            border: 'none' 
          }}
        >
          <Row align="middle">
            <Col flex="auto">
              <Space direction="vertical" size="small">
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  👥 {selectedTeam.name}
                </Title>
                {selectedTeam.description && (
                  <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '16px' }}>
                    {selectedTeam.description}
                  </Paragraph>
                )}
                <Space wrap>
                  <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                    <BookOutlined /> {course.name} ({course.code})
                  </Tag>
                  <Tag 
                    color={selectedTeam.status === 'ACTIVE' ? 'green' : 'default'} 
                    style={{ fontSize: '14px', padding: '4px 12px' }}
                  >
                    {selectedTeam.status}
                  </Tag>
                </Space>
              </Space>
            </Col>
            <Col>
              <div style={{ 
                textAlign: 'center', 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '12px',
                padding: '20px 40px'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>
                  {selectedTeam.currentMembers}/{selectedTeam.maxMembers}
                </div>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>Thành viên</Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Team Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Tổng thành viên"
                value={selectedTeam.members?.length || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Chỗ còn trống"
                value={selectedTeam.maxMembers - selectedTeam.currentMembers}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Tỷ lệ lấp đầy"
                value={Math.round((selectedTeam.currentMembers / selectedTeam.maxMembers) * 100)}
                suffix="%"
                prefix={<CrownOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Leader Section */}
        {leader && (
          <Card 
            title={
              <Space>
                <CrownOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <span>Nhóm trưởng</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Card
              hoverable
              style={{ border: '2px solid #faad14', background: '#fffbf0' }}
            >
              <Row align="middle" gutter={16}>
                <Col>
                  <Avatar 
                    size={64} 
                    src={leader.avatarUrl} 
                    icon={<UserOutlined />}
                    style={{ border: '3px solid #faad14' }}
                  />
                </Col>
                <Col flex="auto">
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Space>
                      <Text strong style={{ fontSize: '18px' }}>{leader.fullName}</Text>
                      <Tag icon={<CrownOutlined />} color="gold">
                        Nhóm trưởng
                      </Tag>
                    </Space>
                    <Text type="secondary">
                      <MailOutlined /> {leader.email}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <CalendarOutlined /> Vào nhóm: {leader.joinedAt ? new Date(leader.joinedAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </Text>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Card>
        )}

        {/* Members Section */}
        <Card 
          title={
            <Space>
              <TeamOutlined />
              <span>Danh sách thành viên ({members.length})</span>
            </Space>
          }
        >
          {members.length === 0 ? (
            <Empty description="Chưa có thành viên nào khác" />
          ) : (
            <List
              dataSource={members}
              renderItem={(member, index) => (
                <List.Item key={member.userId}>
                  <List.Item.Meta
                    avatar={
                      <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }}>
                        <Avatar 
                          size={48} 
                          src={member.avatarUrl} 
                          icon={<UserOutlined />}
                        />
                      </Badge>
                    }
                    title={
                      <Space>
                        <Text strong style={{ fontSize: '16px' }}>{member.fullName}</Text>
                        <Tag color="blue">Thành viên</Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">
                          <MailOutlined /> {member.email}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <CalendarOutlined /> Vào nhóm: {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    );
  }

  // Show teams list view
  const totalMembers = teams.reduce((sum, team) => sum + (team.memberCount || 0), 0);
  const fullTeams = teams.filter(t => t.status === 'CLOSED').length;
  const averageSize = teams.length > 0 ? Math.round(totalMembers / teams.length) : 0;

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/mentor/dashboard')}>
              Quay lại
            </Button>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                <BookOutlined /> {course.name} ({course.code})
              </Title>
              <Text type="secondary">Quản lý nhóm sinh viên</Text>
            </div>
          </Space>
        </Col>
      </Row>

      {/* Course Info Card */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Space direction="vertical">
              <div>
                <Text type="secondary">Giảng viên:</Text>
                <div><Text strong>{course.mentorName}</Text></div>
              </div>
              <div>
                <Text type="secondary">Số sinh viên:</Text>
                <div><Text strong>{course.currentStudents}/{course.maxStudents}</Text></div>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical">
              <div>
                <Text type="secondary">Trạng thái:</Text>
                <div>
                  <Tag color={course.status === 'IN_PROGRESS' ? 'green' : 'blue'}>
                    {course.status}
                  </Tag>
                </div>
              </div>
              <div>
                <Text type="secondary">Hạn tạo nhóm:</Text>
                <div>
                  <Text strong>
                    {course.teamFormationDeadline ? new Date(course.teamFormationDeadline).toLocaleDateString('vi-VN') : 'N/A'}
                  </Text>
                </div>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Tổng nhóm"
              value={teams.length}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontSize: '28px' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Các nhóm trong lớp</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Tổng thành viên"
              value={totalMembers}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '28px' }}
              suffix="người"
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Trong tất cả nhóm</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Nhóm đầy"
              value={fullTeams}
              prefix={<CrownOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontSize: '28px' }}
              suffix={`/ ${teams.length}`}
            />
            <Progress percent={teams.length > 0 ? Math.round((fullTeams / teams.length) * 100) : 0} size="small" showInfo={false} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Trung bình"
              value={averageSize}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontSize: '28px' }}
              suffix="người/nhóm"
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Kích thước nhóm TB</Text>
          </Card>
        </Col>
      </Row>

      {/* Teams List */}
      <Card title={<><TeamOutlined /> Danh sách nhóm ({teams.length})</>}>
        {teams.length === 0 ? (
          <Empty
            description="Chưa có nhóm nào trong lớp này"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={teams}
            renderItem={(team) => (
              <List.Item
                actions={[
                  <Button 
                    type="primary"
                    onClick={() => handleViewTeamDetail(team)}
                  >
                    Xem chi tiết
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      size={64} 
                      style={{ backgroundColor: '#1890ff', fontSize: '28px' }}
                      icon={<TeamOutlined />}
                    />
                  }
                  title={
                    <Space>
                      <Text strong style={{ fontSize: '18px' }}>{team.name}</Text>
                      <Tag color={team.status === 'OPENING' ? 'green' : 'blue'}>
                        {team.status === 'OPENING' ? 'Đang mở' : team.status}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space wrap>
                      <Tag color="blue" style={{ fontSize: '13px' }}>
                        <UserOutlined /> {team.memberCount || (team.members?.length ?? 0)} thành viên
                      </Tag>
                      <Tag color="cyan" style={{ fontSize: '13px' }}>
                        <CrownOutlined /> Nhóm trưởng: {team.leaderName}
                      </Tag>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default MentorTeamManagement;
