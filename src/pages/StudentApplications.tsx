import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Tag,
  Button,
  Spin,
  Space,
  Typography,
  Empty,
  Alert,
  Tabs,
  Modal,
  message,
  Descriptions,
  Divider,
} from 'antd';
import {
  SendOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import { applicationService, isApiError as isApplicationApiError, isApplicationListResponse } from '../services/applicationService';
import { enrollmentService, isApiError as isEnrollmentApiError, isEnrollmentListResponse } from '../services/enrollmentService';
import { userService, isApiError, isUserResponse } from '../services/userService';
import type { Application } from '../types/application';
import type { Enrollment } from '../types/enrollment';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

const StudentApplications: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

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

      // Fetch user's enrollments
      const enrollmentsResponse = await enrollmentService.getEnrollmentsByUser(userId);
      if (isEnrollmentApiError(enrollmentsResponse)) {
        setError('Không thể lấy danh sách đăng ký: ' + enrollmentsResponse.message);
        return;
      }
      if (isEnrollmentListResponse(enrollmentsResponse)) {
        const activeEnrollments = enrollmentsResponse.data.filter((e: Enrollment) => !e.isDeleted);
        setEnrollments(activeEnrollments);

        // Fetch applications for all enrollments
        const allApplications: Application[] = [];
        for (const enrollment of activeEnrollments) {
          const appsResponse = await applicationService.getMyApplications(enrollment.enrollmentId);
          if (isApplicationListResponse(appsResponse)) {
            allApplications.push(...appsResponse.data);
          }
        }
        setApplications(allApplications);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async (application: Application) => {
    confirm({
      title: 'Chấp nhận lời mời',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      content: `Bạn có chắc muốn tham gia nhóm "${application.teamName}"?`,
      okText: 'Chấp nhận',
      cancelText: 'Hủy',
      okType: 'primary',
      onOk: async () => {
        setProcessing(application.applicationId);
        try {
          const response = await applicationService.handleApplication(
            application.applicationId,
            application.enrollmentId,
            true
          );

          if (isApplicationApiError(response)) {
            message.error(response.message || 'Chấp nhận lời mời thất bại');
          } else {
            message.success('Bạn đã tham gia nhóm thành công!');
            await fetchData();
          }
        } catch (err) {
          console.error('Error accepting invite:', err);
          message.error('Có lỗi xảy ra khi chấp nhận lời mời');
        } finally {
          setProcessing(null);
        }
      },
    });
  };

  const handleRejectInvite = async (application: Application) => {
    confirm({
      title: 'Từ chối lời mời',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: `Bạn có chắc muốn từ chối lời mời vào nhóm "${application.teamName}"?`,
      okText: 'Từ chối',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        setProcessing(application.applicationId);
        try {
          const response = await applicationService.handleApplication(
            application.applicationId,
            application.enrollmentId,
            false
          );

          if (isApplicationApiError(response)) {
            message.error(response.message || 'Từ chối lời mời thất bại');
          } else {
            message.success('Đã từ chối lời mời');
            await fetchData();
          }
        } catch (err) {
          console.error('Error rejecting invite:', err);
          message.error('Có lỗi xảy ra khi từ chối lời mời');
        } finally {
          setProcessing(null);
        }
      },
    });
  };

  const handleCancelApplication = async (application: Application) => {
    confirm({
      title: 'Hủy đơn',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc muốn hủy đơn apply vào nhóm "${application.teamName}"?`,
      okText: 'Hủy đơn',
      cancelText: 'Đóng',
      okType: 'danger',
      onOk: async () => {
        setProcessing(application.applicationId);
        try {
          const response = await applicationService.cancelApplication(
            application.applicationId,
            application.enrollmentId
          );

          if (isApplicationApiError(response)) {
            message.error(response.message || 'Hủy đơn thất bại');
          } else {
            message.success('Đã hủy đơn thành công');
            await fetchData();
          }
        } catch (err) {
          console.error('Error cancelling application:', err);
          message.error('Có lỗi xảy ra khi hủy đơn');
        } finally {
          setProcessing(null);
        }
      },
    });
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Tag icon={<ClockCircleOutlined />} color="warning">Đang chờ</Tag>;
      case 'APPROVED':
        return <Tag icon={<CheckCircleOutlined />} color="success">Đã chấp nhận</Tag>;
      case 'REJECTED':
        return <Tag icon={<CloseCircleOutlined />} color="error">Đã từ chối</Tag>;
      case 'CANCELLED':
        return <Tag icon={<CloseCircleOutlined />} color="default">Đã hủy</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const renderApplicationItem = (application: Application) => {
    const isApply = application.applicationType === 'APPLY';
    const isPending = application.status === 'PENDING';

    return (
      <List.Item
        key={application.applicationId}
        actions={
          isPending
            ? isApply
              ? [
                  <Button
                    key="cancel"
                    danger
                    size="small"
                    loading={processing === application.applicationId}
                    onClick={() => handleCancelApplication(application)}
                  >
                    Hủy đơn
                  </Button>,
                ]
              : [
                  <Button
                    key="accept"
                    type="primary"
                    size="small"
                    icon={<CheckCircleOutlined />}
                    loading={processing === application.applicationId}
                    onClick={() => handleAcceptInvite(application)}
                  >
                    Chấp nhận
                  </Button>,
                  <Button
                    key="reject"
                    danger
                    size="small"
                    icon={<CloseCircleOutlined />}
                    loading={processing === application.applicationId}
                    onClick={() => handleRejectInvite(application)}
                  >
                    Từ chối
                  </Button>,
                ]
            : []
        }
      >
        <List.Item.Meta
          avatar={
            isApply ? (
              <SendOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            ) : (
              <MailOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
            )
          }
          title={
            <Space>
              <Text strong>{application.teamName}</Text>
              {getStatusTag(application.status)}
            </Space>
          }
          description={
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space>
                <BookOutlined />
                <Text type="secondary">{application.courseName}</Text>
              </Space>
              {!isApply && application.invitedByName && (
                <Space>
                  <UserOutlined />
                  <Text type="secondary">Được mời bởi: {application.invitedByName}</Text>
                </Space>
              )}
              <Text type="secondary">
                Ngày gửi: {new Date(application.createdAt).toLocaleDateString('vi-VN')}
              </Text>
              {application.handledAt && (
                <Text type="secondary">
                  Ngày xử lý: {new Date(application.handledAt).toLocaleDateString('vi-VN')}
                </Text>
              )}
            </Space>
          }
        />
      </List.Item>
    );
  };

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" tip="Đang tải danh sách đơn..." />
        </div>
      </StudentLayout>
    );
  }

  const appliedApplications = applications.filter(app => app.applicationType === 'APPLY');
  const invitations = applications.filter(app => app.applicationType === 'INVITE');

  return (
    <StudentLayout>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            📋 Đơn của tôi
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
            Quản lý các đơn apply và lời mời tham gia nhóm
          </Text>
        </Card>

        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
        )}

        {enrollments.length === 0 && (
          <Alert
            message="Bạn cần đăng ký môn học trước"
            description="Vui lòng đăng ký môn học tại trang Khóa học của tôi."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Applications Tabs */}
        <Card>
          <Tabs defaultActiveKey="all">
            <TabPane
              tab={
                <span>
                  <TeamOutlined />
                  Tất cả ({applications.length})
                </span>
              }
              key="all"
            >
              {applications.length === 0 ? (
                <Empty description="Chưa có đơn nào" />
              ) : (
                <List
                  dataSource={applications}
                  renderItem={renderApplicationItem}
                />
              )}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <SendOutlined />
                  Đã apply ({appliedApplications.length})
                </span>
              }
              key="applied"
            >
              {appliedApplications.length === 0 ? (
                <Empty description="Bạn chưa apply vào nhóm nào" />
              ) : (
                <List
                  dataSource={appliedApplications}
                  renderItem={renderApplicationItem}
                />
              )}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <MailOutlined />
                  Lời mời ({invitations.length})
                </span>
              }
              key="invitations"
            >
              {invitations.length === 0 ? (
                <Empty description="Bạn chưa nhận được lời mời nào" />
              ) : (
                <List
                  dataSource={invitations}
                  renderItem={renderApplicationItem}
                />
              )}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <ClockCircleOutlined />
                  Đang chờ ({applications.filter(a => a.status === 'PENDING').length})
                </span>
              }
              key="pending"
            >
              {applications.filter(a => a.status === 'PENDING').length === 0 ? (
                <Empty description="Không có đơn đang chờ xử lý" />
              ) : (
                <List
                  dataSource={applications.filter(a => a.status === 'PENDING')}
                  renderItem={renderApplicationItem}
                />
              )}
            </TabPane>
          </Tabs>
        </Card>

        {/* Info Card */}
        <Card style={{ marginTop: 24 }} title="📖 Hướng dẫn">
          <Descriptions column={1}>
            <Descriptions.Item label="Đơn Apply">
              Đơn bạn đã gửi để xin tham gia nhóm. Chờ nhóm trưởng phê duyệt.
            </Descriptions.Item>
            <Descriptions.Item label="Lời mời">
              Lời mời từ nhóm trưởng mời bạn tham gia nhóm. Bạn có thể chấp nhận hoặc từ chối.
            </Descriptions.Item>
            <Descriptions.Item label="Lưu ý">
              Khi chấp nhận lời mời hoặc đơn apply được approve, bạn sẽ tự động tham gia nhóm và các đơn khác sẽ bị hủy.
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentApplications;
