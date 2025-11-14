import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Tag,
  Space,
  message,
  Spin,
  Typography,
  Input,
  Select,
  Modal,
  Descriptions,
  Alert,
  Badge,
  Tooltip,
  Empty,
} from 'antd';
import {
  BookOutlined,
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  CalendarOutlined,
  ReloadOutlined,
  EyeOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import {
  userService,
  semesterService,
  isUserApiError,
  isSemesterApiError,
} from '../services';
import StudentLayout from '../components/StudentLayout';
import { courseService, isApiError as isCourseApiError, isCourseListResponse } from '../services/courseService';
import { enrollmentService, isApiError as isEnrollmentApiError, isEnrollmentListResponse } from '../services/enrollmentService';
import type { User } from '../types/user';
import type { Semester } from '../types/semester';
import type { Course } from '../types/course';
import type { Enrollment } from '../types/enrollment';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const StudentCourseExplorer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [enrolling, setEnrolling] = useState<number | null>(null);
  
  const [profile, setProfile] = useState<User | null>(null);
  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([]);
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [courseDetailModal, setCourseDetailModal] = useState<Course | null>(null);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const profileResponse = await userService.getCurrentUser();
      if (isUserApiError(profileResponse)) {
        message.error('Không thể tải thông tin người dùng: ' + profileResponse.message);
        return;
      }
      setProfile(profileResponse.data);
      
      const semesterResponse = await semesterService.getAllSemesters();
      if (!isSemesterApiError(semesterResponse)) {
        setCurrentSemester(semesterResponse.data[0] || null);
      }
      
      if (profileResponse.data) {
        await Promise.all([
          loadCourses(),
          loadMyEnrollments(profileResponse.data.userId)
        ]);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      setSearchLoading(true);
      
      let coursesResponse;
      if (currentSemester?.semesterId) {
        coursesResponse = await courseService.getCoursesBySemester(currentSemester.semesterId);
      } else {
        coursesResponse = await courseService.getAllCourses();
      }
      
      if (isCourseApiError(coursesResponse)) {
        message.error('Không thể tải danh sách khóa học: ' + coursesResponse.message);
        setAvailableCourses([]);
        return;
      }
      
      if (!isCourseListResponse(coursesResponse)) {
        setAvailableCourses([]);
        return;
      }

      let filteredCourses = coursesResponse.data;
      
      if (searchKeyword) {
        filteredCourses = filteredCourses.filter(course => 
          course.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          course.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          (course.mentorName && course.mentorName.toLowerCase().includes(searchKeyword.toLowerCase()))
        );
      }
      
      if (selectedStatus) {
        filteredCourses = filteredCourses.filter(course => course.status === selectedStatus);
      }
      
      setAvailableCourses(filteredCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      message.error('Có lỗi xảy ra khi tải danh sách lớp học');
      setAvailableCourses([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const loadMyEnrollments = async (userId: number) => {
    try {
      const enrollmentsResponse = await enrollmentService.getEnrollmentsByUser(userId);
      
      if (isEnrollmentApiError(enrollmentsResponse)) {
        console.error('Failed to load enrollments:', enrollmentsResponse.message);
        setMyEnrollments([]);
        return;
      }
      
      if (isEnrollmentListResponse(enrollmentsResponse)) {
        setMyEnrollments(enrollmentsResponse.data);
      }
    } catch (error) {
      console.error('Error loading enrollments:', error);
      setMyEnrollments([]);
    }
  };

  const handleEnrollCourse = async (courseId: number) => {
    if (!profile?.userId) {
      message.error('Không thể xác định thông tin sinh viên');
      return;
    }

    try {
      setEnrolling(courseId);
      
      const response = await enrollmentService.createEnrollment({
        userId: profile.userId,
        courseId: courseId
      });
      
      if (isEnrollmentApiError(response)) {
        message.error(response.message || 'Đăng ký lớp học thất bại');
        return;
      }
      
      message.success('Đăng ký lớp học thành công! Vui lòng chờ phê duyệt.');
      await loadMyEnrollments(profile.userId);
    } catch (error) {
      console.error('Error enrolling course:', error);
      message.error('Có lỗi xảy ra khi đăng ký lớp học');
    } finally {
      setEnrolling(null);
    }
  };

  const isEnrolled = (courseId: number): boolean => {
    return myEnrollments.some(enrollment => 
      enrollment.courseId === courseId && 
      ['PENDING', 'APPROVED'].includes(enrollment.status)
    );
  };

  const canEnroll = (course: Course): boolean => {
    return !isEnrolled(course.courseId) && 
           (course.status === 'OPEN' || course.status === 'UPCOMING') && 
           course.currentStudents < course.maxStudents;
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'OPEN': 'green',
      'UPCOMING': 'blue',
      'IN_PROGRESS': 'orange',
      'COMPLETED': 'default',
      'CANCELLED': 'red',
    };
    return statusMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'OPEN': 'Đang mở',
      'UPCOMING': 'Sắp mở',
      'IN_PROGRESS': 'Đang diễn ra',
      'COMPLETED': 'Đã kết thúc',
      'CANCELLED': 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadCourses();
    }
  }, [searchKeyword, selectedStatus]);

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
        </div>
      </StudentLayout>
    );
  }

  const courseColumns = [
    {
      title: 'Mã lớp',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code: string) => <Text strong>{code}</Text>,
    },
    {
      title: 'Tên lớp học',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'mentorName',
      key: 'mentorName',
      width: 150,
      render: (name: string) => (
        <Space>
          <UserOutlined />
          {name || 'Chưa có'}
        </Space>
      ),
    },
    {
      title: 'Sĩ số',
      key: 'enrollment',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: Course) => (
        <Space direction="vertical" size="small">
          <Text>{record.currentStudents}/{record.maxStudents}</Text>
          <div style={{ width: '60px', height: '4px', backgroundColor: '#f0f0f0', borderRadius: '2px' }}>
            <div 
              style={{ 
                width: `${(record.currentStudents / record.maxStudents) * 100}%`, 
                height: '100%', 
                backgroundColor: record.currentStudents >= record.maxStudents ? '#ff4d4f' : '#52c41a',
                borderRadius: '2px',
                transition: 'width 0.3s'
              }}
            />
          </div>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: Course) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => setCourseDetailModal(record)}
            />
          </Tooltip>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            loading={enrolling === record.courseId}
            disabled={!canEnroll(record) || isEnrolled(record.courseId)}
            onClick={() => handleEnrollCourse(record.courseId)}
          >
            {isEnrolled(record.courseId) ? 'Đã đăng ký' : 'Đăng ký'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <StudentLayout>
      <div style={{ padding: '24px', minHeight: '100vh', background: '#f0f2f5' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row align="middle" justify="space-between">
              <Col>
                <Space align="center">
                  <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <div>
                    <Title level={3} style={{ margin: 0 }}>Khám phá khóa học</Title>
                    <Text type="secondary">
                      Kỳ học: {currentSemester?.name || 'N/A'}
                    </Text>
                  </div>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Badge count={myEnrollments.length} style={{ backgroundColor: '#52c41a' }}>
                    <Button icon={<TeamOutlined />}>
                      Lớp đã đăng ký
                    </Button>
                  </Badge>
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={loadInitialData}
                    loading={loading}
                  >
                    Làm mới
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="Tìm kiếm & Bộ lọc">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8} md={6}>
                <Search
                  placeholder="Tìm kiếm lớp học, giảng viên..."
                  allowClear
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  enterButton={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} sm={6} md={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Trạng thái"
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  allowClear
                >
                  <Option value="OPEN">Đang mở</Option>
                  <Option value="UPCOMING">Sắp mở</Option>
                  <Option value="IN_PROGRESS">Đang diễn ra</Option>
                  <Option value="COMPLETED">Đã kết thúc</Option>
                </Select>
              </Col>
              <Col xs={24} sm={4} md={3}>
                <Button
                  block
                  icon={<SearchOutlined />}
                  onClick={loadCourses}
                  loading={searchLoading}
                >
                  Tìm kiếm
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={
              <Space>
                <BookOutlined />
                <span>Danh sách lớp học</span>
                <Badge count={availableCourses.length} style={{ backgroundColor: '#1890ff' }} />
              </Space>
            }
          >
            {availableCourses.length > 0 ? (
              <Table
                columns={courseColumns}
                dataSource={availableCourses}
                rowKey="courseId"
                loading={searchLoading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} của ${total} lớp học`,
                }}
                scroll={{ x: 1000 }}
              />
            ) : (
              <Empty 
                description="Không tìm thấy lớp học nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            <BookOutlined />
            <span>Chi tiết lớp học</span>
          </Space>
        }
        open={!!courseDetailModal}
        onCancel={() => setCourseDetailModal(null)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setCourseDetailModal(null)}>
            Đóng
          </Button>,
          courseDetailModal && canEnroll(courseDetailModal) && (
            <Button
              key="enroll"
              type="primary"
              icon={<PlusOutlined />}
              loading={enrolling === courseDetailModal.courseId}
              onClick={() => {
                handleEnrollCourse(courseDetailModal.courseId);
                setCourseDetailModal(null);
              }}
            >
              Đăng ký lớp học
            </Button>
          ),
        ]}
      >
        {courseDetailModal && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Mã lớp">
                <Text strong>{courseDetailModal.code}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tên lớp">
                {courseDetailModal.name}
              </Descriptions.Item>
              <Descriptions.Item label="Giảng viên">
                <Space>
                  <UserOutlined />
                  {courseDetailModal.mentorName || 'Chưa có'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Kỳ học">
                <Space>
                  <CalendarOutlined />
                  {courseDetailModal.semesterCode || 'N/A'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Sĩ số">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text>{courseDetailModal.currentStudents}/{courseDetailModal.maxStudents} sinh viên</Text>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                    <div 
                      style={{ 
                        width: `${(courseDetailModal.currentStudents / courseDetailModal.maxStudents) * 100}%`, 
                        height: '100%', 
                        backgroundColor: courseDetailModal.currentStudents >= courseDetailModal.maxStudents ? '#ff4d4f' : '#52c41a',
                        borderRadius: '4px',
                        transition: 'width 0.3s'
                      }}
                    />
                  </div>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Hạn tạo nhóm">
                <Space>
                  <ClockCircleOutlined />
                  {courseDetailModal.teamFormationDeadline 
                    ? new Date(courseDetailModal.teamFormationDeadline).toLocaleString('vi-VN')
                    : 'Chưa có'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(courseDetailModal.status)}>
                  {getStatusText(courseDetailModal.status)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            
            {isEnrolled(courseDetailModal.courseId) && (
              <Alert
                message="Bạn đã đăng ký lớp học này"
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
            
            {!canEnroll(courseDetailModal) && !isEnrolled(courseDetailModal.courseId) && (
              <Alert
                message="Không thể đăng ký"
                description={
                  courseDetailModal.currentStudents >= courseDetailModal.maxStudents 
                    ? 'Lớp học đã đầy' 
                    : 'Lớp học không còn mở đăng ký'
                }
                type="warning"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        )}
      </Modal>
      </div>
    </StudentLayout>
  );
};

export default StudentCourseExplorer;
