import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Typography,
  Space,
  Button,
  Spin,
  Progress,
  Avatar,
  Badge,
  Tag,
  Form,
  Input,
  Select,
  Alert,
  Drawer,
  Tabs,
  Statistic
} from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { courseService, isCourseResponse } from '../services/courseService';
import { teamService, isTeamListResponse, isApiError as isTeamApiError } from '../services/teamService';
import type { Course } from '../types/course';
import type { Team } from '../types/team';

const { Title, Text, Paragraph } = Typography;

interface CourseDetail extends Course {
  description?: string;
  objectives?: string[];
  requirements?: string[];
  schedule?: string;
  startDate?: string;
  endDate?: string;
  materials?: string[];
}

const MentorCourseManagement: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (courseId) {
          const response = await courseService.getCourseById(parseInt(courseId));
          if (!isCourseResponse(response)) {
            throw new Error(response.message);
          }
          if (isCourseResponse(response)) {
            // Add mock data for demo
            const courseData: CourseDetail = {
              ...response.data,
              description: 'Khóa học toàn diện về lập trình React từ cơ bản đến nâng cao. Bạn sẽ học cách tạo các ứng dụng web hiện đại, sử dụng hooks, context API, và tích hợp với APIs.',
              objectives: [
                'Hiểu sâu về React components và lifecycle',
                'Thành thạo React Hooks',
                'Xây dựng ứng dụng Single Page Application',
                'Tích hợp và gọi APIs từ React'
              ],
              requirements: [
                'Kiến thức cơ bản về JavaScript',
                'Hiểu biết về HTML/CSS',
                'Máy tính với Node.js đã cài đặt'
              ],
              schedule: 'Thứ 2 và Thứ 4, 19:00 - 21:00',
              startDate: '2025-11-01',
              endDate: '2025-12-31',
              materials: [
                'Slide bài giảng',
                'Tài liệu bài tập',
                'Source code ví dụ',
                'Quiz trực tuyến'
              ]
            };
            setCourse(courseData);
            form.setFieldsValue(courseData);
          }
        }

        // Fetch teams for this course
        if (courseId) {
          await fetchTeams(parseInt(courseId));
        }
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, form]);

  const fetchTeams = async (cId: number) => {
    try {
      setLoadingTeams(true);
      
      // Get current user info to get mentorId
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.warn('No user info found');
        return;
      }

      const user = JSON.parse(userStr);
      const mentorId = user.userId;

      if (!mentorId) {
        console.warn('No mentorId found');
        return;
      }

      const response = await teamService.getTeamsByCourse(cId, mentorId);
      
      if (isTeamApiError(response)) {
        console.error('Error loading teams:', response.message);
        setTeams([]);
      } else if (isTeamListResponse(response)) {
        setTeams(response.data || []);
      } else {
        setTeams([]);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setTeams([]);
    } finally {
      setLoadingTeams(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu khóa học..." />
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

  // Mock enrollment requests data
  const enrollmentRequests = [
    {
      id: 1,
      studentName: 'Nguyễn Văn A',
      studentEmail: 'nguyenvana@student.edu.vn',
      requestDate: '2025-10-28',
      status: 'PENDING',
      gpa: 3.5
    },
    {
      id: 2,
      studentName: 'Trần Thị B',
      studentEmail: 'tranthib@student.edu.vn',
      requestDate: '2025-10-27',
      status: 'PENDING',
      gpa: 3.8
    },
    {
      id: 3,
      studentName: 'Lê Minh C',
      studentEmail: 'leminhhc@student.edu.vn',
      requestDate: '2025-10-26',
      status: 'APPROVED',
      gpa: 3.2
    },
  ];

  // Mock students list
  const students = [
    {
      id: 1,
      studentName: 'Lê Minh C',
      studentId: 'SV001',
      email: 'leminhhc@student.edu.vn',
      joinedDate: '2025-10-26',
      status: 'APPROVED',
      progress: 75,
      submission: 8,
      assignment: 10,
      gpa: 3.2
    },
    {
      id: 2,
      studentName: 'Hoàng Văn D',
      studentId: 'SV002',
      email: 'hoangvand@student.edu.vn',
      joinedDate: '2025-10-25',
      status: 'APPROVED',
      progress: 60,
      submission: 6,
      assignment: 10,
      gpa: 3.1
    },
    {
      id: 3,
      studentName: 'Phạm Thị E',
      studentId: 'SV003',
      email: 'phamthie@student.edu.vn',
      joinedDate: '2025-10-24',
      status: 'APPROVED',
      progress: 85,
      submission: 9,
      assignment: 10,
      gpa: 3.9
    },
  ];

  const enrollmentColumns = [
    {
      title: 'Tên sinh viên',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text: string, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div><Text strong>{text}</Text></div>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.studentEmail}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Ngày yêu cầu',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date: string) => <Text>{new Date(date).toLocaleDateString('vi-VN')}</Text>,
    },
    {
      title: 'GPA',
      dataIndex: 'gpa',
      key: 'gpa',
      render: (gpa: number) => (
        <Tag color={gpa >= 3.5 ? 'green' : gpa >= 3.0 ? 'blue' : 'orange'}>
          {gpa.toFixed(1)}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'PENDING' ? 'processing' : status === 'APPROVED' ? 'success' : 'error'}>
          {status === 'PENDING' ? 'Chờ duyệt' : status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="primary" size="small" disabled={record.status !== 'PENDING'}>
            Phê duyệt
          </Button>
          <Button danger size="small" disabled={record.status !== 'PENDING'}>
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  const studentColumns = [
    {
      title: 'Sinh viên',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text: string, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div><Text strong>{text}</Text></div>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.studentId}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinedDate',
      key: 'joinedDate',
      render: (date: string) => <Text>{new Date(date).toLocaleDateString('vi-VN')}</Text>,
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <div>
          <Progress percent={progress} size="small" />
          <Text type="secondary" style={{ fontSize: '12px' }}>{progress}%</Text>
        </div>
      ),
    },
    {
      title: 'Bài nộp / Bài tập',
      dataIndex: 'submission',
      key: 'submission',
      render: (submission: number, record: any) => (
        <Text>{submission}/{record.assignment}</Text>
      ),
    },
    {
      title: 'Điểm GPA',
      dataIndex: 'gpa',
      key: 'gpa',
      render: (gpa: number) => (
        <Tag color={gpa >= 3.5 ? 'green' : gpa >= 3.0 ? 'blue' : 'orange'}>
          {gpa.toFixed(1)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            Xem chi tiết
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const teamColumns = [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Team) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }} icon={<TeamOutlined />} />
          <div>
            <div><Text strong>{text}</Text></div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {record.id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Nhóm trưởng',
      dataIndex: 'leaderName',
      key: 'leaderName',
      render: (text?: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{text || 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: 'Số thành viên',
      key: 'memberCount',
      render: (record: Team) => (
        <Tag color="blue">
          <UserOutlined /> {record.members?.length || 0} thành viên
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'OPENING' ? 'green' : status === 'CLOSED' ? 'red' : 'default'}>
          {status === 'OPENING' ? 'Đang mở' : status === 'CLOSED' ? 'Đã đóng' : status}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date?: string) => (
        <Text type="secondary">
          {date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: Team) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/mentor/teams/${record.id}`)}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const occupancyRate = Math.round((course.currentStudents / course.maxStudents) * 100);

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
              <Text type="secondary">Quản lý khóa học chi tiết</Text>
            </div>
          </Space>
        </Col>
        <Col>
          <Space>
            <Button icon={<EditOutlined />} onClick={() => setDrawerVisible(true)}>
              Chỉnh sửa
            </Button>
            <Button icon={<DownloadOutlined />}>
              Xuất báo cáo
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Số sinh viên"
              value={course.currentStudents}
              suffix={`/ ${course.maxStudents}`}
              prefix={<TeamOutlined />}
            />
            <Progress percent={occupancyRate} showInfo={false} size="small" />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {occupancyRate}% sức chứa
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Số nhóm"
              value={teams.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {teams.filter(t => t.status === 'OPENING').length} nhóm đang mở
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Chờ phê duyệt"
              value={enrollmentRequests.filter(r => r.status === 'PENDING').length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Đơn chờ xử lý
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Trạng thái"
              value={course.status}
              prefix={<Badge status={course.status === 'IN_PROGRESS' ? 'processing' : 'default'} />}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {course.status === 'IN_PROGRESS' ? 'Đang diễn ra' : 'Không hoạt động'}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          {/* Course Details */}
          <Card
            title={<><BookOutlined /> Thông tin khóa học</>}
            style={{ marginBottom: 16 }}
            extra={
              <Button type="link" icon={<EditOutlined />} onClick={() => setDrawerVisible(true)}>
                Chỉnh sửa
              </Button>
            }
          >
            <Tabs
              items={[
                {
                  key: '1',
                  label: 'Tổng quan',
                  children: (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                      <div>
                        <Title level={5}>Mô tả khóa học</Title>
                        <Paragraph>{course.description}</Paragraph>
                      </div>
                      <div>
                        <Title level={5}>Mục tiêu học tập</Title>
                        <ul>
                          {course.objectives?.map((objective, idx) => (
                            <li key={idx}>{objective}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <Title level={5}>Yêu cầu tiên quyết</Title>
                        <ul>
                          {course.requirements?.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </Space>
                  ),
                },
                {
                  key: '2',
                  label: 'Lịch học',
                  children: (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Text strong>Lịch học:</Text> {course.schedule}
                      </div>
                      <div>
                        <Text strong>Ngày bắt đầu:</Text> {course.startDate && new Date(course.startDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div>
                        <Text strong>Ngày kết thúc:</Text> {course.endDate && new Date(course.endDate).toLocaleDateString('vi-VN')}
                      </div>
                    </Space>
                  ),
                },
                {
                  key: '3',
                  label: 'Tài liệu',
                  children: (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {course.materials?.map((material, idx) => (
                        <div key={idx}>
                          <Tag icon={<FileTextOutlined />}>{material}</Tag>
                        </div>
                      ))}
                    </Space>
                  ),
                },
              ]}
            />
          </Card>

          {/* Enrollment Requests */}
          <Card
            title={<><FileTextOutlined /> Đơn đăng ký chờ phê duyệt</>}
            style={{ marginBottom: 16 }}
          >
            <Table
              columns={enrollmentColumns}
              dataSource={enrollmentRequests}
              pagination={false}
              size="small"
            />
          </Card>

          {/* Students List */}
          <Card title={<><TeamOutlined /> Danh sách sinh viên</>}>
            <Table
              columns={studentColumns}
              dataSource={students}
              pagination={{ pageSize: 10 }}
              size="small"
              scroll={{ x: 1000 }}
            />
          </Card>

          {/* Teams List */}
          <Card 
            title={<><TeamOutlined /> Danh sách nhóm ({teams.length})</>}
            style={{ marginTop: 16 }}
            extra={
              <Button 
                type="primary" 
                onClick={() => navigate(`/mentor/course/${courseId}/teams`)}
              >
                Quản lý nhóm
              </Button>
            }
          >
            {loadingTeams ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin tip="Đang tải danh sách nhóm..." />
              </div>
            ) : teams.length === 0 ? (
              <Alert
                message="Chưa có nhóm nào"
                description="Các sinh viên chưa tạo nhóm trong khóa học này. Nhóm sẽ tự động hiển thị khi sinh viên tạo."
                type="info"
                showIcon
                style={{ margin: '20px 0' }}
              />
            ) : (
              <Table
                columns={teamColumns}
                dataSource={teams}
                pagination={{ pageSize: 5 }}
                size="small"
                scroll={{ x: 800 }}
                rowKey="id"
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Quick Info */}
          <Card title="ℹ️ Thông tin nhanh" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Mã khóa học</Text>
                <div><Text strong>{course.code}</Text></div>
              </div>
              <div>
                <Text type="secondary">Giảng viên</Text>
                <div><Text strong>{course.mentorName}</Text></div>
              </div>
              <div>
                <Text type="secondary">Sức chứa</Text>
                <div>
                  <Text strong>
                    {course.currentStudents}/{course.maxStudents} sinh viên
                  </Text>
                </div>
              </div>
              <div>
                <Text strong>Trạng thái</Text>
                <div>
                  <Tag color={course.status === 'IN_PROGRESS' ? 'green' : 'orange'}>
                    {course.status === 'IN_PROGRESS' ? 'Đang hoạt động' : 'Không hoạt động'}
                  </Tag>
                </div>
              </div>
            </Space>
          </Card>

          {/* Quick Actions */}
          <Card title="🚀 Thao tác nhanh">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                block 
                size="large"
                icon={<TeamOutlined />}
                onClick={() => navigate(`/mentor/course/${courseId}/teams`)}
              >
                Quản lý nhóm
              </Button>
              <Button 
                block 
                size="large"
                icon={<UserOutlined />}
              >
                Quản lý sinh viên
              </Button>
              <Button block size="large">
                📝 Tạo bài tập
              </Button>
              <Button block size="large">
                📊 Xem báo cáo
              </Button>
              <Button block size="large">
                ⚙️ Cài đặt khóa học
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Edit Drawer */}
      <Drawer
        title="Chỉnh sửa thông tin khóa học"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => {
            console.log('Updated course:', values);
            setDrawerVisible(false);
          }}
        >
          <Form.Item label="Tên khóa học" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mã khóa học" name="code" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Sức chứa tối đa" name="maxStudents" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Sắp tới', value: 'UPCOMING' },
                { label: 'Mở đăng ký', value: 'OPEN' },
                { label: 'Đang diễn ra', value: 'IN_PROGRESS' },
                { label: 'Đã kết thúc', value: 'COMPLETED' },
                { label: 'Đã hủy', value: 'CANCELLED' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
              <Button onClick={() => setDrawerVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default MentorCourseManagement;
