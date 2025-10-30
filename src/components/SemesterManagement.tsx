import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Typography,
  message,
  Modal,
  Form,
  Row,
  Col,
  Statistic,
  Tooltip,
  Popconfirm,
  DatePicker,
  Select,
  Tag,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { semesterService, isApiError, isSemesterListResponse } from '../services/semesterService';
import type { 
  Semester, 
  SemesterSearchParams
} from '../types/semester';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const SemesterManagement: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<SemesterSearchParams>({});
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [form] = Form.useForm();

  // Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    spring: 0,
    summer: 0,
    fall: 0,
    upcoming: 0,
    past: 0,
    current: 0
  });

  // Debounce search using useRef to avoid dependency issues
  const searchTimeoutRef = useRef<number | null>(null);

  // Auto search when params change
  useEffect(() => {
    // Define search function inside useEffect to avoid dependency issues
    const performSearch = async (params: SemesterSearchParams) => {
      setLoading(true);
      try {
        let response;
        
        // If no search params, get all semesters
        if (!params.keyword && !params.term && !params.year) {
          response = await semesterService.getAllSemesters();
        } else {
          response = await semesterService.searchSemesters(params);
        }
        
        if (isApiError(response)) {
          message.error(response.message);
          return;
        }

        if (isSemesterListResponse(response)) {
          const semesterData = Array.isArray(response.data) ? response.data : [];
          setSemesters(semesterData);
          calculateStatistics(semesterData);
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

    // Set new timeout for debounced search
    searchTimeoutRef.current = window.setTimeout(() => {
      performSearch(searchParams);
    }, 300);

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchParams]);

  // Calculate statistics
  const calculateStatistics = (semesterList: Semester[]) => {
    const now = dayjs();
    const spring = semesterList.filter(s => s.term === 'SPRING').length;
    const summer = semesterList.filter(s => s.term === 'SUMMER').length;
    const fall = semesterList.filter(s => s.term === 'FALL').length;
    
    const upcoming = semesterList.filter(s => dayjs(s.startDate).isAfter(now)).length;
    const past = semesterList.filter(s => dayjs(s.endDate).isBefore(now)).length;
    const current = semesterList.filter(s => 
      (dayjs(s.startDate).isBefore(now) || dayjs(s.startDate).isSame(now)) && 
      (dayjs(s.endDate).isAfter(now) || dayjs(s.endDate).isSame(now))
    ).length;

    const stats = {
      total: semesterList.length,
      spring,
      summer,
      fall,
      upcoming,
      past,
      current
    };
    setStatistics(stats);
  };

  // Handle create/update semester
  const handleSubmit = async (values: {
    code: string;
    name: string;
    year: number;
    term: 'SPRING' | 'SUMMER' | 'FALL';
    dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  }) => {
    setLoading(true);
    try {
      const semesterData = {
        code: values.code.trim(),
        name: values.name.trim(),
        year: values.year,
        term: values.term,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD')
      };

      let response;
      if (editingSemester) {
        response = await semesterService.updateSemester(editingSemester.semesterId, semesterData);
      } else {
        response = await semesterService.createSemester(semesterData);
      }

      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success(editingSemester ? 'Cập nhật kỳ học thành công!' : 'Tạo kỳ học thành công!');
      setIsModalVisible(false);
      setEditingSemester(null);
      form.resetFields();
      // Trigger reload by resetting search params
      setSearchParams({});
    } catch {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete semester
  const handleDelete = async (semesterId: number) => {
    try {
      const response = await semesterService.deleteSemester(semesterId);
      
      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success('Xóa kỳ học thành công!');
      // Trigger reload by resetting search params
      setSearchParams({});
    } catch {
      message.error('Có lỗi xảy ra khi xóa kỳ học');
    }
  };

  // Handle edit
  const handleEdit = (semester: Semester) => {
    setEditingSemester(semester);
    form.setFieldsValue({
      code: semester.code,
      name: semester.name,
      year: semester.year,
      term: semester.term,
      dateRange: [dayjs(semester.startDate), dayjs(semester.endDate)]
    });
    setIsModalVisible(true);
  };

  // Handle add new
  const handleAdd = () => {
    setEditingSemester(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Table columns
  const columns: ColumnsType<Semester> = [
    {
      title: 'ID',
      dataIndex: 'semesterId',
      key: 'semesterId',
      width: 80,
      fixed: 'left',
    },
    {
      title: 'Mã kỳ học',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (code: string) => (
        <Text strong style={{ color: '#1890ff' }}>{code}</Text>
      ),
    },
    {
      title: 'Tên kỳ học',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string) => (
        <Text>{name}</Text>
      ),
    },
    {
      title: 'Kỳ học',
      dataIndex: 'term',
      key: 'term',
      width: 100,
      render: (term: string) => {
        const termColors = {
          'SPRING': 'green',
          'SUMMER': 'orange',
          'FALL': 'blue'
        };
        const termNames = {
          'SPRING': 'Xuân',
          'SUMMER': 'Hè', 
          'FALL': 'Thu'
        };
        return (
          <Tag color={termColors[term as keyof typeof termColors]}>
            {termNames[term as keyof typeof termNames]}
          </Tag>
        );
      },
    },
    {
      title: 'Năm',
      dataIndex: 'year',
      key: 'year',
      width: 80,
      render: (year: number) => (
        <Text strong>{year}</Text>
      ),
    },
    {
      title: 'Thời gian',
      key: 'duration',
      width: 200,
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div style={{ marginBottom: '2px' }}>
            <Text>Bắt đầu: {dayjs(record.startDate).format('DD/MM/YYYY')}</Text>
          </div>
          <div>
            <Text>Kết thúc: {dayjs(record.endDate).format('DD/MM/YYYY')}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => {
        const now = dayjs();
        const startDate = dayjs(record.startDate);
        const endDate = dayjs(record.endDate);

        if (endDate.isBefore(now)) {
          return <Tag color="default">Đã kết thúc</Tag>;
        } else if (startDate.isAfter(now)) {
          return <Tag color="blue">Sắp tới</Tag>;
        } else {
          return <Tag color="green">Đang diễn ra</Tag>;
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
            title="Bạn có chắc chắn muốn xóa kỳ học này?"
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => handleDelete(record.semesterId)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Tooltip title="Xóa">
              <Button
                type="primary"
                size="small"
                danger
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
          📅 Quản lý Kỳ học
        </Title>
        <Text type="secondary">
          Quản lý thông tin các kỳ học trong hệ thống
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Tổng kỳ học"
              value={statistics.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Kỳ Xuân"
              value={statistics.spring}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Kỳ Hè"
              value={statistics.summer}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Kỳ Thu"
              value={statistics.fall}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đang diễn ra"
              value={statistics.current}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Sắp tới"
              value={statistics.upcoming}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã kết thúc"
              value={statistics.past}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Actions */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên kỳ học..."
              prefix={<SearchOutlined />}
              value={searchParams.keyword}
              onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
              allowClear
            />
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => setSearchParams({})}
              >
                Tải lại
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Thêm kỳ học
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={semesters}
          rowKey="semesterId"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: semesters.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} kỳ học`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {editingSemester ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingSemester ? 'Cập nhật kỳ học' : 'Thêm kỳ học mới'}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingSemester(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnHidden
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
                label="Mã kỳ học"
                name="code"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã kỳ học!' },
                  { max: 20, message: 'Mã kỳ học không được quá 20 ký tự!' }
                ]}
              >
                <Input 
                  placeholder="VD: FALL2024, SPRING2025" 
                  disabled={!!editingSemester} // Disable when editing
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Năm"
                name="year"
                rules={[
                  { required: true, message: 'Vui lòng nhập năm!' },
                  { type: 'number', min: 2020, max: 2030, message: 'Năm phải từ 2020 đến 2030!' }
                ]}
              >
                <InputNumber
                  placeholder="VD: 2024, 2025"
                  style={{ width: '100%' }}
                  min={2020}
                  max={2030}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên kỳ học"
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên kỳ học!' },
                  { max: 100, message: 'Tên kỳ học không được quá 100 ký tự!' }
                ]}
              >
                <Input placeholder="VD: Fall Semester 2024, Spring Semester 2025" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Kỳ học"
                name="term"
                rules={[
                  { required: true, message: 'Vui lòng chọn kỳ học!' }
                ]}
              >
                <Select placeholder="Chọn kỳ học">
                  <Select.Option value="SPRING">Kỳ Xuân (Spring)</Select.Option>
                  <Select.Option value="SUMMER">Kỳ Hè (Summer)</Select.Option>
                  <Select.Option value="FALL">Kỳ Thu (Fall)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Thời gian kỳ học"
            name="dateRange"
            rules={[
              { required: true, message: 'Vui lòng chọn thời gian kỳ học!' }
            ]}
          >
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingSemester(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingSemester ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};