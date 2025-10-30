import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Input, Tag, message, Spin, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { semesterService } from '../services';
import type { SemesterResponse } from '../types';
import '../styles/SemestersList.css';

/**
 * Semesters List Page
 * Hiển thị danh sách kỳ học
 */
export const SemestersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState<SemesterResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Load semesters on mount
  useEffect(() => {
    loadSemesters();
  }, []);

  const loadSemesters = async () => {
    try {
      setLoading(true);
      const response = await semesterService.getAll();
      setSemesters(response);
    } catch (error) {
      message.error('Lỗi khi tải danh sách kỳ học');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadSemesters();
      return;
    }

    try {
      setLoading(true);
      // Backend không có endpoint search cho semester, filter client-side
      const response = await semesterService.getAll();
      const filtered = response.filter(
        (sem) =>
          sem.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          sem.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setSemesters(filtered);
    } catch (error) {
      message.error('Lỗi khi tìm kiếm kỳ học');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchKeyword('');
    loadSemesters();
  };

  const handleDelete = async (id: number) => {
    try {
      await semesterService.delete(id);
      message.success('Xóa kỳ học thành công');
      loadSemesters();
    } catch (error) {
      message.error('Lỗi khi xóa kỳ học');
    }
  };

  const columns = [
    {
      title: 'Mã Kỳ',
      dataIndex: 'code',
      key: 'code',
      width: '12%',
    },
    {
      title: 'Tên Kỳ',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'Ngày Bắt Đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      width: '15%',
    },
    {
      title: 'Ngày Kết Thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      width: '15%',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          ACTIVE: 'green',
          INACTIVE: 'orange',
          COMPLETED: 'blue',
        };
        return <Tag color={statusColors[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Hành Động',
      key: 'actions',
      width: '13%',
      render: (_: any, record: SemesterResponse) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/semesters/${record.id}/edit`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description={`Bạn có chắc chắn muốn xóa kỳ học ${record.code}?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
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
    <div className="semesters-list-container">
      <div className="semesters-list-header">
        <h2>Quản Lý Kỳ Học</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/semesters/create')}
        >
          Tạo Kỳ Học
        </Button>
      </div>

      <div className="semesters-search-section">
        <Input
          placeholder="Tìm kiếm theo mã kỳ hoặc tên kỳ..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: '400px' }}
        />

        <Button onClick={handleSearch}>Tìm Kiếm</Button>
        <Button onClick={handleReset}>Đặt Lại</Button>
      </div>

      <Spin spinning={loading}>
        <Table
          dataSource={semesters.map((semester) => ({
            ...semester,
            key: semester.id,
          }))}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          style={{ marginTop: '16px' }}
        />
      </Spin>
    </div>
  );
};
