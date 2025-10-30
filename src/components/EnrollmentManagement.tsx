import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Card,
  Row,
  Col,
  Button,
  Space,
  Tag,
  message,
  Statistic,
  Typography,
  Modal,
  Form,
  InputNumber,
  Popconfirm,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  FilterOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { 
  Enrollment, 
  EnrollmentSearchParams, 
  CreateEnrollmentRequest,
  EnrollmentStatus 
} from '../types/enrollment';
import { enrollmentService, isApiError } from '../services/enrollmentService';

const { Text, Title } = Typography;

export const EnrollmentManagement: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<EnrollmentSearchParams>({});
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    cancelled: 0
  });

  // Search timeout ref
  const searchTimeoutRef = useRef<number | null>(null);

  // Auto search effect
  useEffect(() => {
    const performSearch = async (params: EnrollmentSearchParams) => {
      setLoading(true);
      try {
        const response = await enrollmentService.searchEnrollments(params);
        
        if (isApiError(response)) {
          message.error(response.message);
          return;
        }

        setEnrollments(response.data);
        calculateStatistics(response.data);
      } catch {
        message.error('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounce (immediate for filters, no need for delay)
    const timeout = window.setTimeout(() => {
      performSearch(searchParams);
    }, 0);

    searchTimeoutRef.current = timeout;

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchParams]);

  // Calculate statistics
  const calculateStatistics = (enrollmentList: Enrollment[]) => {
    const stats = {
      total: enrollmentList.length,
      pending: enrollmentList.filter(e => e.status === 'PENDING').length,
      approved: enrollmentList.filter(e => e.status === 'APPROVED').length,
      completed: enrollmentList.filter(e => e.status === 'COMPLETED').length,
      cancelled: enrollmentList.filter(e => e.status === 'CANCELLED').length
    };
    setStatistics(stats);
  };

  // Handle create enrollment
  const handleSubmit = async (values: {
    userId: number;
    courseId: number;
  }) => {
    setLoading(true);
    try {
      const enrollmentData: CreateEnrollmentRequest = {
        userId: values.userId,
        courseId: values.courseId
      };

      const response = await enrollmentService.createEnrollment(enrollmentData);

      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success('Tạo đăng ký thành công!');
      setIsModalVisible(false);
      form.resetFields();
      // Trigger reload by resetting search params
      setSearchParams({});
    } catch {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle approve enrollment
  const handleApprove = async (enrollmentId: number) => {
    setLoading(true);
    try {
      // For demo, using hardcoded approver ID. In real app, get from auth context
      const approverId = 1; // Should be current user ID
      const response = await enrollmentService.approveEnrollment(enrollmentId, approverId);

      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success('Phê duyệt đăng ký thành công!');
      setSearchParams({}); // Trigger reload
    } catch {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle complete enrollment
  const handleComplete = async (enrollmentId: number) => {
    setLoading(true);
    try {
      const response = await enrollmentService.completeEnrollment(enrollmentId);

      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success('Đánh dấu hoàn thành thành công!');
      setSearchParams({}); // Trigger reload
    } catch {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel enrollment
  const handleCancel = async (enrollmentId: number) => {
    setLoading(true);
    try {
      const response = await enrollmentService.cancelEnrollment(enrollmentId);

      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success('Hủy đăng ký thành công!');
      setSearchParams({}); // Trigger reload
    } catch {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns: ColumnsType<Enrollment> = [
    {
      title: 'ID',
      dataIndex: 'enrollmentId',
      key: 'enrollmentId',
      width: 80,
      fixed: 'left',
    },
    {
      title: 'Sinh viên',
      key: 'student',
      width: 200,
      render: (_, record) => (
        <div>
          <div><strong>{record.userName}</strong></div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.userId} • {record.userEmail}
          </div>
        </div>
      ),
    },
    {
      title: 'Khóa học',
      key: 'course',
      width: 250,
      render: (_, record) => (
        <div>
          <div><strong>{record.courseName}</strong></div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.courseCode} • ID: {record.courseId}
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: EnrollmentStatus) => {
        const colors = {
          PENDING: 'orange',
          APPROVED: 'green',
          COMPLETED: 'blue',
          CANCELLED: 'red'
        };
        const labels = {
          PENDING: 'Chờ duyệt',
          APPROVED: 'Đã duyệt',
          COMPLETED: 'Hoàn thành',
          CANCELLED: 'Đã hủy'
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: 'Người duyệt',
      key: 'approver',
      width: 150,
      render: (_, record) => (
        record.approvedByName ? (
          <div>
            <div style={{ fontSize: '12px' }}>{record.approvedByName}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              {record.approvedDate ? new Date(record.approvedDate).toLocaleDateString('vi-VN') : ''}
            </div>
          </div>
        ) : (
          <span style={{ color: '#ccc' }}>—</span>
        )
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'PENDING' && (
            <Tooltip title="Phê duyệt">
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.enrollmentId)}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              />
            </Tooltip>
          )}
          {record.status === 'APPROVED' && (
            <Tooltip title="Đánh dấu hoàn thành">
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleComplete(record.enrollmentId)}
              />
            </Tooltip>
          )}
          {(record.status === 'PENDING' || record.status === 'APPROVED') && (
            <Popconfirm
              title="Bạn có chắc chắn muốn hủy đăng ký này?"
              onConfirm={() => handleCancel(record.enrollmentId)}
              okText="Có"
              cancelText="Không"
            >
              <Tooltip title="Hủy đăng ký">
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          📝 Quản lý Đăng ký
        </Title>
        <Text type="secondary">
          Quản lý đăng ký khóa học của sinh viên trong hệ thống
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Tổng đăng ký"
              value={statistics.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={statistics.pending}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã duyệt"
              value={statistics.approved}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={statistics.completed}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={statistics.cancelled}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Tỷ lệ duyệt"
              value={statistics.total > 0 ? `${Math.round((statistics.approved / statistics.total) * 100)}%` : '0%'}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Controls */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col span={8}>
            <InputNumber
              placeholder="Tìm kiếm theo ID Sinh viên..."
              prefix={<SearchOutlined />}
              style={{ width: '100%' }}
              value={searchParams.userId}
              onChange={(value) => setSearchParams({ ...searchParams, userId: value || undefined })}
            />
          </Col>
          <Col span={6}>
            <InputNumber
              placeholder="ID Khóa học"
              style={{ width: '100%' }}
              value={searchParams.courseId}
              onChange={(value) => setSearchParams({ ...searchParams, courseId: value || undefined })}
            />
          </Col>
          <Col span={4}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setSearchParams({})}
            >
              Xóa bộ lọc
            </Button>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => setSearchParams({})}
                loading={loading}
              >
                Tải lại
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Tạo đăng ký
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={enrollments}
          rowKey="enrollmentId"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: enrollments.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đăng ký`,
          }}
        />
      </Card>

      {/* Create Enrollment Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusOutlined />
            <span>Tạo đăng ký mới</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '24px' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="ID Sinh viên"
                name="userId"
                rules={[
                  { required: true, message: 'Vui lòng nhập ID sinh viên!' },
                  { type: 'number', min: 1, message: 'ID phải là số dương!' }
                ]}
              >
                <InputNumber
                  placeholder="Nhập ID sinh viên"
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ID Khóa học"
                name="courseId"
                rules={[
                  { required: true, message: 'Vui lòng nhập ID khóa học!' },
                  { type: 'number', min: 1, message: 'ID phải là số dương!' }
                ]}
              >
                <InputNumber
                  placeholder="Nhập ID khóa học"
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Tạo đăng ký
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default EnrollmentManagement;