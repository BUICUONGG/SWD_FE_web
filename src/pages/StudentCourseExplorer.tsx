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
  subjectService,
  isUserApiError,
  isSemesterApiError,
  isSubjectApiError,
} from '../services';
import type { User } from '../types/user';
import type { Semester } from '../types/semester';
import type { Subject } from '../services/subjectService';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Extended Subject interface for course display
interface CourseSubject extends Subject {
  maxStudents?: number;
  currentStudents?: number;
  teamFormationDeadline?: string;
  mentorId?: string;
  mentorName?: string;
  semesterId?: string;
  semesterCode?: string;
}

interface Enrollment {
  id: number;
  courseId: number;
  studentId: number;
  enrollmentDate: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'DROPPED';
  course: CourseSubject;
}

const StudentCourseExplorer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [enrolling, setEnrolling] = useState<number | null>(null);
  
  // Data states
  const [profile, setProfile] = useState<User | null>(null);
  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);
  const [availableCourses, setAvailableCourses] = useState<CourseSubject[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([]);
  
  // UI states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ACTIVE');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [courseDetailModal, setCourseDetailModal] = useState<CourseSubject | null>(null);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load profile
      const profileResponse = await userService.getCurrentUser();
      if (isUserApiError(profileResponse)) {
        console.warn('Profile API failed, using fallback');
        setProfile({
          userId: 1,
          email: 'student@example.com',
          fullName: 'Nguyễn Văn A',
          avatarUrl: '',
          provider: 'LOCAL',
          gender: 'MALE',
          dob: '2000-01-01',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        });
        message.info('Sử dụng dữ liệu demo cho profile');
      } else {
        setProfile(profileResponse.data);
        message.success('Tải profile thành công');
      }
      
      // Load current semester
      const semesterResponse = await semesterService.getAllSemesters();
      if (isSemesterApiError(semesterResponse)) {
        console.warn('Semester API failed, using fallback');
        setCurrentSemester({
          semesterId: 1,
          code: 'FALL2024',
          name: 'Học kỳ Fall 2024',
          year: 2024,
          term: 'FALL',
          startDate: '2024-09-01',
          endDate: '2024-12-31',
        });
        message.info('Sử dụng dữ liệu demo cho kỳ học');
      } else {
        setCurrentSemester(semesterResponse.data[0] || null);
        message.success('Tải kỳ học thành công');
      }
      
      // Load courses and enrollments
      await Promise.all([
        loadCourses(),
        profile ? loadMyEnrollments(profile.userId.toString()) : Promise.resolve()
      ]);
      
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
      
      // Try to load subjects from API
      const subjectsResponse = await subjectService.getAllSubjects();
      let subjects: Subject[] = [];
      
      if (isSubjectApiError(subjectsResponse)) {
        console.warn('Subjects API failed, using fallback data');
        // Mock subjects when API is not available
        subjects = [
          {
            id: '1',
            code: 'CS445',
            name: 'Lập trình React nâng cao',
            description: 'Khóa học React.js nâng cao với TypeScript và các thư viện hiện đại',
            credits: 3,
            prerequisites: ['CS301', 'CS302'],
            status: 'ACTIVE',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '2',
            code: 'CS440',
            name: 'Thiết kế UI/UX hiện đại',
            description: 'Thiết kế giao diện người dùng và trải nghiệm người dùng',
            credits: 3,
            prerequisites: ['CS201'],
            status: 'ACTIVE',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '3',
            code: 'CS435',
            name: 'Quản trị dự án phần mềm',
            description: 'Phương pháp quản lý và điều hành dự án phần mềm',
            credits: 4,
            prerequisites: ['CS401'],
            status: 'ACTIVE',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ];
        message.info('Sử dụng dữ liệu demo cho môn học');
      } else {
        subjects = subjectsResponse.data;
        message.success('Tải danh sách môn học thành công');
      }
      
      // Convert subjects to course subjects with additional course info
      const mockCourses: CourseSubject[] = subjects.map((subject, index) => ({
        ...subject,
        maxStudents: [30, 25, 35][index] || 30,
        currentStudents: [25, 20, 35][index] || 20,
        teamFormationDeadline: [`2024-11-15T23:59:59Z`, `2024-11-20T23:59:59Z`, `2024-11-10T23:59:59Z`][index] || '2024-11-30T23:59:59Z',
        mentorId: `${index + 1}`,
        mentorName: ['TS. Nguyễn Văn A', 'ThS. Trần Thị B', 'TS. Lê Văn C'][index] || 'Giảng viên',
        semesterId: '1',
        semesterCode: 'FALL2024',
      }));

      // Filter based on search criteria
      let filteredCourses = mockCourses;
      
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
      
      if (selectedSubject) {
        filteredCourses = filteredCourses.filter(course => course.code === selectedSubject);
      }
      
      setAvailableCourses(filteredCourses);
      
    } catch (error) {
      console.error('Error loading courses:', error);
      message.error('Có lỗi xảy ra khi tải danh sách lớp học');
    } finally {
      setSearchLoading(false);
    }
  };

  const loadMyEnrollments = async (userId: string) => {
    try {
      // Mock enrollments
      const mockEnrollments: Enrollment[] = [
        {
          id: 1,
          courseId: 3,
          studentId: parseInt(userId) || 1,
          enrollmentDate: '2024-09-01',
          status: 'APPROVED',
          course: {
            id: '3',
            code: 'CS435',
            name: 'Quản trị dự án phần mềm',
            description: 'Phương pháp quản lý và điều hành dự án phần mềm',
            credits: 4,
            prerequisites: ['CS401'],
            status: 'ACTIVE',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            maxStudents: 35,
            currentStudents: 35,
            teamFormationDeadline: '2024-11-10T23:59:59Z',
            mentorId: '3',
            mentorName: 'TS. Lê Văn C',
            semesterId: '1',
            semesterCode: 'FALL2024',
          },
        },
      ];
      
      setMyEnrollments(mockEnrollments);
    } catch (error) {
      console.error('Error loading enrollments:', error);
    }
  };

  const handleEnrollCourse = async (subjectId: string) => {
    if (!profile?.userId) {
      message.error('Không thể xác định thông tin sinh viên');
      return;
    }

    try {
      setEnrolling(parseInt(subjectId));
      
      // Mock enrollment success
      message.success('Đăng ký lớp học thành công! Vui lòng chờ phê duyệt.');
      
      // Add to enrollments list
      const course = availableCourses.find(c => c.id === subjectId);
      if (course) {
        const newEnrollment: Enrollment = {
          id: Date.now(),
          courseId: parseInt(subjectId),
          studentId: profile.userId || 1,
          enrollmentDate: new Date().toISOString().split('T')[0],
          status: 'PENDING',
          course,
        };
        setMyEnrollments(prev => [...prev, newEnrollment]);
      }
      
    } catch (error) {
      console.error('Error enrolling course:', error);
      message.error('Có lỗi xảy ra khi đăng ký lớp học');
    } finally {
      setEnrolling(null);
    }
  };

  const isEnrolled = (subjectId: string): boolean => {
    return myEnrollments.some(enrollment => 
      enrollment.course.id === subjectId && 
      ['PENDING', 'APPROVED'].includes(enrollment.status)
    );
  };

  const canEnroll = (course: CourseSubject): boolean => {
    return !isEnrolled(course.id) && 
           course.status === 'ACTIVE' && 
           (course.currentStudents || 0) < (course.maxStudents || 0);
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'ACTIVE': 'green',
      'INACTIVE': 'red',
      'UPCOMING': 'blue',
      'OPEN': 'green',
      'IN_PROGRESS': 'orange',
      'COMPLETED': 'default',
      'CANCELLED': 'red',
    };
    return statusMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'ACTIVE': 'Hoạt động',
      'INACTIVE': 'Không hoạt động',
      'UPCOMING': 'Sắp mở',
      'OPEN': 'Đang mở đăng ký',
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
  }, [searchKeyword, selectedStatus, selectedSubject]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
      </div>
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
          {name}
        </Space>
      ),
    },
    {
      title: 'Sĩ số',
      key: 'enrollment',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: CourseSubject) => (
        <Space direction="vertical" size="small">
          <Text>{record.currentStudents || 0}/{record.maxStudents || 0}</Text>
          <div style={{ width: '60px', height: '4px', backgroundColor: '#f0f0f0', borderRadius: '2px' }}>
            <div 
              style={{ 
                width: `${((record.currentStudents || 0) / (record.maxStudents || 1)) * 100}%`,
                height: '100%',
                backgroundColor: (record.currentStudents || 0) >= (record.maxStudents || 0) ? '#ff4d4f' : '#52c41a',
                borderRadius: '2px'
              }}
            />
          </div>
        </Space>
      ),
    },
    {
      title: 'Hạn đăng ký team',
      dataIndex: 'teamFormationDeadline',
      key: 'deadline',
      width: 150,
      render: (deadline: string) => (
        <Space>
          <ClockCircleOutlined />
          <Text style={{ fontSize: '12px' }}>
            {new Date(deadline).toLocaleDateString('vi-VN')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_: any, record: CourseSubject) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setCourseDetailModal(record)}
            />
          </Tooltip>
          {canEnroll(record) && (
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              loading={enrolling === parseInt(record.id)}
              onClick={() => handleEnrollCourse(record.id)}
            >
              Đăng ký
            </Button>
          )}
          {isEnrolled(record.id) && (
            <Tag color="success">Đã đăng ký</Tag>
          )}
          {(record.currentStudents || 0) >= (record.maxStudents || 0) && !isEnrolled(record.id) && (
            <Tag color="error">Đã đầy</Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Header */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row align="middle" justify="space-between">
              <Col>
                <Space align="center">
                  <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <div>
                    <Title level={3} style={{ margin: 0 }}>
                      Khám phá & Đăng ký Lớp học
                    </Title>
                    <Space>
                      <Text type="secondary">
                        {profile?.fullName} - Sinh viên
                      </Text>
                      <CalendarOutlined />
                      <Text strong>
                        {currentSemester?.name}
                      </Text>
                    </Space>
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

      {/* Search & Filter */}
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
                  onSearch={() => loadCourses()}
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
                  <Option value="ACTIVE">Hoạt động</Option>
                  <Option value="INACTIVE">Không hoạt động</Option>
                </Select>
              </Col>
              <Col xs={24} sm={6} md={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Môn học"
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                  allowClear
                >
                  <Option value="CS445">Lập trình React</Option>
                  <Option value="CS440">Thiết kế UI/UX</Option>
                  <Option value="CS435">Quản trị dự án</Option>
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

      {/* Course List */}
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

      {/* Course Detail Modal */}
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
              loading={enrolling === parseInt(courseDetailModal.id)}
              onClick={() => {
                handleEnrollCourse(courseDetailModal.id);
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
              <Descriptions.Item label="Tên lớp học">
                {courseDetailModal.name}
              </Descriptions.Item>
              <Descriptions.Item label="Giảng viên">
                <Space>
                  <UserOutlined />
                  {courseDetailModal.mentorName}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Sĩ số">
                <Space>
                  <Text>{courseDetailModal.currentStudents || 0}/{courseDetailModal.maxStudents || 0}</Text>
                  <Tag color={(courseDetailModal.currentStudents || 0) >= (courseDetailModal.maxStudents || 0) ? 'error' : 'success'}>
                    {(courseDetailModal.currentStudents || 0) >= (courseDetailModal.maxStudents || 0) ? 'Đã đầy' : 'Còn chỗ'}
                  </Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Hạn đăng ký team">
                <Space>
                  <ClockCircleOutlined />
                  {courseDetailModal.teamFormationDeadline ? 
                    new Date(courseDetailModal.teamFormationDeadline).toLocaleString('vi-VN') : 
                    'Chưa xác định'
                  }
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(courseDetailModal.status)}>
                  {getStatusText(courseDetailModal.status)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {courseDetailModal.status === 'ACTIVE' && (
              <Alert
                style={{ marginTop: 16 }}
                message="Môn học đang hoạt động"
                description="Bạn có thể đăng ký tham gia môn học này. Sau khi đăng ký thành công, vui lòng chờ phê duyệt từ giảng viên."
                type="info"
                showIcon
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentCourseExplorer;