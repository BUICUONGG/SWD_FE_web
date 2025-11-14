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
  Alert,
  Statistic,
  Badge,
  Modal,
  message,
  Descriptions,
  Divider,
  Input,
  Form,
  Popconfirm
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  CrownOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  CalendarOutlined,
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import { teamService, isApiError as isTeamApiError, isTeamResponse } from '../services/teamService';
import { userService, isApiError, isUserResponse } from '../services/userService';
import { enrollmentService, isApiError as isEnrollmentApiError, isEnrollmentListResponse } from '../services/enrollmentService';
import type { Team } from '../types/team';

const { Title, Text } = Typography;

const StudentGroupDetail: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentEnrollmentId, setCurrentEnrollmentId] = useState<number | null>(null);
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, [teamId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!teamId) {
        setError('Không tìm thấy nhóm');
        return;
      }

      // Fetch current user
      const userResponse = await userService.getCurrentUser();
      if (isApiError(userResponse)) {
        console.warn('Cannot load user, using sample data');
        setCurrentUserId(1);
        setCurrentEnrollmentId(1);
        // Use sample team data
        loadSampleTeam(parseInt(teamId));
        return;
      }
      
      if (isUserResponse(userResponse)) {
        setCurrentUserId(userResponse.data.userId);

        // Fetch team details
        const teamResponse = await teamService.getTeamById(parseInt(teamId));
        if (isTeamApiError(teamResponse)) {
          console.warn('Cannot load team, using sample data:', teamResponse.message);
          setCurrentEnrollmentId(1);
          loadSampleTeam(parseInt(teamId));
          return;
        }
        
        if (isTeamResponse(teamResponse)) {
          setTeam(teamResponse.data);
          setNewTeamName(teamResponse.data.name);
          
          // Fetch user's enrollment for this course
          if (teamResponse.data.courseId) {
            const enrollmentsResponse = await enrollmentService.getEnrollmentsByUser(userResponse.data.userId);
            if (!isEnrollmentApiError(enrollmentsResponse) && isEnrollmentListResponse(enrollmentsResponse)) {
              const courseEnrollment = enrollmentsResponse.data.find(
                (e) => e.courseId === teamResponse.data.courseId && e.status === 'APPROVED'
              );
              if (courseEnrollment) {
                setCurrentEnrollmentId(courseEnrollment.enrollmentId);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setCurrentUserId(1);
      setCurrentEnrollmentId(1);
      loadSampleTeam(parseInt(teamId || '1'));
    } finally {
      setLoading(false);
    }
  };

  const loadSampleTeam = (teamId: number) => {
    // Sample team data for demo - match backend structure
    const sampleTeam: Team = {
      id: teamId,
      name: `Team Innovation ${teamId}`,
      courseId: 1,
      courseName: 'SWD392 - Web Development',
      courseCode: 'SWD392',
      semesterId: 1,
      semesterName: 'Spring 2025',
      memberCount: 3,
      leaderId: 1,
      leaderName: 'Nguyễn Văn A',
      status: 'OPENING',
      members: [
        {
          enrollmentId: 1,
          userId: 1,
          userFullName: 'Nguyễn Văn A',
          userEmail: 'student1@fpt.edu.vn',
          isLeader: true,
          majorName: 'Software Engineering',
          id: 1,
          fullName: 'Nguyễn Văn A',
          email: 'student1@fpt.edu.vn',
          role: 'LEADER'
        },
        {
          enrollmentId: 2,
          userId: 2,
          userFullName: 'Trần Thị B',
          userEmail: 'student2@fpt.edu.vn',
          isLeader: false,
          majorName: 'Software Engineering',
          id: 2,
          fullName: 'Trần Thị B',
          email: 'student2@fpt.edu.vn',
          role: 'MEMBER'
        },
        {
          enrollmentId: 3,
          userId: 3,
          userFullName: 'Lê Văn C',
          userEmail: 'student3@fpt.edu.vn',
          isLeader: false,
          majorName: 'Software Engineering',
          id: 3,
          fullName: 'Lê Văn C',
          email: 'student3@fpt.edu.vn',
          role: 'MEMBER'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTeam(sampleTeam);
    setNewTeamName(sampleTeam.name);
    setError('Đang sử dụng dữ liệu mẫu (API không khả dụng)');
  };

  const handleUpdateTeamName = async () => {
    if (!team || !currentEnrollmentId || !newTeamName.trim()) {
      message.error('Vui lòng nhập tên nhóm hợp lệ');
      return;
    }

    try {
      setActionLoading(true);
      const response = await teamService.updateTeamName(team.id, currentEnrollmentId, newTeamName);
      
      if (isTeamApiError(response)) {
        message.error(response.message || 'Cập nhật thất bại');
      } else {
        message.success('Cập nhật tên nhóm thành công');
        setEditNameModalVisible(false);
        fetchData(); // Reload data
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật tên nhóm');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberEnrollmentId: number, memberName: string) => {
    if (!team || !currentEnrollmentId) return;

    try {
      setActionLoading(true);
      const response = await teamService.removeMember(team.id, currentEnrollmentId, memberEnrollmentId);
      
      if ('success' in response && response.success) {
        message.success(`Đã xóa ${memberName} khỏi nhóm`);
        fetchData();
      } else {
        message.error(response.message || 'Xóa thành viên thất bại');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa thành viên');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!team || !currentEnrollmentId) return;

    try {
      setActionLoading(true);
      const response = await teamService.leaveTeam(team.id, currentEnrollmentId);
      
      if ('success' in response && response.success) {
        message.success('Đã rời khỏi nhóm');
        navigate('/student/dashboard');
      } else {
        message.error(response.message || 'Rời nhóm thất bại');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi rời nhóm');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisbandTeam = async () => {
    if (!team || !currentEnrollmentId) return;

    try {
      setActionLoading(true);
      const response = await teamService.disbandTeam(team.id, currentEnrollmentId);
      
      if ('success' in response && response.success) {
        message.success('Đã giải tán nhóm');
        navigate('/student/dashboard');
      } else {
        message.error(response.message || 'Giải tán nhóm thất bại');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi giải tán nhóm');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" tip="Đang tải thông tin nhóm..." />
        </div>
      </StudentLayout>
    );
  }

  if (error || !team) {
    return (
      <StudentLayout>
        <div style={{ padding: '24px' }}>
          <Alert
            message="Lỗi"
            description={error || 'Không tìm thấy nhóm'}
            type="error"
            showIcon
            action={
              <Space>
                <Button onClick={() => navigate('/student/dashboard')}>
                  Quay lại
                </Button>
                <Button type="primary" onClick={fetchData}>
                  Thử lại
                </Button>
              </Space>
            }
          />
        </div>
      </StudentLayout>
    );
  }

  const isUserInTeam = currentUserId ? team.members?.some(m => m && m.userId === currentUserId) || false : false;
  const isUserLeader = currentUserId ? team.members?.some(m => m && m.userId === currentUserId && m.isLeader) || false : false;
  const leader = team.members?.find(m => m && m.isLeader);
  const members = team.members?.filter(m => m && !m.isLeader) || [];

  return (
    <StudentLayout>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
        {/* Back Button */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/student/dashboard')}
          style={{ marginBottom: '16px' }}
        >
          Quay lại Dashboard
        </Button>

        {/* Team Header Card */}
        <Card 
          style={{ 
            marginBottom: 24, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            border: 'none' 
          }}
        >
          <Row align="middle" gutter={16}>
            <Col flex="auto">
              <Space direction="vertical" size={4}>
                <Space align="center">
                  <Avatar 
                    size={64} 
                    icon={<TeamOutlined />} 
                    style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
                  />
                  <div>
                    <Title level={2} style={{ color: 'white', margin: 0 }}>
                      {team.name}
                    </Title>
                    <Space style={{ marginTop: 8 }}>
                      <Tag color={team.status === 'OPENING' ? 'success' : 'default'} style={{ fontSize: '14px' }}>
                        {team.status === 'OPENING' ? 'Đang mở' : team.status}
                      </Tag>
                      {isUserLeader && (
                        <Tag icon={<CrownOutlined />} color="gold" style={{ fontSize: '14px' }}>
                          Bạn là Nhóm trưởng
                        </Tag>
                      )}
                      {isUserInTeam && !isUserLeader && (
                        <Tag color="blue" style={{ fontSize: '14px' }}>
                          Bạn là Thành viên
                        </Tag>
                      )}
                    </Space>
                  </div>
                </Space>
              </Space>
            </Col>
            {isUserLeader && (
              <Col>
                <Space>
                  <Button 
                    icon={<EditOutlined />} 
                    onClick={() => setEditNameModalVisible(true)}
                    size="large"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'white', color: 'white' }}
                  >
                    Đổi tên nhóm
                  </Button>
                  <Popconfirm
                    title="Giải tán nhóm"
                    description="Bạn có chắc chắn muốn giải tán nhóm này? Hành động này không thể hoàn tác!"
                    onConfirm={handleDisbandTeam}
                    okText="Giải tán"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                    icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                  >
                    <Button 
                      danger
                      icon={<DeleteOutlined />}
                      size="large"
                      loading={actionLoading}
                    >
                      Giải tán nhóm
                    </Button>
                  </Popconfirm>
                </Space>
              </Col>
            )}
            {isUserInTeam && !isUserLeader && (
              <Col>
                <Popconfirm
                  title="Rời khỏi nhóm"
                  description="Bạn có chắc chắn muốn rời khỏi nhóm này?"
                  onConfirm={handleLeaveTeam}
                  okText="Rời nhóm"
                  cancelText="Hủy"
                  icon={<ExclamationCircleOutlined style={{ color: 'orange' }} />}
                >
                  <Button 
                    icon={<LogoutOutlined />}
                    size="large"
                    loading={actionLoading}
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'white', color: 'white' }}
                  >
                    Rời nhóm
                  </Button>
                </Popconfirm>
              </Col>
            )}
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          {/* Left Column - Team Info & Members */}
          <Col xs={24} lg={16}>
            {/* Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12}>
                <Card>
                  <Statistic
                    title="Tổng thành viên"
                    value={team.members?.length || 0}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card>
                  <Statistic
                    title="Trạng thái"
                    value={team.status === 'OPENING' ? 'Đang mở' : team.status === 'CLOSED' ? 'Đã đóng' : team.status}
                    valueStyle={{ color: team.status === 'OPENING' ? '#52c41a' : '#ff4d4f', fontSize: '20px' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Team Information */}
            <Card title={<Space><BookOutlined /> Thông tin nhóm</Space>} style={{ marginBottom: 16 }}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Khóa học">
                  <Text strong>{team.courseName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Nhóm trưởng">
                  <Space>
                    <CrownOutlined style={{ color: '#faad14' }} />
                    <Text strong>{team.leaderName}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  <Space>
                    <CalendarOutlined />
                    {team.createdAt ? new Date(team.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Cập nhật lần cuối">
                  {team.updatedAt ? new Date(team.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Team Leader */}
            {leader && (
              <Card 
                title={
                  <Space>
                    <CrownOutlined style={{ color: '#faad14' }} />
                    <span>Nhóm trưởng</span>
                  </Space>
                } 
                style={{ marginBottom: 16 }}
              >
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge count={<CrownOutlined style={{ color: '#faad14' }} />}>
                        <Avatar 
                          size={48} 
                          src={leader.avatarUrl} 
                          icon={<UserOutlined />}
                          style={{ backgroundColor: '#faad14' }}
                        />
                      </Badge>
                    }
                    title={
                      <Space>
                        <Text strong style={{ fontSize: '16px' }}>{leader.fullName}</Text>
                        <Tag color="gold">Leader</Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={2}>
                        <Text type="secondary">
                          <MailOutlined /> {leader.email}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <CalendarOutlined /> Tham gia: {leader.joinedAt ? new Date(leader.joinedAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              </Card>
            )}

            {/* Team Members */}
            <Card 
              title={
                <Space>
                  <UserOutlined />
                  <span>Thành viên ({members.length})</span>
                </Space>
              }
            >
              {members.length === 0 ? (
                <Alert
                  message="Chưa có thành viên nào"
                  description="Nhóm hiện chỉ có nhóm trưởng"
                  type="info"
                  showIcon
                />
              ) : (
                <List
                  dataSource={members}
                  renderItem={(member) => (
                    <List.Item
                      actions={
                        isUserLeader ? [
                          <Popconfirm
                            title="Xóa thành viên"
                            description={`Bạn có chắc chắn muốn xóa ${member.fullName} khỏi nhóm?`}
                            onConfirm={() => handleRemoveMember(member.userId, member.userFullName || member.fullName || 'Unknown')}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                          >
                            <Button 
                              type="text" 
                              danger 
                              icon={<DeleteOutlined />}
                              loading={actionLoading}
                            >
                              Xóa
                            </Button>
                          </Popconfirm>
                        ] : undefined
                      }
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            size={48} 
                            src={member.avatarUrl} 
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#1890ff' }}
                          />
                        }
                        title={
                          <Space>
                            <Text strong>{member.fullName}</Text>
                            {member.userId === currentUserId && (
                              <Tag color="blue">Bạn</Tag>
                            )}
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size={2}>
                            <Text type="secondary">
                              <MailOutlined /> {member.email}
                            </Text>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                <CalendarOutlined /> Tham gia: {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('vi-VN') : 'N/A'}
                              </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>

          {/* Right Column - Quick Actions & Info */}
          <Col xs={24} lg={8}>
            <Card title="🎯 Thông tin nhanh" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <Text type="secondary">Trạng thái nhóm</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color={team.status === 'OPENING' ? 'success' : 'default'} style={{ fontSize: '14px' }}>
                      {team.status === 'OPENING' ? '🟢 Đang mở' : team.status}
                    </Tag>
                  </div>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div>
                  <Text type="secondary">Số thành viên</Text>
                  <div style={{ marginTop: 8, fontSize: '18px', fontWeight: 'bold' }}>
                    {team.members?.length || 0} thành viên
                  </div>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div>
                  <Text type="secondary">Vai trò của bạn</Text>
                  <div style={{ marginTop: 8 }}>
                    {isUserLeader ? (
                      <Tag icon={<CrownOutlined />} color="gold" style={{ fontSize: '14px' }}>
                        Nhóm trưởng
                      </Tag>
                    ) : isUserInTeam ? (
                      <Tag color="blue" style={{ fontSize: '14px' }}>
                        Thành viên
                      </Tag>
                    ) : (
                      <Tag color="default" style={{ fontSize: '14px' }}>
                        Chưa tham gia
                      </Tag>
                    )}
                  </div>
                </div>
              </Space>
            </Card>

            {/* Quick Links */}
            <Card title="🔗 Liên kết nhanh">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  block 
                  onClick={() => navigate('/student/dashboard')}
                  icon={<TeamOutlined />}
                >
                  Xem tất cả nhóm
                </Button>
                <Button 
                  block 
                  onClick={() => navigate('/student/courses')}
                  icon={<BookOutlined />}
                >
                  Khóa học của tôi
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Edit Team Name Modal */}
        <Modal
          title="Đổi tên nhóm"
          open={editNameModalVisible}
          onOk={handleUpdateTeamName}
          onCancel={() => setEditNameModalVisible(false)}
          confirmLoading={actionLoading}
          okText="Cập nhật"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item label="Tên nhóm mới">
              <Input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Nhập tên nhóm mới"
                maxLength={100}
                showCount
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </StudentLayout>
  );
};

export default StudentGroupDetail;
