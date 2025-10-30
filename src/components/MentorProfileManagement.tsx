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
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FilterOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { mentorProfileService, isApiError, isMentorProfileListResponse } from '../services/mentorProfileService';
import type { 
  MentorProfile, 
  MentorProfileSearchParams
} from '../types/mentorProfile';

const { Title, Text } = Typography;

export const MentorProfileManagement: React.FC = () => {
  const [mentorProfiles, setMentorProfiles] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<MentorProfileSearchParams>({});
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState<MentorProfile | null>(null);
  const [form] = Form.useForm();

  // Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    averageExpertise: 0,
    totalExpertiseSkills: 0,
    profileCompletionRate: 0
  });

  // Debounce search using useRef to avoid dependency issues
  const searchTimeoutRef = useRef<number | null>(null);

  // Auto search when params change
  useEffect(() => {
    // Define search function inside useEffect to avoid dependency issues
    const performSearch = async (params: MentorProfileSearchParams) => {
      setLoading(true);
      try {
        let response;
        
        // If no search params, get all mentor profiles
        if (!params.keyword) {
          response = await mentorProfileService.getAllMentorProfiles();
        } else {
          response = await mentorProfileService.searchMentorProfiles(params);
        }
        
        if (isApiError(response)) {
          message.error(response.message);
          return;
        }

        if (isMentorProfileListResponse(response)) {
          // Ensure data is always an array and set default values for optional fields
          const profileData = Array.isArray(response.data) ? response.data : [];
          const cleanedData = profileData.map(profile => ({
            ...profile,
            isActive: profile.isActive !== false // Default to true if not specified
          }));
          
          setMentorProfiles(cleanedData);
          calculateStatistics(cleanedData);
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
  const calculateStatistics = (profileList: MentorProfile[]) => {
    const active = profileList.filter(p => p.isActive !== false).length; // Default to active if not specified
    const inactive = profileList.filter(p => p.isActive === false).length;

    const stats = {
      total: profileList.length,
      active,
      inactive,
      averageExpertise: 0, // Not applicable since no expertise data
      totalExpertiseSkills: 0, // Not applicable since no expertise data
      profileCompletionRate: 100 // Consider basic profiles as complete
    };
    setStatistics(stats);
  };

  // Handle create/update mentor profile
  const handleSubmit = async (values: {
    userId: number;
    shortName: string;
  }) => {
    setLoading(true);
    try {
      const profileData = {
        userId: values.userId,
        shortName: values.shortName?.trim() || ''
      };

      let response;
      if (editingProfile) {
        response = await mentorProfileService.updateMentorProfile(editingProfile.mentorProfileId, profileData);
      } else {
        response = await mentorProfileService.createMentorProfile(profileData);
      }

      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success(editingProfile ? 'Cập nhật hồ sơ giảng viên thành công!' : 'Tạo hồ sơ giảng viên thành công!');
      setIsModalVisible(false);
      setEditingProfile(null);
      form.resetFields();
      // Trigger reload by resetting search params
      setSearchParams({});
    } catch {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete mentor profile
  const handleDelete = async (profileId: number) => {
    try {
      const response = await mentorProfileService.deleteMentorProfile(profileId);
      
      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success('Xóa hồ sơ giảng viên thành công!');
      // Trigger reload by resetting search params
      setSearchParams({});
    } catch {
      message.error('Có lỗi xảy ra khi xóa hồ sơ giảng viên');
    }
  };

  // Handle edit
  const handleEdit = (profile: MentorProfile) => {
    setEditingProfile(profile);
    form.setFieldsValue({
      userId: profile.userId,
      shortName: profile.shortName || ''
    });
    setIsModalVisible(true);
  };

  // Handle add new
  const handleAdd = () => {
    setEditingProfile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Table columns
  const columns: ColumnsType<MentorProfile> = [
    {
      title: 'ID',
      dataIndex: 'mentorProfileId',
      key: 'mentorProfileId',
      width: 80,
      fixed: 'left',
    },
    {
      title: 'Thông tin giảng viên',
      key: 'mentorInfo',
      width: 250,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <UserOutlined style={{ color: '#1890ff' }} />
            <Text strong>{record.userFullName}</Text>
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            ID User: {record.userId}
          </div>
        </div>
      ),
    },
    {
      title: 'Tên gọi',
      dataIndex: 'shortName',
      key: 'shortName',
      width: 150,
      render: (shortName: string) => (
        <Text>{shortName || '-'}</Text>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
      width: 250,
      render: (email: string) => (
        <Text copyable style={{ fontSize: '13px' }}>{email}</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive?: boolean) => (
        <Tag color={isActive !== false ? 'green' : 'red'}>
          {isActive !== false ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
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
            title="Bạn có chắc chắn muốn xóa hồ sơ giảng viên này?"
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => handleDelete(record.mentorProfileId)}
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
          👨‍🏫 Quản lý Hồ sơ Giảng viên
        </Title>
        <Text type="secondary">
          Quản lý thông tin hồ sơ và chuyên môn của các giảng viên trong hệ thống
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Tổng hồ sơ"
              value={statistics.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={statistics.active}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Ngừng hoạt động"
              value={statistics.inactive}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Chuyên môn TB"
              value={statistics.averageExpertise}
              valueStyle={{ color: '#fa8c16' }}
              suffix="kỹ năng"
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Tổng kỹ năng"
              value={statistics.totalExpertiseSkills}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Hồ sơ hoàn thiện"
              value={`${statistics.profileCompletionRate}%`}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Controls */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo tên giảng viên..."
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
                Thêm hồ sơ giảng viên
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={mentorProfiles.filter(profile => profile && typeof profile === 'object')}
          rowKey="mentorProfileId"
          loading={loading}
          pagination={{
            total: mentorProfiles.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} hồ sơ`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {editingProfile ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingProfile ? 'Cập nhật hồ sơ giảng viên' : 'Thêm hồ sơ giảng viên mới'}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProfile(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '24px' }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="ID User"
                name="userId"
                rules={[
                  { required: true, message: 'Vui lòng nhập ID User!' },
                  { type: 'number', min: 1, message: 'ID phải là số dương!' }
                ]}
              >
                <InputNumber
                  placeholder="Nhập ID User có role MENTOR"
                  style={{ width: '100%' }}
                  min={1}
                  disabled={!!editingProfile} // Disable when editing
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tên gọi"
                name="shortName"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên gọi!' },
                  { max: 50, message: 'Tên gọi không được quá 50 ký tự!' }
                ]}
              >
                <Input placeholder="VD: Mr. Duc, Ms. Lan..." />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingProfile(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingProfile ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MentorProfileManagement;