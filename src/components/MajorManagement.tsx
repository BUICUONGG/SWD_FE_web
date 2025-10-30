import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Typography,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Tooltip,
  Switch
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FilterOutlined,
  BookOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { majorService, isApiError, isMajorListResponse } from '../services/majorService';
import type { Major, MajorSearchParams, CreateMajorRequest, UpdateMajorRequest } from '../types/major';

const { Title, Text } = Typography;

export const MajorManagement: React.FC = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<MajorSearchParams>({});
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [form] = Form.useForm();

  // Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  // Debounce search using useRef to avoid dependency issues
  const searchTimeoutRef = useRef<number | null>(null);

  // Auto search when params change
  useEffect(() => {
    // Define search function inside useEffect to avoid dependency issues
    const performSearch = async (params: MajorSearchParams) => {
      setLoading(true);
      try {
        let response;
        
        // If no search params, get all majors
        if (!params.keyword) {
          response = await majorService.getAllMajors();
        } else {
          response = await majorService.searchMajors(params);
        }
        
        if (isApiError(response)) {
          message.error(response.message);
          return;
        }

        if (isMajorListResponse(response)) {
          setMajors(response.data);
          calculateStatistics(response.data);
        }
      } catch {
        message.error('Có lỗi xảy ra khi tìm kiếm');
      } finally {
        setLoading(false);
      }
    };

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounce (500ms delay for keyword, immediate for filters)
    const delay = searchParams.keyword ? 500 : 0;
    const timeout = window.setTimeout(() => {
      performSearch(searchParams);
    }, delay);

    searchTimeoutRef.current = timeout;

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchParams]);

  // Calculate statistics
  const calculateStatistics = (majorList: Major[]) => {
    const active = majorList.filter(m => m.isActive === true).length;
    const inactive = majorList.filter(m => m.isActive !== true).length; // Not true = inactive

    const stats = {
      total: majorList.length,
      active,
      inactive
    };
    setStatistics(stats);
  };

  // Handle create/update major
  const handleSubmit = async (values: {
    code: string;
    name: string;
    isActive: boolean;
  }) => {
    setLoading(true);
    try {
      const majorData: CreateMajorRequest | UpdateMajorRequest = {
        code: values.code.trim().toUpperCase(),
        name: values.name.trim(),
        isActive: values.isActive
      };

      let response;
      if (editingMajor) {
        response = await majorService.updateMajor(editingMajor.majorId, majorData);
      } else {
        response = await majorService.createMajor(majorData);
      }

      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success(editingMajor ? 'Cập nhật chuyên ngành thành công!' : 'Tạo chuyên ngành thành công!');
      setIsModalVisible(false);
      setEditingMajor(null);
      form.resetFields();
      // Trigger reload by resetting search params
      setSearchParams({});
    } catch {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete major
  const handleDelete = async (majorId: number) => {
    try {
      const response = await majorService.deleteMajor(majorId);
      
      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success('Xóa chuyên ngành thành công!');
      // Trigger reload by resetting search params
      setSearchParams({});
    } catch {
      message.error('Có lỗi xảy ra khi xóa chuyên ngành');
    }
  };

  // Handle edit
  const handleEdit = (major: Major) => {
    setEditingMajor(major);
    form.setFieldsValue({
      code: major.code,
      name: major.name,
      isActive: major.isActive || false // Default to false if not present
    });
    setIsModalVisible(true);
  };

  // Handle add new
  const handleAdd = () => {
    setEditingMajor(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Table columns
  const columns: ColumnsType<Major> = [
    {
      title: 'ID',
      dataIndex: 'majorId',
      key: 'majorId',
      width: 80,
      fixed: 'left',
    },
    {
      title: 'Mã chuyên ngành',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (code: string) => (
        <Tag color="blue" style={{ fontSize: '13px', padding: '4px 8px' }}>
          {code}
        </Tag>
      ),
    },
    {
      title: 'Tên chuyên ngành',
      dataIndex: 'name',
      key: 'name',
      width: 400,
      render: (name: string) => (
        <Text strong style={{ fontSize: '14px' }}>{name}</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: (isActive?: boolean) => {
        if (isActive === true) {
          return <Tag color="green">Hoạt động</Tag>;
        } else {
          // If isActive is false, undefined, or null, treat as inactive
          return <Tag color="red">Ngừng hoạt động</Tag>;
        }
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chuyên ngành này?"
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => handleDelete(record.majorId)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          🎓 Quản lý Chuyên ngành
        </Title>
        <Text type="secondary">
          Quản lý danh sách chuyên ngành trong hệ thống giáo dục
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng chuyên ngành"
              value={statistics.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={statistics.active}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Ngừng hoạt động"
              value={statistics.inactive}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Controls */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên chuyên ngành..."
              prefix={<SearchOutlined />}
              value={searchParams.keyword}
              onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
              allowClear
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
          <Col span={12} style={{ textAlign: 'right' }}>
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
                onClick={handleAdd}
              >
                Thêm chuyên ngành
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={majors}
          rowKey="majorId"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: majors.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} chuyên ngành`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {editingMajor ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingMajor ? 'Cập nhật chuyên ngành' : 'Thêm chuyên ngành mới'}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingMajor(null);
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
                label="Mã chuyên ngành"
                name="code"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã chuyên ngành!' },
                  { min: 2, max: 10, message: 'Mã chuyên ngành phải từ 2-10 ký tự!' },
                  { pattern: /^[A-Z0-9_]+$/, message: 'Mã chỉ được chứa chữ hoa, số và dấu gạch dưới!' }
                ]}
              >
                <Input
                  placeholder="VD: SE, AI, IS..."
                  style={{ textTransform: 'uppercase' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên chuyên ngành"
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên chuyên ngành!' },
                  { min: 5, max: 100, message: 'Tên chuyên ngành phải từ 5-100 ký tự!' }
                ]}
              >
                <Input placeholder="VD: Software Engineering" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item
                label="Trạng thái hoạt động"
                name="isActive"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch 
                  checkedChildren="Hoạt động" 
                  unCheckedChildren="Ngừng hoạt động"
                />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingMajor(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingMajor ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MajorManagement;