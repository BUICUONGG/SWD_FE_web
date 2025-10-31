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
  Badge,
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
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userService, isApiError, isUserResponse } from '../services/userService';
import { courseService, isCourseListResponse } from '../services/courseService';
import type { User } from '../types/user';
import type { Course } from '../types/course';

const { Title, Text, Paragraph } = Typography;

interface MentorCourse extends Course {
  enrollmentCount: number;
  approvedEnrollments: number;
  pendingEnrollments: number;
  completedEnrollments: number;
}

const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<User | null>(null);
  const [courses, setCourses] = useState<MentorCourse[]>([]);
  const [error, setError] = useState<string | null>(null);

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
          
          // Fetch courses managed by this mentor using mentorId
          // Note: Frontend doesn't have mentorId, so we'll use mentorName or fetch all and filter
          // For now, let's try to get courses by calling the API and match by mentorName
          const coursesResponse = await courseService.getAllCourses();
          if (!isApiError(coursesResponse) && isCourseListResponse(coursesResponse)) {
            // Filter courses where current mentor manages them
            const mentorCourses: MentorCourse[] = coursesResponse.data
              .filter(course => course.mentorName === mentorData.fullName)
              .map(course => ({
                ...course,
                enrollmentCount: course.currentStudents || 0,
                approvedEnrollments: Math.floor((course.currentStudents || 0) * 0.9),
                pendingEnrollments: Math.ceil((course.currentStudents || 0) * 0.1),
                completedEnrollments: Math.floor((course.currentStudents || 0) * 0.7)
              }));
            setCourses(mentorCourses);
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

  const totalStudents = courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
  const totalApproved = courses.reduce((sum, course) => sum + (course.approvedEnrollments || 0), 0);
  const totalPending = courses.reduce((sum, course) => sum + (course.pendingEnrollments || 0), 0);
  const totalCompleted = courses.reduce((sum, course) => sum + (course.completedEnrollments || 0), 0);

  const recentActivities = [
    { id: 1, title: 'Sinh viên Nguyễn Văn A đăng ký lớp CS445', time: '2 giờ trước', type: 'enrollment' },
    { id: 2, title: 'Phê duyệt đơn đăng ký của Trần Thị B', time: '4 giờ trước', type: 'approval' },
    { id: 3, title: 'Lớp CS440 hoàn thành 70% chương trình', time: '1 ngày trước', type: 'progress' },
    { id: 4, title: 'Hạn đăng ký nhóm cho lớp CS435 sắp tới', time: '3 ngày trước', type: 'deadline' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return <UserOutlined style={{ color: '#1890ff' }} />;
      case 'approval':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'progress':
        return <TrophyOutlined style={{ color: '#faad14' }} />;
      case 'deadline':
        return <ExclamationCircleOutlined style={{ color: '#ff7875' }} />;
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
              title="Tổng sinh viên"
              value={totalStudents}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '28px' }}
              suffix="người"
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Đã đăng ký</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Đã phê duyệt"
              value={totalApproved}
              prefix={<CheckCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontSize: '28px' }}
              suffix={`/ ${totalStudents}`}
            />
            <Progress percent={totalStudents > 0 ? Math.round((totalApproved / totalStudents) * 100) : 0} size="small" showInfo={false} strokeColor="#faad14" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Chờ phê duyệt"
              value={totalPending}
              prefix={<ExclamationCircleOutlined style={{ color: '#ff7875' }} />}
              valueStyle={{ color: '#ff7875', fontSize: '28px' }}
              suffix={`/ ${totalStudents}`}
            />
            <Badge count={totalPending} style={{ backgroundColor: '#ff7875' }} />
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
                              {course.enrollmentCount} sinh viên ({course.approvedEnrollments} phê duyệt, {course.pendingEnrollments} chờ)
                            </Text>
                          </Space>
                          <Space>
                            <CalendarOutlined />
                            <Text type="secondary">
                              Còn {course.maxStudents - course.currentStudents} chỗ trống
                            </Text>
                          </Space>
                          <div>
                            <Text type="secondary" style={{ fontSize: '12px' }}>Tỉ lệ hoàn thành</Text>
                            <Progress
                              percent={Math.round((course.completedEnrollments / (course.enrollmentCount || 1)) * 100)}
                              size="small"
                              strokeColor={
                                course.completedEnrollments >= (course.enrollmentCount * 0.8)
                                  ? '#52c41a'
                                  : course.completedEnrollments >= (course.enrollmentCount * 0.5)
                                  ? '#faad14'
                                  : '#1890ff'
                              }
                            />
                          </div>
                        </Space>
                      }
                    />
                    <Space>
                      <Tooltip title="Xem sinh viên">
                        <Button type="default" icon={<TeamOutlined />} onClick={() => navigate(`/mentor/course/${course.courseId}/students`)}>
                          Sinh viên
                        </Button>
                      </Tooltip>
                      <Tooltip title="Xem chi tiết">
                        <Button type="primary" icon={<ArrowRightOutlined />} onClick={() => navigate(`/mentor/course/${course.courseId}`)}>
                          Chi tiết
                        </Button>
                      </Tooltip>
                    </Space>
                  </List.Item>
                )}
              />
            )}
          </Card>

          {/* Enrollment Requests */}
          <Card title={<><CheckCircleOutlined /> Đơn đăng ký chờ phê duyệt</>}>
            {totalPending > 0 ? (
              <List
                dataSource={[
                  { id: 1, studentName: 'Nguyễn Văn A', courseName: 'Lập trình React', status: 'PENDING' },
                  { id: 2, studentName: 'Trần Thị B', courseName: 'Thiết kế UI/UX', status: 'PENDING' },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{item.studentName}</Text>
                          <Text type="secondary">xin tham gia</Text>
                          <Text strong>{item.courseName}</Text>
                        </Space>
                      }
                    />
                    <Space>
                      <Button type="primary" size="small">
                        Phê duyệt
                      </Button>
                      <Button danger size="small">
                        Từ chối
                      </Button>
                    </Space>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Không có đơn chờ phê duyệt" />
            )}
          </Card>
        </Col>

        {/* Right Column - Activities & Info */}
        <Col xs={24} lg={8}>
          {/* Recent Activities */}
          <Card title={<><ClockCircleOutlined /> Hoạt động gần đây</>} style={{ marginBottom: 16 }}>
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
          </Card>

          {/* Quick Stats */}
          <Card title={<><TrophyOutlined /> Thống kê</>} style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Tỉ lệ phê duyệt</Text>
                <div style={{ marginTop: 8 }}>
                  <Progress
                    type="circle"
                    percent={totalStudents > 0 ? Math.round((totalApproved / totalStudents) * 100) : 0}
                    width={80}
                    format={(percent) => `${percent}%`}
                  />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">Sinh viên hoàn thành</Text>
                <div style={{ marginTop: 8 }}>
                  <Progress
                    type="circle"
                    percent={totalStudents > 0 ? Math.round((totalCompleted / totalStudents) * 100) : 0}
                    width={80}
                    format={(percent) => `${percent}%`}
                    strokeColor="#52c41a"
                  />
                </div>
              </div>
            </Space>
          </Card>

          {/* Quick Actions */}
          <Card title="🚀 Thao tác nhanh">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" block size="large">
                ➕ Tạo khóa học mới
              </Button>
              <Button block size="large">
                📊 Báo cáo chi tiết
              </Button>
              <Button block size="large">
                ⚙️ Cài đặt
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MentorDashboard;
