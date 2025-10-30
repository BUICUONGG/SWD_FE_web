import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Card,
  Typography,
  Tag,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { courseService, isApiError, isCourseListResponse } from '../services/courseService';
import type { Course, CourseStatus, CreateCourseRequest, UpdateCourseRequest, CourseSearchParams } from '../types/course';

const { Title, Text } = Typography;
const { Option } = Select;

export const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<CourseSearchParams>({});
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();

  // Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    upcoming: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  });

  // Debounce search using useRef to avoid dependency issues
  const searchTimeoutRef = useRef<number | null>(null);

  // Auto search when params change
  useEffect(() => {
    // Define search function inside useEffect to avoid dependency issues
    const performSearch = async (params: CourseSearchParams) => {
      setLoading(true);
      try {
        let response;
        
        // If no search params, get all courses
        if (!params.keyword && !params.status && !params.semesterId && !params.mentorId && !params.subjectId) {
          response = await courseService.getAllCourses();
        } else {
          response = await courseService.searchCourses(params);
        }
        
        if (isApiError(response)) {
          message.error(response.message);
          return;
        }

        if (isCourseListResponse(response)) {
          setCourses(response.data);
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

  // Load courses on component mount - now handled by auto-search useEffect

  // Calculate statistics
  const calculateStatistics = (courseList: Course[]) => {
    const stats = {
      total: courseList.length,
      upcoming: courseList.filter(c => c.status === 'UPCOMING').length,
      open: courseList.filter(c => c.status === 'OPEN').length,
      inProgress: courseList.filter(c => c.status === 'IN_PROGRESS').length,
      completed: courseList.filter(c => c.status === 'COMPLETED').length,
      cancelled: courseList.filter(c => c.status === 'CANCELLED').length
    };
    setStatistics(stats);
  };

  // Handle create/update course
  const handleSubmit = async (values: {
    code: string;
    name: string;
    maxStudents: number;
    teamFormationDeadline: dayjs.Dayjs;
    status: CourseStatus;
    mentorId: number;
    subjectId: number;
    semesterId: number;
  }) => {
    setLoading(true);
    try {
      const courseData: CreateCourseRequest | UpdateCourseRequest = {
        code: values.code,
        name: values.name,
        maxStudents: values.maxStudents,
        teamFormationDeadline: values.teamFormationDeadline.format('YYYY-MM-DDTHH:mm:ss'),
        status: values.status,
        mentorId: values.mentorId,
        subjectId: values.subjectId,
        semesterId: values.semesterId
      };

      let response;
      if (editingCourse) {
        response = await courseService.updateCourse(editingCourse.courseId, courseData);
      } else {
        response = await courseService.createCourse(courseData);
      }

      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success(editingCourse ? 'Cập nhật khóa học thành công!' : 'Tạo khóa học thành công!');
      setIsModalVisible(false);
      setEditingCourse(null);
      form.resetFields();
      // Trigger reload by resetting search params
      setSearchParams({});
    } catch {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete course
  const handleDelete = async (courseId: number) => {
    try {
      const response = await courseService.deleteCourse(courseId);
      
      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success('Xóa khóa học thành công!');
      // Trigger reload by resetting search params
      setSearchParams({});
    } catch {
      message.error('Có lỗi xảy ra khi xóa khóa học');
    }
  };

  // Handle edit
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    form.setFieldsValue({
      ...course,
      teamFormationDeadline: dayjs(course.teamFormationDeadline)
    });
    setIsModalVisible(true);
  };

  // Handle add new
  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Table columns
  const columns: ColumnsType<Course> = [
    {
      title: 'Mã khóa học',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
      width: 300,
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectCode',
      key: 'subjectCode',
      width: 100,
    },
    {
      title: 'Kỳ học',
      dataIndex: 'semesterCode',
      key: 'semesterCode',
      width: 120,
    },
    {
      title: 'Mentor',
      dataIndex: 'mentorName',
      key: 'mentorName',
      width: 180,
    },
    {
      title: 'Sinh viên',
      key: 'students',
      width: 120,
      render: (_, record) => (
        <Text>{record.currentStudents}/{record.maxStudents}</Text>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'teamFormationDeadline',
      key: 'teamFormationDeadline',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: CourseStatus) => {
        const colors = {
          UPCOMING: 'purple',
          OPEN: 'green',
          IN_PROGRESS: 'blue',
          COMPLETED: 'cyan',
          CANCELLED: 'red'
        };
        const labels = {
          UPCOMING: 'Sắp mở',
          OPEN: 'Mở đăng ký',
          IN_PROGRESS: 'Đang học',
          COMPLETED: 'Hoàn thành',
          CANCELLED: 'Đã hủy'
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khóa học này?"
            onConfirm={() => handleDelete(record.courseId)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
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
          📚 Quản lý Khóa học
        </Title>
        <Text type="secondary">
          Quản lý danh sách khóa học và lớp học trong hệ thống
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Tổng khóa học"
              value={statistics.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Sắp mở"
              value={statistics.upcoming}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Mở đăng ký"
              value={statistics.open}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đang học"
              value={statistics.inProgress}
              valueStyle={{ color: '#1890ff' }}
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
      </Row>

      {/* Search and Controls */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên khóa học..."
              prefix={<SearchOutlined />}
              value={searchParams.keyword}
              onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Trạng thái"
              style={{ width: '100%' }}
              allowClear
              value={searchParams.status}
              onChange={(value) => setSearchParams({ ...searchParams, status: value })}
            >
              <Option value="UPCOMING">Sắp mở</Option>
              <Option value="OPEN">Mở đăng ký</Option>
              <Option value="IN_PROGRESS">Đang học</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setSearchParams({})}
              >
                Xóa bộ lọc
              </Button>
            </Space>
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
                onClick={handleAdd}
              >
                Thêm khóa học
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="courseId"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: courses.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} khóa học`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingCourse ? 'Cập nhật khóa học' : 'Thêm khóa học mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCourse(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã khóa học"
                name="code"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã khóa học!' },
                  { max: 20, message: 'Mã khóa học không quá 20 ký tự!' }
                ]}
              >
                <Input placeholder="VD: SWD392_SE1702" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="UPCOMING">Sắp mở</Option>
                  <Option value="OPEN">Mở đăng ký</Option>
                  <Option value="IN_PROGRESS">Đang học</Option>
                  <Option value="COMPLETED">Hoàn thành</Option>
                  <Option value="CANCELLED">Đã hủy</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Tên khóa học"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên khóa học!' },
              { max: 200, message: 'Tên khóa học không quá 200 ký tự!' }
            ]}
          >
            <Input placeholder="VD: Software Development - SE1702" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Số sinh viên tối đa"
                name="maxStudents"
                rules={[
                  { required: true, message: 'Vui lòng nhập số sinh viên!' },
                  { type: 'number', min: 1, message: 'Số sinh viên phải lớn hơn 0!' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="30"
                  min={1}
                  max={200}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="ID Mentor"
                name="mentorId"
                rules={[{ required: true, message: 'Vui lòng nhập ID mentor!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="5"
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Deadline nhóm"
                name="teamFormationDeadline"
                rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn ngày và giờ"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="ID Môn học"
                name="subjectId"
                rules={[{ required: true, message: 'Vui lòng nhập ID môn học!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="1"
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ID Kỳ học"
                name="semesterId"
                rules={[{ required: true, message: 'Vui lòng nhập ID kỳ học!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="2"
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'right', marginTop: '24px' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingCourse ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};