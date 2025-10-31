import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, Row, Col, Statistic, List, Typography, Space, Button, Spin, 
  Progress, Avatar, Badge, Tag, Timeline, Alert
} from 'antd';
import { 
  BookOutlined, ClockCircleOutlined, TrophyOutlined, CalendarOutlined,
  ExclamationCircleOutlined, BellOutlined,
  FileTextOutlined, UserOutlined, StarOutlined, FireOutlined
} from '@ant-design/icons';
import StudentLayout from '../components/StudentLayout';
import { userService, isApiError, isUserResponse } from '../services/userService';
import { enrollmentService, isApiError as isEnrollmentApiError, isEnrollmentListResponse } from '../services/enrollmentService';
import { courseService, isApiError as isCourseApiError, isCourseResponse } from '../services/courseService';
import type { User } from '../types/user';
import type { Enrollment } from '../types/enrollment';
import type { Course as CourseType } from '../types/course';

const { Title, Text, Paragraph } = Typography;

interface Activity {
  id: number;
  title: string;
  time: string;
  type: 'assignment' | 'exam' | 'grade' | 'course' | 'notification';
  status?: 'completed' | 'pending' | 'late';
}

interface Course {
  id: number;
  name: string;
  code: string;
  instructor: string;
  progress: number;
  nextClass: string;
  status: 'active' | 'completed' | 'upcoming';
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseType[]>([]);
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

        // Fetch user enrollments
        if (userResponse.data?.userId) {
          const enrollmentsResponse = await enrollmentService.getEnrollmentsByUser(userResponse.data.userId);
          if (isEnrollmentApiError(enrollmentsResponse)) {
            throw new Error(enrollmentsResponse.message);
          }
          if (isEnrollmentListResponse(enrollmentsResponse)) {
            setEnrollments(enrollmentsResponse.data);
            
            // Fetch course details for each enrollment
            const coursePromises = enrollmentsResponse.data.map(async (enrollment) => {
              const courseResponse = await courseService.getCourseById(enrollment.courseId);
              if (isCourseApiError(courseResponse)) {
                console.error(`Failed to fetch course ${enrollment.courseId}:`, courseResponse.message);
                return null;
              }
              if (isCourseResponse(courseResponse)) {
                return courseResponse.data;
              }
              return null;
            });

            const courseResults = await Promise.all(coursePromises);
            const validCourses = courseResults.filter((course): course is CourseType => course !== null);
            setEnrolledCourses(validCourses);
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

  // Generate activities from enrollment data
  const enrollmentActivities: Activity[] = enrollments.slice(0, 3).map((enrollment) => ({
    id: enrollment.enrollmentId,
    title: `Đăng ký thành công lớp ${enrollment.courseName}`,
    time: new Date(enrollment.enrollmentDate).toLocaleDateString('vi-VN'),
    type: 'course' as const,
    status: enrollment.status === 'APPROVED' ? 'completed' : 'pending'
  }));

  const activities: Activity[] = [
    ...enrollmentActivities,
    { 
      id: 1001, 
      title: 'Nộp bài tập Lập trình React', 
      time: '2 giờ trước', 
      type: 'assignment',
      status: 'completed'
    },
    { 
      id: 1002, 
      title: 'Kiểm tra giữa kỳ môn UI/UX', 
      time: '1 ngày trước', 
      type: 'exam',
      status: 'pending'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case 'exam': return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'grade': return <TrophyOutlined style={{ color: '#52c41a' }} />;
      case 'course': return <BookOutlined style={{ color: '#722ed1' }} />;
      default: return <BellOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'late': return 'error';
      default: return 'default';
    }
  };

  // Transform enrolled courses to display format
  const displayCourses: Course[] = enrolledCourses.map((course) => ({
    id: course.courseId,
    name: course.name,
    code: course.code,
    instructor: course.mentorName,
    progress: 0, // This would need to be calculated from enrollment progress
    nextClass: 'Chưa có lịch', // This would need to be fetched from schedule API
    status: course.status === 'IN_PROGRESS' ? 'active' : 
            course.status === 'COMPLETED' ? 'completed' : 'upcoming'
  }));

  return (
    <StudentLayout>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        {/* Welcome Header */}
        <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
          <Row align="middle">
            <Col flex="auto">
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                🌟 Chào mừng trở lại, {user?.fullName || 'Sinh viên'}!
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '16px' }}>
                Hôm nay là ngày tuyệt vời để học tập. Hãy cùng khám phá những điều mới mẻ!
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

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Môn học đang học"
                value={enrolledCourses.length}
                prefix={<BookOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff', fontSize: '28px' }}
                suffix={<Badge count={enrollments.filter(e => e.status === 'APPROVED').length} style={{ backgroundColor: '#52c41a' }}>
                  <FireOutlined style={{ color: '#ff7875', marginLeft: 8 }} />
                </Badge>}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>Đã được phê duyệt</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Điểm trung bình"
                value={8.5}
                precision={1}
                prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14', fontSize: '28px' }}
                suffix={<StarOutlined style={{ color: '#faad14' }} />}
              />
              <Progress percent={85} size="small" showInfo={false} strokeColor="#faad14" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Tín chỉ hoàn thành"
                value={45}
                prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a', fontSize: '28px' }}
                suffix="/ 120"
              />
              <Progress percent={37.5} size="small" showInfo={false} strokeColor="#52c41a" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Giờ học tuần này"
                value={enrolledCourses.length * 3}
                prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1', fontSize: '28px' }}
                suffix="giờ"
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>Dựa trên số môn học</Text>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[16, 16]}>
          {/* Left Column */}
          <Col xs={24} lg={16}>
            {/* Courses Progress */}
            <Card title={<><BookOutlined /> Môn học đang theo học</> } style={{ marginBottom: 16 }}>
              <List
                dataSource={displayCourses}
                renderItem={(course: Course) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{course.code}</Avatar>}
                      title={
                        <Space>
                          <Text strong>{course.name}</Text>
                          <Tag color="blue">{course.code}</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text type="secondary">Giảng viên: {course.instructor}</Text>
                          <Text type="secondary">Lớp tiếp theo: {course.nextClass}</Text>
                          <Progress 
                            percent={course.progress} 
                            size="small" 
                            strokeColor={course.progress >= 80 ? '#52c41a' : course.progress >= 60 ? '#faad14' : '#1890ff'}
                          />
                        </Space>
                      }
                    />
                    <div>
                      <Text strong>{course.progress}%</Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Recent Activities */}
            <Card title={<><ClockCircleOutlined /> Hoạt động gần đây</> }>
              <Timeline>
                {activities.map((activity) => (
                  <Timeline.Item 
                    key={activity.id}
                    dot={getActivityIcon(activity.type)}
                  >
                    <Space direction="vertical" size={4}>
                      <Space>
                        <Text strong>{activity.title}</Text>
                        {activity.status && (
                          <Tag color={getStatusColor(activity.status)}>
                            {activity.status === 'completed' ? 'Hoàn thành' : 
                             activity.status === 'pending' ? 'Đang chờ' : 'Trễ hạn'}
                          </Tag>
                        )}
                      </Space>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{activity.time}</Text>
                    </Space>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Col>
          
          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Quick Actions */}
            <Card title="🚀 Thao tác nhanh" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Button 
                  type="primary" 
                  icon={<BookOutlined />}
                  block 
                  size="large"
                  onClick={() => navigate('/student/discover')}
                >
                  📚 Khóa học
                </Button>
                <Button 
                  icon={<CalendarOutlined />}
                  block 
                  size="large"
                  onClick={() => navigate('/student/groups')}
                >
                  👥 Nhóm học
                </Button>
                <Button 
                  icon={<ClockCircleOutlined />}
                  block 
                  size="large"
                  onClick={() => navigate('/student/schedule')}
                >
                  📅 Lịch học
                </Button>
                <Button 
                  icon={<TrophyOutlined />}
                  block 
                  size="large"
                  onClick={() => navigate('/student/grades')}
                >
                  🏆 Điểm số
                </Button>
              </Space>
            </Card>

            {/* Notifications */}
            <Card title={<><BellOutlined /> Thông báo <Badge count={3} /></>}>
              <List
                size="small"
                dataSource={[
                  { title: 'Bài tập mới đã được giao', time: '2 giờ trước', important: true },
                  { title: 'Lịch thi cuối kỳ đã cập nhật', time: '1 ngày trước', important: false },
                  { title: 'Khóa học mới đã mở đăng ký', time: '2 ngày trước', important: false },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={item.important ? 
                        <ExclamationCircleOutlined style={{ color: '#faad14' }} /> : 
                        <BellOutlined style={{ color: '#8c8c8c' }} />
                      }
                      title={<Text style={{ fontSize: '14px' }}>{item.title}</Text>}
                      description={<Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>}
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Motivational Quote */}
            <Alert
              message="💡 Mẩu chuyện hôm nay"
              description="Thành công không phải là chìa khóa của hạnh phúc. Hạnh phúc mới là chìa khóa của thành công."
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