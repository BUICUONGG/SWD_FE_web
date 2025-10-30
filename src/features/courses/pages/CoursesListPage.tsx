import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Input, Select, Tag, Modal, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { coursesService } from '../services';
import { CourseStatus, type CourseResponse, type CourseSearchFilters } from '../types';
import '../styles/CoursesList.css';

/**
 * Courses List Page
 * Hiển thị danh sách khóa học với table, search, filter
 */
export const CoursesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<CourseSearchFilters>({});

  // Load courses
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesService.getAll();
      setCourses(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await coursesService.search(searchFilters);
      setCourses(data);
    } catch (error) {
      message.error('Lỗi khi tìm kiếm khóa học');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa khóa học này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await coursesService.delete(id);
          message.success('Xóa khóa học thành công');
          loadCourses();
        } catch (error) {
          message.error('Lỗi khi xóa khóa học');
        }
      },
    });
  };

  // Table columns
  const columns: TableColumnsType<CourseResponse> = [
    {
      title: 'Mã Khóa',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Tên Khóa',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          [CourseStatus.ACTIVE]: 'green',
          [CourseStatus.INACTIVE]: 'red',
          [CourseStatus.ARCHIVED]: 'orange',
          [CourseStatus.DRAFT]: 'blue',
        };
        const labels: Record<string, string> = {
          [CourseStatus.ACTIVE]: 'Hoạt Động',
          [CourseStatus.INACTIVE]: 'Không Hoạt Động',
          [CourseStatus.ARCHIVED]: 'Lưu Trữ',
          [CourseStatus.DRAFT]: 'Nháp',
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: 'Học Kỳ ID',
      dataIndex: 'semesterId',
      key: 'semesterId',
    },
    {
      title: 'Mentor ID',
      dataIndex: 'mentorId',
      key: 'mentorId',
    },
    {
      title: 'Sinh Viên',
      key: 'students',
      render: (_, record) => `${record.currentStudents || 0}/${record.maxStudents || '-'}`,
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/courses/${record.id}/edit`)}
          >
            Sửa
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="courses-list-container">
      <div className="courses-list-header">
        <h1>Quản Lý Khóa Học</h1>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate('/courses/create')}
        >
          Tạo Khóa Học
        </Button>
      </div>

      {/* Search & Filter Section */}
      <div className="courses-search-section">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên..."
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
              value={searchFilters.keyword || ''}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, keyword: e.target.value })
              }
            />
            <Select
              placeholder="Trạng thái"
              style={{ width: 150 }}
              allowClear
              options={[
                { label: 'Hoạt Động', value: CourseStatus.ACTIVE },
                { label: 'Không Hoạt Động', value: CourseStatus.INACTIVE },
                { label: 'Lưu Trữ', value: CourseStatus.ARCHIVED },
                { label: 'Nháp', value: CourseStatus.DRAFT },
              ]}
              value={searchFilters.status || undefined}
              onChange={(value) =>
                setSearchFilters({ ...searchFilters, status: value })
              }
            />
            <Button type="primary" onClick={handleSearch}>
              Tìm Kiếm
            </Button>
            <Button onClick={() => {
              setSearchFilters({});
              loadCourses();
            }}>
              Đặt Lại
            </Button>
          </Space>
        </Space>
      </div>

      {/* Courses Table */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} khóa học`,
          }}
        />
      </Spin>
    </div>
  );
};

export default CoursesListPage;
