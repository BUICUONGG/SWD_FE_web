import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  List,
  Tag,
  Button,
  Spin,
  Space,
  Avatar,
  Typography,
  Empty,
  Alert,
  Input,
  Select,
  Modal,
  Form,
  message
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  CrownOutlined,
  SearchOutlined,
  PlusOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import { teamService, isApiError as isTeamApiError, isTeamListResponse } from '../services/teamService';
import { userService, isApiError, isUserResponse } from '../services/userService';
import { enrollmentService, isApiError as isEnrollmentApiError, isEnrollmentListResponse } from '../services/enrollmentService';
import { courseService, isApiError as isCourseApiError, isCourseResponse } from '../services/courseService';
import type { Team } from '../types/team';
import type { Enrollment } from '../types/enrollment';

const { Title, Text } = Typography;

const StudentGroups: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();
  const [form] = Form.useForm();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current user
        const userResponse = await userService.getCurrentUser();
        if (isApiError(userResponse)) {
          console.warn('Using sample data:', userResponse.message);
          setCurrentUserId(1);
          setEnrollments(getSampleEnrollments());
          setSelectedCourseId(1);
          setAllTeams(getSampleAllTeams());
          setFilteredTeams(getSampleAllTeams());
          setError('Đang sử dụng dữ liệu mẫu (API không khả dụng)');
          return;
        }
        if (!isUserResponse(userResponse)) {
          throw new Error('Failed to get user info');
        }
        
        const userId = userResponse.data.userId;
        setCurrentUserId(userId);

        // Fetch user's enrollments
        const enrollmentsResponse = await enrollmentService.getEnrollmentsByUser(userId);
        if (isEnrollmentApiError(enrollmentsResponse)) {
          console.warn('Could not fetch enrollments, using sample data:', enrollmentsResponse.message);
          const sampleEnrollments = getSampleEnrollments();
          setEnrollments(sampleEnrollments);
          if (sampleEnrollments.length > 0) {
            setSelectedCourseId(sampleEnrollments[0].courseId);
          }
        } else if (isEnrollmentListResponse(enrollmentsResponse)) {
          const approvedEnrollments = enrollmentsResponse.data.filter((e: Enrollment) => e.status === 'APPROVED');
          setEnrollments(approvedEnrollments);
          
          if (approvedEnrollments.length > 0) {
            setSelectedCourseId(approvedEnrollments[0].courseId);
          } else {
            // No approved enrollments, use sample data
            console.warn('No approved enrollments found, using sample data');
            const sampleEnrollments = getSampleEnrollments();
            setEnrollments(sampleEnrollments);
            setSelectedCourseId(sampleEnrollments[0].courseId);
          }
        }

        // Fetch all teams - wait for enrollments to be set first
        // Will be called by useEffect when selectedCourseId changes
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setCurrentUserId(1);
        const sampleEnrollments = getSampleEnrollments();
        setEnrollments(sampleEnrollments);
        setSelectedCourseId(sampleEnrollments[0].courseId);
        const sampleTeams = getSampleAllTeams();
        setAllTeams(sampleTeams);
        setFilteredTeams(sampleTeams);
        setError('Có lỗi xảy ra, đang sử dụng dữ liệu mẫu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSampleEnrollments = (): Enrollment[] => [
    {
      enrollmentId: 1,
      userId: 1,
      userName: 'Nguyễn Văn A',
      userEmail: 'student1@fpt.edu.vn',
      courseId: 1,
      courseName: 'SWD392 - Web Development',
      courseCode: 'SWD392',
      status: 'APPROVED',
      enrollmentDate: new Date().toISOString(),
      approvedDate: new Date().toISOString()
    },
    {
      enrollmentId: 2,
      userId: 1,
      userName: 'Nguyễn Văn A',
      userEmail: 'student1@fpt.edu.vn',
      courseId: 2,
      courseName: 'AI301 - Artificial Intelligence',
      courseCode: 'AI301',
      status: 'APPROVED',
      enrollmentDate: new Date().toISOString(),
      approvedDate: new Date().toISOString()
    }
  ];

  const getSampleAllTeams = (): Team[] => [
    {
      id: 1,
      name: 'Team Innovation',
      courseId: 1,
      courseName: 'SWD392 - Web Development',
      courseCode: 'SWD392',
      semesterId: 1,
      semesterName: 'Spring 2025',
      memberCount: 0,
      leaderId: 2,
      leaderName: 'Trần Văn B',
      status: 'OPENING',
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Team AI Research',
      courseId: 2,
      courseName: 'AI301 - Artificial Intelligence',
      courseCode: 'AI301',
      semesterId: 1,
      semesterName: 'Spring 2025',
      memberCount: 0,
      leaderId: 3,
      leaderName: 'Lê Thị C',
      status: 'OPENING',
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Team Mobile App',
      courseId: 1,
      courseName: 'SWD392 - Web Development',
      courseCode: 'SWD392',
      semesterId: 1,
      semesterName: 'Spring 2025',
      memberCount: 0,
      leaderId: 4,
      leaderName: 'Phạm Văn D',
      status: 'OPENING',
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Team Data Science',
      courseId: 2,
      courseName: 'AI301 - Artificial Intelligence',
      courseCode: 'AI301',
      semesterId: 1,
      semesterName: 'Spring 2025',
      memberCount: 0,
      leaderId: 5,
      leaderName: 'Hoàng Thị E',
      status: 'OPENING',
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Team Blockchain',
      courseId: 1,
      courseName: 'SWD392 - Web Development',
      courseCode: 'SWD392',
      semesterId: 1,
      semesterName: 'Spring 2025',
      memberCount: 0,
      leaderId: 1,
      leaderName: 'Nguyễn Văn A',
      status: 'OPENING',
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const loadTeams = async (courseId?: number) => {
    try {
      console.log('Loading teams for courseId:', courseId);
      
      if (!courseId) {
        // Nếu không có courseId, dùng sample data
        console.log('No courseId provided, using sample data');
        const sampleTeams = getSampleAllTeams();
        setAllTeams(sampleTeams);
        setFilteredTeams(sampleTeams);
        return;
      }

      // Fetch course info to get mentorId
      const courseResponse = await courseService.getCourseById(courseId);
      if (isCourseApiError(courseResponse) || !isCourseResponse(courseResponse)) {
        console.warn('Error loading course, using sample data:', courseResponse);
        const sampleTeams = getSampleAllTeams().filter(t => t.courseId === courseId);
        setAllTeams(sampleTeams);
        setFilteredTeams(sampleTeams);
        return;
      }

      const mentorId = courseResponse.data.mentorId;
      console.log('Fetching teams with mentorId:', mentorId);
      
      const teamsResponse = await teamService.getTeamsByCourse(courseId, mentorId);
      console.log('Teams response:', teamsResponse);
        
      if (isTeamApiError(teamsResponse)) {
        console.warn('Error loading teams, using sample data:', teamsResponse.message);
        const sampleTeams = getSampleAllTeams().filter(t => t.courseId === courseId);
        setAllTeams(sampleTeams);
        setFilteredTeams(sampleTeams);
        return;
      }
      if (isTeamListResponse(teamsResponse)) {
        console.log('Successfully loaded teams:', teamsResponse.data.length);
        setAllTeams(teamsResponse.data);
        setFilteredTeams(teamsResponse.data);
      } else {
        console.warn('Invalid teams response format, using sample data');
        const sampleTeams = getSampleAllTeams().filter(t => t.courseId === courseId);
        setAllTeams(sampleTeams);
        setFilteredTeams(sampleTeams);
      }
    } catch (err) {
      console.error('Error loading teams:', err);
      const sampleTeams = courseId ? getSampleAllTeams().filter(t => t.courseId === courseId) : getSampleAllTeams();
      setAllTeams(sampleTeams);
      setFilteredTeams(sampleTeams);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      loadTeams(selectedCourseId);
    } else if (!loading && enrollments.length > 0) {
      // If no course selected but have enrollments, load all sample teams
      loadTeams();
    } else if (!loading && enrollments.length === 0) {
      // No enrollments at all, show sample data
      console.warn('No enrollments, loading sample teams');
      const sampleTeams = getSampleAllTeams();
      setAllTeams(sampleTeams);
      setFilteredTeams(sampleTeams);
    }
  }, [selectedCourseId, loading, enrollments.length]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = allTeams.filter(team =>
      team.name.toLowerCase().includes(value.toLowerCase()) ||
      (team.courseName && team.courseName.toLowerCase().includes(value.toLowerCase())) ||
      (team.leaderName && team.leaderName.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredTeams(filtered);
  };

  const handleViewTeamDetail = (teamId: number) => {
    navigate(`/student/group/${teamId}`);
  };

  const handleCreateTeam = async (values: any) => {
    if (!values.enrollmentId) {
      message.error('Vui lòng chọn lớp học');
      return;
    }

    setCreating(true);
    try {
      // Backend expects: createTeam(enrollmentId: number, teamName: string)
      const response = await teamService.createTeam(
        values.enrollmentId,
        values.name
      );

      if (isTeamApiError(response)) {
        message.error(response.message || 'Tạo nhóm thất bại');
      } else {
        message.success('Tạo nhóm thành công!');
        setShowCreateModal(false);
        form.resetFields();
        
        // Reload teams
        if (selectedCourseId) {
          await loadTeams(selectedCourseId);
        }
      }
    } catch (err) {
      console.error('Error creating team:', err);
      message.error('Có lỗi xảy ra khi gửi yêu cầu tạo nhóm');
    } finally {
      setCreating(false);
    }
  };

  const isUserInTeam = (team: Team): boolean => {
    if (!currentUserId) return false;
    return team.members?.some(m => m.userId === currentUserId) || false;
  };

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" tip="Đang tải danh sách nhóm..." />
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
            👥 Danh sách nhóm
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
            Xem và tham gia các nhóm học tập
          </Text>
        </Card>

        {/* Nếu chưa đăng ký môn học thì hiển thị thông báo và không render danh sách nhóm */}
        {enrollments.length === 0 && (
          <Alert
            message="Bạn cần đăng ký môn học trước khi xem hoặc tham gia nhóm."
            description="Vui lòng đăng ký môn học tại trang Khóa học của tôi."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Nếu có enrollment thì render tiếp các thành phần nhóm */}
        {enrollments.length > 0 && (
          <>
            {error && error.includes('mẫu') && (
              <Alert
                message="⚠️ Không thể kết nối Backend Server"
                description={
                  <div>
                    <p><strong>Đang hiển thị dữ liệu mẫu.</strong> Để xem dữ liệu thật từ database:</p>
                    <ol style={{ marginLeft: 20, marginTop: 8, marginBottom: 0 }}>
                      <li>Đảm bảo backend server đang chạy tại <code>http://localhost:8080</code></li>
                      <li>Kiểm tra database đã được khởi tạo và có dữ liệu</li>
                      <li>Kiểm tra authentication token còn hiệu lực</li>
                      <li>Refresh trang này (F5) sau khi backend đã sẵn sàng</li>
                    </ol>
                    <p style={{ marginTop: 8, marginBottom: 0 }}>
                      <strong>Lỗi:</strong> {error}
                    </p>
                  </div>
                }
                type="warning"
                showIcon
                closable
                style={{ marginBottom: 16 }}
              />
            )}
        
        {error && !error.includes('mẫu') && (
          <Alert
            message="Lỗi tải dữ liệu"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Search Bar & Filters */}
        <Card style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Input
                placeholder="Tìm kiếm theo tên nhóm, mô tả, mentor..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                size="large"
                style={{ width: '400px' }}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                size="large"
                onClick={() => setShowCreateModal(true)}
                disabled={enrollments.length === 0}
              >
                Tạo nhóm mới
              </Button>
            </Space>
            {enrollments.length > 0 && (
              <Space>
                <Text>Lọc theo lớp:</Text>
                <Select
                  style={{ width: 300 }}
                  placeholder="Chọn lớp học"
                  value={selectedCourseId}
                  onChange={setSelectedCourseId}
                  allowClear
                  onClear={() => loadTeams()}
                >
                  {enrollments.map(enrollment => (
                    <Select.Option key={enrollment.courseId} value={enrollment.courseId}>
                      {enrollment.courseName} ({enrollment.courseCode})
                    </Select.Option>
                  ))}
                </Select>
              </Space>
            )}
          </Space>
        </Card>

        {/* Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>
                  {allTeams.length}
                </div>
                <Text type="secondary">Tổng số nhóm</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#52c41a' }}>
                  {allTeams.filter(t => currentUserId && t.members?.some(m => m.userId === currentUserId)).length}
                </div>
                <Text type="secondary">Nhóm đã tham gia</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#faad14' }}>
                  {allTeams.filter(t => t.status === 'OPENING').length}
                </div>
                <Text type="secondary">Nhóm đang mở</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#722ed1' }}>
                  {enrollments.length}
                </div>
                <Text type="secondary">Lớp đã đăng ký</Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Teams List */}
        <Card title={<><TeamOutlined /> Danh sách nhóm</>}>
          {filteredTeams.length === 0 ? (
            <Empty
              description={searchTerm ? 'Không tìm thấy nhóm nào' : 'Không có nhóm nào'}
              style={{ padding: '40px 0' }}
            />
          ) : (
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 3,
              }}
              dataSource={filteredTeams}
              renderItem={(team) => {
                const isJoined = isUserInTeam(team);
                const memberCount = team.members?.length || 0;

                return (
                  <List.Item>
                    <Card
                      hoverable
                      onClick={() => handleViewTeamDetail(team.id)}
                      style={{ 
                        height: '100%',
                        border: isJoined ? '2px solid #52c41a' : '1px solid #f0f0f0'
                      }}
                    >
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {/* Team Header */}
                        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                          <Avatar 
                            size={48} 
                            style={{ backgroundColor: isJoined ? '#52c41a' : '#1890ff', fontSize: '24px' }}
                            icon={<TeamOutlined />}
                          />
                          <Space>
                            {isJoined && <Tag color="green">✓ Đã tham gia</Tag>}
                            {team.status === 'CLOSED' && <Tag color="red">Đã đóng</Tag>}
                          </Space>
                        </Space>

                        {/* Team Name */}
                        <div>
                          <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                            {team.name}
                          </Title>
                        </div>

                        {/* Team Info */}
                        <Space direction="vertical" style={{ width: '100%' }} size="small">
                          <Space>
                            <BookOutlined style={{ color: '#1890ff' }} />
                            <Text strong>{team.courseName}</Text>
                          </Space>
                          <Space>
                            <CrownOutlined style={{ color: '#faad14' }} />
                            <Text type="secondary">Nhóm trưởng: {team.leaderName}</Text>
                          </Space>
                          <Space>
                            <UserOutlined style={{ color: '#52c41a' }} />
                            <Text type="secondary">
                              {memberCount} thành viên
                            </Text>
                          </Space>
                        </Space>

                        {/* Status Info */}
                        <div style={{ width: '100%' }}>
                          <Tag color={team.status === 'OPENING' ? 'green' : 'default'}>
                            {team.status === 'OPENING' ? 'Đang mở' : team.status}
                          </Tag>
                        </div>

                        {/* Action Button */}
                        <Button 
                          type={isJoined ? 'default' : 'primary'} 
                          block
                          disabled={isJoined}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTeamDetail(team.id);
                          }}
                        >
                          {isJoined ? 'Đã tham gia' : 'Xem chi tiết'}
                        </Button>
                      </Space>
                    </Card>
                  </List.Item>
                );
              }}
            />
          )}
        </Card>

        {/* Create Team Modal */}
        <Modal
          title="➕ Tạo nhóm mới"
          open={showCreateModal}
          onCancel={() => {
            setShowCreateModal(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Alert
            message="Lưu ý"
            description="Bạn sẽ trở thành nhóm trưởng của nhóm mới. Nhóm sẽ được tạo ngay lập tức."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateTeam}
          >
            <Form.Item
              name="enrollmentId"
              label="Chọn lớp học"
              rules={[{ required: true, message: 'Vui lòng chọn lớp học' }]}
            >
              <Select
                placeholder="Chọn lớp học để tạo nhóm"
                size="large"
              >
                {enrollments.map(enrollment => (
                  <Select.Option key={enrollment.enrollmentId} value={enrollment.enrollmentId}>
                    {enrollment.courseName} ({enrollment.courseCode})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="name"
              label="Tên nhóm"
              rules={[
                { required: true, message: 'Vui lòng nhập tên nhóm' },
                { min: 3, message: 'Tên nhóm phải có ít nhất 3 ký tự' },
                { max: 100, message: 'Tên nhóm không được quá 100 ký tự' }
              ]}
            >
              <Input 
                placeholder="Nhập tên nhóm (VD: Nhóm 1 - Quản lý bán hàng)"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => {
                  setShowCreateModal(false);
                  form.resetFields();
                }}>
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={creating}
                  icon={<PlusOutlined />}
                >
                  Gửi yêu cầu
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </StudentLayout>
  );
};

export default StudentGroups;
