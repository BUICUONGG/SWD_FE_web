import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Input, Tag, message, Spin, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { enrollmentService } from '../services';
import { EnrollmentStatus, type EnrollmentResponse, type EnrollmentSearchFilters } from '../types';
import { useAuth } from '../../../shared/hooks/useAuth';
import '../styles/EnrollmentsList.css';

/**
 * Enrollments List Page
 * Hiển thị danh sách đăng ký học viên
 */
export const EnrollmentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<EnrollmentSearchFilters>({});

  // Load enrollments
  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.search({});
      setEnrollments(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách đăng ký');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.search(searchFilters);
      setEnrollments(data);
    } catch (error) {
      message.error('Lỗi khi tìm kiếm đăng ký');
    } finally {
      setLoading(false);
    }
  };

  // Handle approve
  const handleApprove = async (id: number) => {
    try {
      if (!user?.id) {
        message.error('Lỗi: không tìm thấy thông tin người dùng');
        return;
      }
      await enrollmentService.approve(id, parseInt(user.id));
      message.success('Phê duyệt đăng ký thành công');
      loadEnrollments();
    } catch (error) {
      message.error('Lỗi khi phê duyệt đăng ký');
    }
  };

  // Handle complete
  const handleComplete = async (id: number) => {
    try {
      await enrollmentService.complete(id);
      message.success('Hoàn thành đăng ký thành công');
      loadEnrollments();
    } catch (error) {
      message.error('Lỗi khi hoàn thành đăng ký');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await enrollmentService.delete(id);
      message.success('Hủy đăng ký thành công');
      loadEnrollments();
    } catch (error) {
      message.error('Lỗi khi hủy đăng ký');
    }
  };

  // Table columns
  const columns: TableColumnsType<EnrollmentResponse> = [
    {
      title: 'ID Người Dùng',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'ID Lớp Học',
      dataIndex: 'courseId',
      key: 'courseId',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          [EnrollmentStatus.PENDING]: 'orange',
          [EnrollmentStatus.APPROVED]: 'blue',
          [EnrollmentStatus.COMPLETED]: 'green',
          [EnrollmentStatus.REJECTED]: 'red',
          [EnrollmentStatus.CANCELLED]: 'gray',
        };
        const labels: Record<string, string> = {
          [EnrollmentStatus.PENDING]: 'Chờ Duyệt',
          [EnrollmentStatus.APPROVED]: 'Đã Phê Duyệt',
          [EnrollmentStatus.COMPLETED]: 'Hoàn Thành',
          [EnrollmentStatus.REJECTED]: 'Từ Chối',
          [EnrollmentStatus.CANCELLED]: 'Đã Hủy',
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      render: (score) => score || '-',
    },
    {
      title: 'Xếp Loại',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade) => grade || '-',
    },
    {
      title: 'Ngày Đăng Ký',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === EnrollmentStatus.PENDING && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                Phê Duyệt
              </Button>
            </>
          )}
          {record.status === EnrollmentStatus.APPROVED && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleComplete(record.id)}
            >
              Hoàn Thành
            </Button>
          )}
          <Popconfirm
            title="Xác nhận hủy"
            description="Bạn có chắc chắn muốn hủy đăng ký này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Hủy"
            cancelText="Đóng"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="enrollments-list-container">
      <div className="enrollments-list-header">
        <h1>Quản Lý Đăng Ký Học Viên</h1>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate('/enrollments/create')}
        >
          Tạo Đăng Ký
        </Button>
      </div>

      {/* Search & Filter Section */}
      <div className="enrollments-search-section">
        <Space wrap>
          <Input
            placeholder="ID Người Dùng"
            style={{ width: 150 }}
            type="number"
            prefix={<SearchOutlined />}
            value={searchFilters.userId || ''}
            onChange={(e) =>
              setSearchFilters({ 
                ...searchFilters, 
                userId: e.target.value ? parseInt(e.target.value) : undefined
              })
            }
          />
          <Input
            placeholder="ID Lớp Học"
            style={{ width: 150 }}
            type="number"
            prefix={<SearchOutlined />}
            value={searchFilters.courseId || ''}
            onChange={(e) =>
              setSearchFilters({ 
                ...searchFilters, 
                courseId: e.target.value ? parseInt(e.target.value) : undefined
              })
            }
          />
          <Button type="primary" onClick={handleSearch}>
            Tìm Kiếm
          </Button>
          <Button onClick={() => {
            setSearchFilters({});
            loadEnrollments();
          }}>
            Đặt Lại
          </Button>
        </Space>
      </div>

      {/* Enrollments Table */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={enrollments}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} đăng ký`,
          }}
        />
      </Spin>
    </div>
  );
};

export default EnrollmentsListPage;
