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
  message,
  Divider,
  Steps
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  CrownOutlined,
  SearchOutlined,
  PlusOutlined,
  BookOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import { teamService, isApiError as isTeamApiError, isTeamListResponse } from '../services/teamService';
import { userService, isApiError, isUserResponse } from '../services/userService';
import { enrollmentService, isApiError as isEnrollmentApiError, isEnrollmentListResponse } from '../services/enrollmentService';
import { courseService, isApiError as isCourseApiError, isCourseResponse } from '../services/courseService';
import { applicationService, isApiError as isApplicationApiError } from '../services/applicationService';
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
          setError('Không thể lấy thông tin người dùng: ' + userResponse.message);
          return;
        }
        if (!isUserResponse(userResponse)) {
          setError('Không thể lấy thông tin người dùng');
          return;
        }
        
        const userId = userResponse.data.userId;
        setCurrentUserId(userId);

        // Fetch user's enrollments
        const enrollmentsResponse = await enrollmentService.getEnrollmentsByUser(userId);
        if (isEnrollmentApiError(enrollmentsResponse)) {
          setError('Không thể lấy danh sách đăng ký: ' + enrollmentsResponse.message);
          return;
        }
        if (isEnrollmentListResponse(enrollmentsResponse)) {
          // Backend không trả status, nên chỉ lọc isDeleted = false
          const activeEnrollments = enrollmentsResponse.data.filter((e: Enrollment) => !e.isDeleted);
          setEnrollments(activeEnrollments);
          
          if (activeEnrollments.length > 0) {
            setSelectedCourseId(activeEnrollments[0].courseId);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadTeams = async (courseId?: number) => {
    try {
      console.log('Loading teams for courseId:', courseId);
      
      if (!courseId) {
        setAllTeams([]);
        setFilteredTeams([]);
        return;
      }

      // Fetch course info to get mentorId
      const courseResponse = await courseService.getCourseById(courseId);
      if (isCourseApiError(courseResponse) || !isCourseResponse(courseResponse)) {
        setError('Không thể lấy thông tin khóa học: ' + (isCourseApiError(courseResponse) ? courseResponse.message : 'Invalid response'));
        setAllTeams([]);
        setFilteredTeams([]);
        return;
      }

      const mentorId = courseResponse.data.mentorId;
      console.log('Fetching teams with mentorId:', mentorId);
      
      // Backend API: GET /api/teams?CourseId=X
      const teamsResponse = await teamService.getTeamsByCourse(courseId);
      console.log('Teams response:', teamsResponse);
        
      if (isTeamApiError(teamsResponse)) {
        setError('Không thể lấy danh sách nhóm: ' + teamsResponse.message);
        setAllTeams([]);
        setFilteredTeams([]);
        return;
      }
      if (isTeamListResponse(teamsResponse)) {
        console.log('Successfully loaded teams:', teamsResponse.data.length);
        setAllTeams(teamsResponse.data);
        setFilteredTeams(teamsResponse.data);
      } else {
        setError('Định dạng dữ liệu không hợp lệ');
        setAllTeams([]);
        setFilteredTeams([]);
      }
    } catch (err) {
      console.error('Error loading teams:', err);
      setError('Có lỗi xảy ra khi tải danh sách nhóm');
      setAllTeams([]);
      setFilteredTeams([]);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      loadTeams(selectedCourseId);
    } else if (!loading && enrollments.length > 0) {
      // If no course selected but have enrollments, show empty
      setAllTeams([]);
      setFilteredTeams([]);
    } else if (!loading && enrollments.length === 0) {
      // No enrollments at all
      setAllTeams([]);
      setFilteredTeams([]);
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

  const handleApplyToTeam = async (team: Team, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUserId) {
      message.error('Không thể xác định người dùng');
      return;
    }

    // Tìm enrollment trong course này
    const enrollment = enrollments.find(e => e.courseId === team.courseId && !e.isDeleted);
    if (!enrollment) {
      message.error('Bạn chưa đăng ký khóa học này');
      return;
    }

    try {
      const response = await applicationService.applyToTeam(enrollment.enrollmentId, team.id);
      
      if (isApplicationApiError(response)) {
        message.error(response.message || 'Apply vào nhóm thất bại');
      } else {
        message.success('Gửi đơn tham gia nhóm thành công! Chờ nhóm trưởng phê duyệt.');
      }
    } catch (err) {
      console.error('Error applying to team:', err);
      message.error('Có lỗi xảy ra khi apply vào nhóm');
    }
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
            {error && (
              <Alert
                message="Lỗi tải dữ liệu"
                description={error}
                type="error"
                showIcon
                closable
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
                            if (isJoined) {
                              handleViewTeamDetail(team.id);
                            } else {
                              handleApplyToTeam(team, e);
                            }
                          }}
                        >
                          {isJoined ? 'Đã tham gia' : 'Apply vào nhóm'}
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
          title={
            <Space>
              <TeamOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tạo nhóm học tập mới</span>
            </Space>
          }
          open={showCreateModal}
          onCancel={() => {
            setShowCreateModal(false);
            form.resetFields();
          }}
          footer={null}
          width={700}
          style={{ top: 20 }}
        >
          {/* Steps */}
          <Steps
            size="small"
            current={0}
            style={{ marginBottom: 24 }}
            items={[
              {
                title: 'Thông tin nhóm',
                icon: <InfoCircleOutlined />,
              },
              {
                title: 'Hoàn tất',
                icon: <CheckCircleOutlined />,
              },
            ]}
          />

          {/* Info Alert */}
          <Alert
            message="Quyền lợi của nhóm trưởng"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                <li>Bạn sẽ tự động trở thành <strong>Nhóm trưởng</strong></li>
                <li>Có quyền mời thành viên vào nhóm</li>
                <li>Có quyền chọn ý tưởng chính cho nhóm</li>
                <li>Quản lý các hoạt động và tiến độ của nhóm</li>
              </ul>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateTeam}
          >
            {/* Chọn lớp học */}
            <Form.Item
              name="enrollmentId"
              label={
                <Space>
                  <BookOutlined />
                  <span style={{ fontWeight: 600 }}>Chọn lớp học</span>
                </Space>
              }
              rules={[{ required: true, message: 'Vui lòng chọn lớp học' }]}
              extra="Nhóm sẽ được tạo trong lớp học này"
            >
              <Select
                placeholder="Chọn lớp học để tạo nhóm"
                size="large"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {enrollments.map(enrollment => (
                  <Select.Option key={enrollment.enrollmentId} value={enrollment.enrollmentId}>
                    <Space>
                      <Tag color="blue">{enrollment.courseCode}</Tag>
                      {enrollment.courseName}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Tên nhóm */}
            <Form.Item
              name="name"
              label={
                <Space>
                  <TeamOutlined />
                  <span style={{ fontWeight: 600 }}>Tên nhóm</span>
                </Space>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập tên nhóm' },
                { min: 5, message: 'Tên nhóm phải có ít nhất 5 ký tự' },
                { max: 100, message: 'Tên nhóm không được quá 100 ký tự' }
              ]}
              extra="Tên nhóm nên ngắn gọn, dễ nhớ và thể hiện được mục đích học tập"
            >
              <Input 
                placeholder="VD: Nhóm 1 - Hệ thống quản lý bán hàng"
                size="large"
                showCount
                maxLength={100}
                prefix={<TeamOutlined style={{ color: '#bfbfbf' }} />}
              />
            </Form.Item>

            <Divider />

            {/* Preview */}
            <Card 
              size="small" 
              title="👁️ Xem trước" 
              style={{ marginBottom: 16, background: '#fafafa' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <CrownOutlined style={{ color: '#faad14' }} />
                  <Text strong>Nhóm trưởng:</Text>
                  <Text>{currentUserId ? 'Bạn' : 'N/A'}</Text>
                </Space>
                <Space>
                  <UserOutlined style={{ color: '#52c41a' }} />
                  <Text strong>Số thành viên:</Text>
                  <Text>1 (Bạn)</Text>
                </Space>
                <Space>
                  <TeamOutlined style={{ color: '#1890ff' }} />
                  <Text strong>Trạng thái:</Text>
                  <Tag color="green">Đang mở</Tag>
                </Space>
              </Space>
            </Card>

            {/* Submit */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button 
                  size="large"
                  onClick={() => {
                    setShowCreateModal(false);
                    form.resetFields();
                  }}
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="primary" 
                  size="large"
                  htmlType="submit"
                  loading={creating}
                  icon={<PlusOutlined />}
                >
                  {creating ? 'Đang tạo nhóm...' : 'Tạo nhóm ngay'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
          </>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentGroups;
