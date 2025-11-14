import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  List,
  Typography,
  Space,
  Button,
  Spin,
  Progress,
  Avatar,
  Tag,
  Timeline,
  Alert,
  Empty,
  Tooltip
} from 'antd';
import {
  BookOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userService, isApiError, isUserResponse } from '../services/userService';
import { courseService, isCourseListResponse } from '../services/courseService';
import { teamService, isApiError as isTeamApiError, isTeamListResponse } from '../services/teamService';
import type { User } from '../types/user';
import type { Course } from '../types/course';
import type { Team } from '../types/team';

const { Title, Text, Paragraph } = Typography;

interface MentorCourse extends Course {
  teams: Team[];
  totalTeams: number;
  totalMembers: number;
}

// TODO: These interfaces will be used when backend implements pending request endpoints
// interface JoinRequest {
//   requestId: number;
//   studentName: string;
//   studentEmail: string;
//   teamName: string;
//   teamId: number;
//   requestDate: string;
// }

// interface CreationRequest {
//   requestId: number;
//   studentName: string;
//   studentEmail: string;
//   teamName: string;
//   courseName: string;
//   description: string;
//   requestDate: string;
// }

const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<User | null>(null);
  const [courses, setCourses] = useState<MentorCourse[]>([]);
  const [error, setError] = useState<string | null>(null);

  // TODO: Enable these states when backend implements pending request endpoints
  // const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  // const [creationRequests, setCreationRequests] = useState<CreationRequest[]>([]);
  // const [processingRequest, setProcessingRequest] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current user (mentor)
        const userResponse = await userService.getCurrentUser();
        if (isApiError(userResponse)) {
          throw new Error(userResponse.message);
        }
        if (isUserResponse(userResponse)) {
          const mentorData = userResponse.data;
          setMentor(mentorData);
          
          // Fetch courses managed by this mentor
          const coursesResponse = await courseService.getAllCourses();
          if (!isApiError(coursesResponse) && isCourseListResponse(coursesResponse)) {
            // Filter courses where current mentor manages them
            const filteredCourses = coursesResponse.data
              .filter(course => course.mentorName === mentorData.fullName);
            
            // Fetch teams for each course
            const coursesWithTeams: MentorCourse[] = await Promise.all(
              filteredCourses.map(async (course) => {
                // Backend requires both courseId and mentorId
                const teamsResponse = await teamService.getTeamsByCourse(course.courseId, mentorData.userId);
                const teams = (!isTeamApiError(teamsResponse) && isTeamListResponse(teamsResponse)) 
                  ? teamsResponse.data 
                  : [];
                
                const totalMembers = teams.reduce((sum, team) => sum + (team.memberCount || 0), 0);
                
                return {
                  ...course,
                  teams,
                  totalTeams: teams.length,
                  totalMembers
                };
              })
            );
            
            setCourses(coursesWithTeams);
          }
        }

        // TODO: Pending request endpoints not yet implemented in backend
        // Need backend to implement:
        // - GET /api/teams/pending-join-requests
        // - GET /api/teams/pending-creation-requests
        // - POST /api/teams/join-request/{id}/approve
        // - POST /api/teams/join-request/{id}/reject
        // - POST /api/teams/creation-request/{id}/approve
        // - POST /api/teams/creation-request/{id}/reject
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // TODO: Implement these handlers when backend endpoints are ready
  // const handleApproveJoinRequest = async (requestId: number) => { ... }
  // const handleRejectJoinRequest = async (requestId: number) => { ... }
  // const handleApproveTeamCreation = async (requestId: number) => { ... }
  // const handleRejectTeamCreation = async (requestId: number) => { ... }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  const totalTeams = courses.reduce((sum, course) => sum + (course.totalTeams || 0), 0);
  const totalMembers = courses.reduce((sum, course) => sum + (course.totalMembers || 0), 0);
  const averageTeamSize = totalTeams > 0 ? Math.round(totalMembers / totalTeams) : 0;

  const recentActivities = courses.flatMap(course => 
    course.teams.slice(0, 2).map(team => ({
      id: `${course.courseId}-${team.id}`,
      title: `Nhóm "${team.name}" có ${team.members?.length || 0} thành viên trong lớp ${course.code}`,
      time: 'Gần đây',
      type: (team.members?.length || 0) >= 6 ? 'full' : 'active' // Assume max 6 members
    }))
  ).slice(0, 5);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'full':
        return <TeamOutlined style={{ color: '#ff7875' }} />;
      case 'active':
        return <TeamOutlined style={{ color: '#52c41a' }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'processing';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'Đang diễn ra';
      case 'COMPLETED':
        return 'Đã kết thúc';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Welcome Header */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
        <Row align="middle">
          <Col flex="auto">
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              👨‍🏫 Chào mừng, {mentor?.fullName || 'Giảng viên'}!
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: '8px 0 0 0', fontSize: '16px' }}>
              Quản lý khóa học, phê duyệt sinh viên và theo dõi tiến độ lớp học
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Avatar
                size={64}
                src={mentor?.avatarUrl}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#ffffff20', color: 'white' }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Khóa học quản lý"
              value={courses.length}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontSize: '28px' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Tổng số khóa học</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Tổng nhóm"
              value={totalTeams}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '28px' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Các nhóm đang hoạt động</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Tổng thành viên"
              value={totalMembers}
              prefix={<UserOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontSize: '28px' }}
              suffix="người"
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Trong tất cả các nhóm</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Trung bình"
              value={averageTeamSize}
              prefix={<TrophyOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontSize: '28px' }}
              suffix="người/nhóm"
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Kích thước nhóm TB</Text>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Left Column - Courses */}
        <Col xs={24} lg={16}>
          {/* Courses List */}
          <Card title={<><BookOutlined /> Danh sách khóa học quản lý</>} style={{ marginBottom: 16 }}>
            {courses.length === 0 ? (
              <Empty description="Bạn chưa quản lý khóa học nào" />
            ) : (
              <List
                dataSource={courses}
                renderItem={(course: MentorCourse) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{course.code.charAt(0)}</Avatar>}
                      title={
                        <Space>
                          <Text strong>{course.name}</Text>
                          <Tag color="blue">{course.code}</Tag>
                          <Tag color={getStatusColor(course.status)}>
                            {getStatusText(course.status)}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Space>
                            <UserOutlined />
                            <Text type="secondary">{mentor?.fullName}</Text>
                          </Space>
                          <Space>
                            <TeamOutlined />
                            <Text type="secondary">
                              {course.totalTeams} nhóm với {course.totalMembers} thành viên
                            </Text>
                          </Space>
                          <Space>
                            <CalendarOutlined />
                            <Text type="secondary">
                              {course.currentStudents}/{course.maxStudents} sinh viên đã đăng ký
                            </Text>
                          </Space>
                          <div>
                            <Text type="secondary" style={{ fontSize: '12px' }}>Tỉ lệ lấp đầy nhóm</Text>
                            <Progress
                              percent={course.totalTeams > 0 ? Math.round((course.totalMembers / (course.totalTeams * 5)) * 100) : 0}
                              size="small"
                              strokeColor={
                                course.totalMembers >= (course.totalTeams * 5 * 0.8)
                                  ? '#52c41a'
                                  : course.totalMembers >= (course.totalTeams * 5 * 0.5)
                                  ? '#faad14'
                                  : '#1890ff'
                              }
                            />
                          </div>
                        </Space>
                      }
                    />
                    <Space>
                      <Tooltip title="Quản lý nhóm">
                        <Button type="primary" icon={<TeamOutlined />} onClick={() => navigate(`/mentor/course/${course.courseId}/teams`)}>
                          {course.totalTeams} Nhóm
                        </Button>
                      </Tooltip>
                    </Space>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Right Column - Activities & Info */}
        <Col xs={24} lg={8}>
          {/* TODO: Pending request features will be added when backend implements these endpoints:
               - GET /api/teams/pending-join-requests
               - GET /api/teams/pending-creation-requests
               - POST /api/teams/join-request/{id}/approve
               - POST /api/teams/join-request/{id}/reject
               - POST /api/teams/creation-request/{id}/approve
               - POST /api/teams/creation-request/{id}/reject
          */}

          {/* Recent Activities */}
          <Card title={<><ClockCircleOutlined /> Hoạt động gần đây</>} style={{ marginBottom: 16 }}>
            {recentActivities.length === 0 ? (
              <Empty description="Chưa có hoạt động nào" />
            ) : (
              <Timeline>
                {recentActivities.map((activity) => (
                  <Timeline.Item key={activity.id} dot={getActivityIcon(activity.type)}>
                    <Space direction="vertical" size={4}>
                      <Text>{activity.title}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {activity.time}
                      </Text>
                    </Space>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Card>

          {/* Quick Actions */}
          <Card title="🚀 Thao tác nhanh">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button block size="large" icon={<TeamOutlined />}>
                📚 Danh sách khóa học
              </Button>
              <Button block size="large" icon={<BookOutlined />}>
                📊 Báo cáo chi tiết
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MentorDashboard;
