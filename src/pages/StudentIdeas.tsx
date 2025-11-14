import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  List,
  Button,
  Spin,
  Space,
  Typography,
  Empty,
  Alert,
  Modal,
  Form,
  Input,
  message,
  Select,
  Tooltip,
  Popconfirm
} from 'antd';
import {
  BulbOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined
} from '@ant-design/icons';
import StudentLayout from '../components/StudentLayout';
import { ideaService, isApiError as isIdeaApiError, isIdeaListResponse } from '../services/ideaService';
import { enrollmentService, isApiError as isEnrollmentApiError, isEnrollmentListResponse } from '../services/enrollmentService';
import { userService, isApiError, isUserResponse } from '../services/userService';
import type { Idea } from '../types/idea';
import type { Enrollment } from '../types/enrollment';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const StudentIdeas: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

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

        // Fetch user's enrollments
        const enrollmentsResponse = await enrollmentService.getEnrollmentsByUser(userId);
        if (isEnrollmentApiError(enrollmentsResponse)) {
          setError('Không thể lấy danh sách đăng ký: ' + enrollmentsResponse.message);
          return;
        }
        if (isEnrollmentListResponse(enrollmentsResponse)) {
          const approvedEnrollments = enrollmentsResponse.data.filter((e: Enrollment) => e.status === 'APPROVED');
          setEnrollments(approvedEnrollments);
          
          if (approvedEnrollments.length > 0) {
            const firstEnrollmentId = approvedEnrollments[0].enrollmentId;
            setSelectedEnrollmentId(firstEnrollmentId);
            await loadIdeas(firstEnrollmentId);
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

  const loadIdeas = async (enrollmentId: number) => {
    try {
      const response = await ideaService.getMyIdeas(enrollmentId);
      
      if (isIdeaApiError(response)) {
        console.error('Failed to load ideas:', response.message);
        setIdeas([]);
        return;
      }
      
      if (isIdeaListResponse(response)) {
        setIdeas(response.data);
      }
    } catch (err) {
      console.error('Error loading ideas:', err);
      setIdeas([]);
    }
  };

  useEffect(() => {
    if (selectedEnrollmentId) {
      loadIdeas(selectedEnrollmentId);
    } else {
      setIdeas([]);
    }
  }, [selectedEnrollmentId]);

  const handleCreateIdea = async (values: { name: string; description: string }) => {
    if (!selectedEnrollmentId) {
      message.error('Vui lòng chọn lớp học');
      return;
    }

    setSubmitting(true);
    try {
      const response = await ideaService.createIdea({
        enrollmentId: selectedEnrollmentId,
        name: values.name,
        description: values.description
      });

      if (isIdeaApiError(response)) {
        message.error(response.message || 'Tạo ý tưởng thất bại');
      } else {
        message.success('Tạo ý tưởng thành công!');
        setShowCreateModal(false);
        form.resetFields();
        await loadIdeas(selectedEnrollmentId);
      }
    } catch (err) {
      console.error('Error creating idea:', err);
      message.error('Có lỗi xảy ra khi tạo ý tưởng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditIdea = async (values: { name: string; description: string }) => {
    if (!editingIdea || !selectedEnrollmentId) return;

    setSubmitting(true);
    try {
      const response = await ideaService.updateIdea(editingIdea.ideaId, {
        enrollmentId: selectedEnrollmentId,
        name: values.name,
        description: values.description
      });

      if (isIdeaApiError(response)) {
        message.error(response.message || 'Cập nhật ý tưởng thất bại');
      } else {
        message.success('Cập nhật ý tưởng thành công!');
        setShowEditModal(false);
        setEditingIdea(null);
        form.resetFields();
        await loadIdeas(selectedEnrollmentId);
      }
    } catch (err) {
      console.error('Error updating idea:', err);
      message.error('Có lỗi xảy ra khi cập nhật ý tưởng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteIdea = async (ideaId: number) => {
    if (!selectedEnrollmentId) return;

    try {
      const response = await ideaService.deleteIdea(ideaId, selectedEnrollmentId);

      if (isIdeaApiError(response)) {
        message.error(response.message || 'Xóa ý tưởng thất bại');
      } else {
        message.success('Xóa ý tưởng thành công!');
        await loadIdeas(selectedEnrollmentId);
      }
    } catch (err) {
      console.error('Error deleting idea:', err);
      message.error('Có lỗi xảy ra khi xóa ý tưởng');
    }
  };

  const openEditModal = (idea: Idea) => {
    setEditingIdea(idea);
    form.setFieldsValue({
      name: idea.name,
      description: idea.description
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" tip="Đang tải ý tưởng..." />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: 'none' }}>
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            💡 Ý tưởng của tôi
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: '8px 0 0 0' }}>
            Tạo và quản lý các ý tưởng dự án của bạn
          </Paragraph>
        </Card>

        {/* Nếu chưa đăng ký môn học */}
        {enrollments.length === 0 && (
          <Alert
            message="Bạn cần đăng ký môn học trước khi tạo ý tưởng."
            description="Vui lòng đăng ký môn học tại trang Khóa học của tôi."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Nếu có enrollment */}
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

            {/* Filter & Actions */}
            <Card style={{ marginBottom: 16 }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space>
                  <Text>Lọc theo lớp:</Text>
                  <Select
                    style={{ width: 300 }}
                    placeholder="Chọn lớp học"
                    value={selectedEnrollmentId}
                    onChange={setSelectedEnrollmentId}
                  >
                    {enrollments.map(enrollment => (
                      <Select.Option key={enrollment.enrollmentId} value={enrollment.enrollmentId}>
                        {enrollment.courseName} ({enrollment.courseCode})
                      </Select.Option>
                    ))}
                  </Select>
                </Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => setShowCreateModal(true)}
                  disabled={!selectedEnrollmentId}
                >
                  Tạo ý tưởng mới
                </Button>
              </Space>
            </Card>

            {/* Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={8}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>
                      {ideas.length}
                    </div>
                    <Text type="secondary">Tổng số ý tưởng</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#52c41a' }}>
                      {enrollments.length}
                    </div>
                    <Text type="secondary">Lớp đã đăng ký</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#faad14' }}>
                      {ideas.filter(i => i.enrollment.enrollmentId === selectedEnrollmentId).length}
                    </div>
                    <Text type="secondary">Ý tưởng lớp này</Text>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Ideas List */}
            <Card title={<><BulbOutlined /> Danh sách ý tưởng</>}>
              {ideas.length === 0 ? (
                <Empty
                  description="Chưa có ý tưởng nào"
                  style={{ padding: '40px 0' }}
                >
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Tạo ý tưởng đầu tiên
                  </Button>
                </Empty>
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
                  dataSource={ideas}
                  renderItem={(idea) => (
                    <List.Item>
                      <Card
                        hoverable
                        actions={[
                          <Tooltip title="Chỉnh sửa">
                            <Button 
                              icon={<EditOutlined />}
                              onClick={() => openEditModal(idea)}
                            />
                          </Tooltip>,
                          <Popconfirm
                            title="Xóa ý tưởng"
                            description="Bạn có chắc chắn muốn xóa ý tưởng này?"
                            onConfirm={() => handleDeleteIdea(idea.ideaId)}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                          >
                            <Tooltip title="Xóa">
                              <Button 
                                danger
                                icon={<DeleteOutlined />}
                              />
                            </Tooltip>
                          </Popconfirm>
                        ]}
                      >
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                          {/* Idea Header */}
                          <div>
                            <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                              {idea.name}
                            </Title>
                          </div>

                          {/* Description */}
                          <Paragraph 
                            ellipsis={{ rows: 3, expandable: true }}
                            style={{ marginBottom: 0 }}
                          >
                            {idea.description}
                          </Paragraph>

                          {/* Course Info */}
                          <Space>
                            <BookOutlined style={{ color: '#1890ff' }} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {idea.enrollment.course?.name || 'N/A'}
                            </Text>
                          </Space>

                          {/* Created Date */}
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Tạo: {new Date(idea.createdAt).toLocaleString('vi-VN')}
                          </Text>
                          
                          {idea.createdAt !== idea.updatedAt && (
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Cập nhật: {new Date(idea.updatedAt).toLocaleString('vi-VN')}
                            </Text>
                          )}
                        </Space>
                      </Card>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </>
        )}

        {/* Create Idea Modal */}
        <Modal
          title="➕ Tạo ý tưởng mới"
          open={showCreateModal}
          onCancel={() => {
            setShowCreateModal(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateIdea}
          >
            <Form.Item
              name="name"
              label="Tên ý tưởng"
              rules={[
                { required: true, message: 'Vui lòng nhập tên ý tưởng' },
                { min: 5, message: 'Tên ý tưởng phải có ít nhất 5 ký tự' },
                { max: 200, message: 'Tên ý tưởng không được quá 200 ký tự' }
              ]}
            >
              <Input 
                placeholder="VD: Hệ thống quản lý bán hàng trực tuyến"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả chi tiết"
              rules={[
                { required: true, message: 'Vui lòng nhập mô tả' },
                { min: 20, message: 'Mô tả phải có ít nhất 20 ký tự' },
                { max: 2000, message: 'Mô tả không được quá 2000 ký tự' }
              ]}
            >
              <TextArea
                placeholder="Mô tả chi tiết về ý tưởng của bạn..."
                rows={6}
                size="large"
                showCount
                maxLength={2000}
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
                  loading={submitting}
                  icon={<PlusOutlined />}
                >
                  Tạo ý tưởng
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Idea Modal */}
        <Modal
          title="✏️ Chỉnh sửa ý tưởng"
          open={showEditModal}
          onCancel={() => {
            setShowEditModal(false);
            setEditingIdea(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEditIdea}
          >
            <Form.Item
              name="name"
              label="Tên ý tưởng"
              rules={[
                { required: true, message: 'Vui lòng nhập tên ý tưởng' },
                { min: 5, message: 'Tên ý tưởng phải có ít nhất 5 ký tự' },
                { max: 200, message: 'Tên ý tưởng không được quá 200 ký tự' }
              ]}
            >
              <Input 
                placeholder="VD: Hệ thống quản lý bán hàng trực tuyến"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả chi tiết"
              rules={[
                { required: true, message: 'Vui lòng nhập mô tả' },
                { min: 20, message: 'Mô tả phải có ít nhất 20 ký tự' },
                { max: 2000, message: 'Mô tả không được quá 2000 ký tự' }
              ]}
            >
              <TextArea
                placeholder="Mô tả chi tiết về ý tưởng của bạn..."
                rows={6}
                size="large"
                showCount
                maxLength={2000}
              />
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => {
                  setShowEditModal(false);
                  setEditingIdea(null);
                  form.resetFields();
                }}>
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={submitting}
                  icon={<EditOutlined />}
                >
                  Cập nhật
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </StudentLayout>
  );
};

export default StudentIdeas;
