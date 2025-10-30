import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  List,
  Badge,
  Tag,
  Button,
  Spin,
  Input,
  Space,
  Avatar,
  Progress,
  Typography,
  Empty,
  Alert,
  Select
} from 'antd';
import {
  SearchOutlined,
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import StudentLayout from '../components/StudentLayout';
import { enrollmentService, isApiError as isEnrollmentApiError, isEnrollmentListResponse } from '../services/enrollmentService';
import { courseService, isApiError as isCourseApiError, isCourseResponse } from '../services/courseService';
import { userService, isApiError, isUserResponse } from '../services/userService';
import { semesterService, isSemesterListResponse, isApiError as isSemesterApiError } from '../services/semesterService';
import type { Semester } from '../types/semester';

const { Title, Text, Paragraph } = Typography;

interface CourseDisplay {
  courseId: number;
  code: string;
  name: string;
  mentorName: string;
  maxStudents: number;
  currentStudents: number;
  enrollmentId?: number;
  enrollmentStatus?: string;
  enrollmentDate?: string;
}

const StudentCourses: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseDisplay[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all semesters
        const semestersResponse = await semesterService.getAllSemesters();
        if (!isSemesterApiError(semestersResponse) && isSemesterListResponse(semestersResponse)) {
          setSemesters(semestersResponse.data);
          // Set default to current/latest semester
          if (semestersResponse.data.length > 0) {
            setSelectedSemester(semestersResponse.data[0].semesterId);
          }
        }

        // Fetch current user
        const userResponse = await userService.getCurrentUser();
        if (isApiError(userResponse)) {
          throw new Error(userResponse.message);
        }
        if (!isUserResponse(userResponse)) {
          throw new Error('Failed to get user info');
        }

        // Fetch user enrollments
        const userId = userResponse.data.userId;
        const enrollmentsResponse = await enrollmentService.getEnrollmentsByUser(userId);
        if (isEnrollmentApiError(enrollmentsResponse)) {
          throw new Error(enrollmentsResponse.message);
        }
        if (!isEnrollmentListResponse(enrollmentsResponse)) {
          throw new Error('Failed to fetch enrollments');
        }

        // Fetch course details for each enrollment
        const coursePromises = enrollmentsResponse.data.map(async (enrollment) => {
          const courseResponse = await courseService.getCourseById(enrollment.courseId);
          if (isCourseApiError(courseResponse)) {
            console.error(`Failed to fetch course ${enrollment.courseId}:`, courseResponse.message);
            return null;
          }
          if (isCourseResponse(courseResponse)) {
            return {
              courseId: courseResponse.data.courseId,
              code: courseResponse.data.code,
              name: courseResponse.data.name,
              mentorName: courseResponse.data.mentorName,
              maxStudents: courseResponse.data.maxStudents,
              currentStudents: courseResponse.data.currentStudents,
              enrollmentId: enrollment.enrollmentId,
              enrollmentStatus: enrollment.status,
              enrollmentDate: enrollment.enrollmentDate
            };
          }
          return null;
        });

        const courseResults = await Promise.all(coursePromises);
        const validCourses = courseResults.filter((course) => course !== null) as CourseDisplay[];
        setCourses(validCourses);
        setFilteredCourses(validCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(value.toLowerCase()) ||
      course.code.toLowerCase().includes(value.toLowerCase()) ||
      course.mentorName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'APPROVED': return 'green';
      case 'PENDING': return 'orange';
      case 'REJECTED': return 'red';
      default: return 'blue';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'APPROVED': return '✓ Đã phê duyệt';
      case 'PENDING': return '⏳ Chờ phê duyệt';
      case 'REJECTED': return '✗ Bị từ chối';
      default: return 'Đã đăng ký';
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" tip="Đang tải khóa học..." />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            📚 Khóa học của tôi
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: '8px 0 0 0' }}>
            Quản lý tất cả khóa học bạn đang theo học
          </Paragraph>
        </Card>

        {error && (
          <Alert
            message="Lỗi tải dữ liệu"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Search Bar */}
        <Card style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm theo tên khóa học, mã code hoặc giảng viên..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            size="large"
          />
        </Card>

        {/* Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>
                  {courses.length}
                </div>
                <Text type="secondary">Tổng khóa học</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#52c41a' }}>
                  {courses.filter(c => c.enrollmentStatus === 'APPROVED').length}
                </div>
                <Text type="secondary">Đã phê duyệt</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#faad14' }}>
                  {courses.filter(c => c.enrollmentStatus === 'PENDING').length}
                </div>
                <Text type="secondary">Chờ phê duyệt</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#722ed1' }}>
                  {courses.length}
                </div>
                <Text type="secondary">Tổng tín chỉ</Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Courses List */}
        <Card title={<><BookOutlined /> Danh sách khóa học <Badge count={filteredCourses.length} style={{ backgroundColor: '#1890ff' }} /></>}>
          {filteredCourses.length === 0 ? (
            <Empty description="Không có khóa học nào" />
          ) : (
            <List
              dataSource={filteredCourses}
              renderItem={(course) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={64}
                        style={{ backgroundColor: '#1890ff', fontSize: '24px' }}
                      >
                        {course.code.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <Space>
                        <Text strong style={{ fontSize: '16px' }}>{course.name}</Text>
                        <Tag color="blue">{course.code}</Tag>
                        <Tag color={getStatusColor(course.enrollmentStatus)}>
                          {getStatusText(course.enrollmentStatus)}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Space>
                          <UserOutlined />
                          <Text type="secondary">{course.mentorName}</Text>
                        </Space>
                        <Space>
                          <CalendarOutlined />
                          <Text type="secondary">
                            {course.enrollmentDate ? new Date(course.enrollmentDate).toLocaleDateString('vi-VN') : 'N/A'}
                          </Text>
                        </Space>
                        <Space>
                          <FileTextOutlined />
                          <Text type="secondary">{course.currentStudents}/{course.maxStudents} sinh viên</Text>
                        </Space>
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>Tiến độ</Text>
                          <Progress 
                            percent={Math.floor(Math.random() * 100)} 
                            size="small"
                            showInfo={false}
                          />
                        </div>
                      </Space>
                    }
                  />
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    onClick={() => {}}
                  >
                    Chi tiết
                  </Button>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentCourses;
