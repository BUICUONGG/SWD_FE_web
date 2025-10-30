import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Input, Tag, message, Spin, Popconfirm, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { userService } from '../services';
import type { UserResponse } from '../types';
import '../styles/UsersList.css';

/**
 * Users List Page
 * Hiển thị danh sách người dùng với tính năng CRUD
 */
export const UsersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterRole, setFilterRole] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response);
    } catch (error) {
      message.error('Lỗi khi tải danh sách người dùng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await userService.search({
        keyword: searchKeyword || undefined,
        role: filterRole as any,
        status: filterStatus as any,
      });
      setUsers(response);
    } catch (error) {
      message.error('Lỗi khi tìm kiếm người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchKeyword('');
    setFilterRole(undefined);
    setFilterStatus(undefined);
    loadUsers();
  };

  const handleDelete = async (id: number) => {
    try {
      await userService.delete(id);
      message.success('Xóa người dùng thành công');
      loadUsers();
    } catch (error) {
      message.error('Lỗi khi xóa người dùng');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await userService.restore(id);
      message.success('Khôi phục người dùng thành công');
      loadUsers();
    } catch (error) {
      message.error('Lỗi khi khôi phục người dùng');
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
    },
    {
      title: 'Tên Đầy Đủ',
      dataIndex: 'fullName',
      key: 'fullName',
      width: '20%',
    },
    {
      title: 'Vai Trò',
      dataIndex: 'role',
      key: 'role',
      width: '12%',
      render: (role: string) => {
        const roleColors: Record<string, string> = {
          ADMIN: 'red',
          STUDENT: 'blue',
          MENTOR: 'green',
        };
        return <Tag color={roleColors[role] || 'default'}>{role}</Tag>;
      },
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          ACTIVE: 'green',
          INACTIVE: 'orange',
          DELETED: 'red',
        };
        return <Tag color={statusColors[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Giới Tính',
      dataIndex: 'gender',
      key: 'gender',
      width: '10%',
      render: (gender: string | undefined) => gender || '-',
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: '15%',
      render: (dob: string | undefined) => dob || '-',
    },
    {
      title: 'Hành Động',
      key: 'actions',
      width: '15%',
      render: (_: any, record: UserResponse) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/users/${record.id}/edit`)}
          >
            Sửa
          </Button>
          {record.status === 'DELETED' ? (
            <Button
              type="default"
              size="small"
              onClick={() => handleRestore(record.id)}
            >
              Khôi Phục
            </Button>
          ) : (
            <Popconfirm
              title="Xác nhận xóa"
              description={`Bạn có chắc chắn muốn xóa người dùng ${record.fullName}?`}
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button danger size="small" icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="users-list-container">
      <div className="users-list-header">
        <h2>Quản Lý Người Dùng</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/users/create')}
        >
          Tạo Người Dùng
        </Button>
      </div>

      <div className="users-search-section">
        <Input
          placeholder="Tìm kiếm theo email hoặc tên..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: '300px' }}
        />

        <Select
          placeholder="Lọc theo vai trò"
          style={{ width: '150px' }}
          value={filterRole}
          onChange={setFilterRole}
          allowClear
          options={[
            { label: 'Admin', value: 'ADMIN' },
            { label: 'Sinh Viên', value: 'STUDENT' },
            { label: 'Giảng Viên', value: 'MENTOR' },
          ]}
        />

        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: '150px' }}
          value={filterStatus}
          onChange={setFilterStatus}
          allowClear
          options={[
            { label: 'Hoạt Động', value: 'ACTIVE' },
            { label: 'Không Hoạt Động', value: 'INACTIVE' },
            { label: 'Đã Xóa', value: 'DELETED' },
          ]}
        />

        <Button onClick={handleSearch}>Tìm Kiếm</Button>
        <Button onClick={handleReset}>Đặt Lại</Button>
      </div>

      <Spin spinning={loading}>
        <Table
          dataSource={users.map((user) => ({
            ...user,
            key: user.id,
          }))}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          style={{ marginTop: '16px' }}
        />
      </Spin>
    </div>
  );
};
