import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Input, Tag, message, Spin, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { mentorService } from '../services';
import type { MentorProfileResponse } from '../types';
import '../styles/MentorsList.css';

/**
 * Mentors List Page
 * Hiển thị danh sách hồ sơ giảng viên
 */
export const MentorsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<MentorProfileResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Load mentors on mount
  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      setLoading(true);
      const response = await mentorService.getAll();
      setMentors(response);
    } catch (error) {
      message.error('Lỗi khi tải danh sách giảng viên');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await mentorService.search({
        keyword: searchKeyword || undefined,
      });
      setMentors(response);
    } catch (error) {
      message.error('Lỗi khi tìm kiếm giảng viên');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchKeyword('');
    loadMentors();
  };

  const handleDelete = async (id: number) => {
    try {
      await mentorService.delete(id);
      message.success('Xóa hồ sơ giảng viên thành công');
      loadMentors();
    } catch (error) {
      message.error('Lỗi khi xóa hồ sơ giảng viên');
    }
  };

  const columns = [
    {
      title: 'Tên Viết Tắt',
      dataIndex: 'shortName',
      key: 'shortName',
      width: '15%',
      render: (name: string | undefined) => name || '-',
    },
    {
      title: 'Tên Đầy Đủ',
      dataIndex: 'fullName',
      key: 'fullName',
      width: '20%',
      render: (name: string | undefined) => name || '-',
    },
    {
      title: 'Khoa/Bộ Môn',
      dataIndex: 'department',
      key: 'department',
      width: '15%',
      render: (dept: string | undefined) => dept || '-',
    },
    {
      title: 'Chuyên Ngành',
      dataIndex: 'specialization',
      key: 'specialization',
      width: '15%',
      render: (spec: string | undefined) => spec || '-',
    },
    {
      title: 'Kinh Nghiệm (năm)',
      dataIndex: 'yearsOfExperience',
      key: 'yearsOfExperience',
      width: '12%',
      render: (years: number | undefined) => years || '-',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          ACTIVE: 'green',
          INACTIVE: 'orange',
        };
        return <Tag color={statusColors[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Hành Động',
      key: 'actions',
      width: '13%',
      render: (_: any, record: MentorProfileResponse) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/mentors/${record.id}/edit`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description={`Bạn có chắc chắn muốn xóa hồ sơ giảng viên ${record.shortName}?`}
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
    <div className="mentors-list-container">
      <div className="mentors-list-header">
        <h2>Quản Lý Hồ Sơ Giảng Viên</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/mentors/create')}
        >
          Tạo Hồ Sơ Giảng Viên
        </Button>
      </div>

      <div className="mentors-search-section">
        <Input
          placeholder="Tìm kiếm theo tên viết tắt hoặc tên đầy đủ..."
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
          dataSource={mentors.map((mentor) => ({
            ...mentor,
            key: mentor.id,
          }))}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          style={{ marginTop: '16px' }}
        />
      </Spin>
    </div>
  );
};
