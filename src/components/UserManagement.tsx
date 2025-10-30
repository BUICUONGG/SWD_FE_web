import React, { useState, useEffect } from 'react';
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
  Upload,
  Progress,
  Divider,
  Alert
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UserOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload';
import { userService, isApiError, isUserListResponse, isImportResponse } from '../services/userService';
import type { 
  User, 
  UserSearchParams,
  CreateUserRequest,
  ImportResult
} from '../types/user';
import dayjs from 'dayjs';

const { Title } = Typography;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<UserSearchParams>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  // Statistics
  const totalUsers = users.length;
  const maleUsers = users.filter(u => u.gender === 'MALE').length;
  const femaleUsers = users.filter(u => u.gender === 'FEMALE').length;
  const localUsers = users.filter(u => u.provider === 'LOCAL').length;

  // Load users on component mount and when search params change
  useEffect(() => {
    const loadUsersData = async () => {
      setLoading(true);
      try {
        const response = await userService.getUsers(searchParams);
        
        if (isApiError(response)) {
          message.error(response.message);
          return;
        }

        if (isUserListResponse(response)) {
          setUsers(response.data);
        }
      } catch {
        message.error('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadUsersData();
  }, [searchParams]);

  // Load users function (for refresh actions)
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(searchParams);
      
      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      if (isUserListResponse(response)) {
        setUsers(response.data);
      }
    } catch {
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Handle search with auto-search on typing
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams({ keyword: value.trim() || undefined });
  };

  // Handle add user
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle edit user (Note: API doesn't have update endpoint, so this will be view-only)
  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      gender: user.gender,
      dob: user.dob ? dayjs(user.dob) : null,
      // Note: roleId and status are not in the User interface from API response
      // so we can't show them in view mode
    });
    setIsModalVisible(true);
  };

  // Handle submit (create only since no update API)
  const handleSubmit = async (values: {
    fullName: string;
    email: string;
    password: string;
    roleId: number;
    gender: 'MALE' | 'FEMALE';
    dob: dayjs.Dayjs;
    status: 'ACTIVE' | 'INACTIVE';
  }) => {
    if (editingUser) {
      message.info('Chức năng chỉnh sửa người dùng chưa được hỗ trợ bởi API');
      return;
    }

    setLoading(true);
    try {
      const userData: CreateUserRequest = {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        roleId: values.roleId,
        gender: values.gender,
        dob: values.dob.format('YYYY-MM-DD'),
        status: values.status
      };

      const response = await userService.createUser(userData);

      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success('Tạo người dùng thành công!');
      setIsModalVisible(false);
      form.resetFields();
      // Reload users
      setSearchParams({});
    } catch {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDelete = async (userId: number) => {
    try {
      const response = await userService.deleteUser(userId);
      
      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      message.success('Xóa người dùng thành công!');
      // Reload users
      setSearchParams({});
    } catch {
      message.error('Có lỗi xảy ra khi xóa người dùng');
    }
  };

  // Handle import
  const handleImport = async () => {
    if (fileList.length === 0) {
      message.error('Vui lòng chọn file Excel để import');
      return;
    }

    setImportLoading(true);
    try {
      const file = fileList[0].originFileObj as File;
      const response = await userService.importUsers(file);

      if (isApiError(response)) {
        message.error(response.message);
        return;
      }

      if (isImportResponse(response)) {
        setImportResult(response.data);
        message.success(response.message);
        // Reload users
        setSearchParams({});
      }
    } catch {
      message.error('Có lỗi xảy ra khi import');
    } finally {
      setImportLoading(false);
    }
  };

  // Download Excel template
  const downloadTemplate = () => {
    // Create a comprehensive CSV template with more sample data
    const csvContent = 
      'Full Name,Email,Password,Role ID,Gender,Date of Birth,Status\n' +
      'Nguyen Van A,student1@fpt.edu.vn,password123,2,MALE,2000-01-15,ACTIVE\n' +
      'Tran Thi B,student2@fpt.edu.vn,password123,2,FEMALE,2000-02-20,ACTIVE\n' +
      'Le Van C,student3@fpt.edu.vn,password123,2,MALE,2000-03-10,ACTIVE\n' +
      'Pham Thi D,student4@fpt.edu.vn,password123,2,FEMALE,2000-04-25,ACTIVE\n' +
      'Hoang Van E,student5@fpt.edu.vn,password123,2,MALE,2000-05-30,ACTIVE\n' +
      'Vu Thi F,mentor1@fpt.edu.vn,password123,3,FEMALE,1985-06-15,ACTIVE\n' +
      'Ngo Van G,mentor2@fpt.edu.vn,password123,3,MALE,1987-07-20,ACTIVE\n' +
      'Do Thi H,mentor3@fpt.edu.vn,password123,3,FEMALE,1990-08-10,ACTIVE\n' +
      'Bui Van I,admin1@fpt.edu.vn,password123,1,MALE,1980-09-05,ACTIVE\n' +
      'Cao Thi J,admin2@fpt.edu.vn,password123,1,FEMALE,1982-10-12,ACTIVE';
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Table columns
  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 80,
      sorter: (a, b) => a.userId - b.userId
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      sorter: (a, b) => a.email.localeCompare(b.email)
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      ellipsis: true,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender: string) => (
        <Tag color={gender === 'MALE' ? 'blue' : 'pink'}>
          {gender === 'MALE' ? 'Nam' : 'Nữ'}
        </Tag>
      ),
      filters: [
        { text: 'Nam', value: 'MALE' },
        { text: 'Nữ', value: 'FEMALE' }
      ],
      onFilter: (value, record) => record.gender === value
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
      width: 120,
      render: (dob: string) => dob ? dayjs(dob).format('DD/MM/YYYY') : '-',
      sorter: (a, b) => (a.dob || '').localeCompare(b.dob || '')
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'provider',
      key: 'provider',
      width: 120,
      render: (provider: string) => (
        <Tag color={provider === 'LOCAL' ? 'green' : 'orange'}>
          {provider}
        </Tag>
      ),
      filters: [
        { text: 'LOCAL', value: 'LOCAL' },
        { text: 'GOOGLE', value: 'GOOGLE' }
      ],
      onFilter: (value, record) => record.provider === value
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="primary" 
              ghost 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              Xem
            </Button>
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.userId)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Tooltip title="Xóa người dùng">
              <Button 
                danger 
                size="small" 
                icon={<DeleteOutlined />}
              >
                Xóa
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <UserOutlined /> Quản lý Người dùng
      </Title>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nam"
              value={maleUsers}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nữ"
              value={femaleUsers}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tài khoản LOCAL"
              value={localUsers}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Actions */}
      <Card style={{ marginBottom: '16px' }}>
        <Row justify="space-between" align="middle">
          <Col span={12}>
            <Input
              placeholder="Tìm kiếm theo email hoặc tên..."
              allowClear
              size="large"
              onChange={handleSearch}
              style={{ maxWidth: '400px' }}
            />
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadUsers}
              >
                Tải lại
              </Button>
              <Button
                icon={<UploadOutlined />}
                onClick={() => setImportModalVisible(true)}
              >
                Import Excel
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Thêm người dùng
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="userId"
          loading={loading}
          pagination={{
            total: users.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit User Modal */}
      <Modal
        title={editingUser ? 'Thông tin người dùng' : 'Thêm người dùng mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={editingUser ? [
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ] : null}
        width={600}
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
                label="Họ và tên"
                name="fullName"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                  { max: 100, message: 'Họ và tên không được quá 100 ký tự!' }
                ]}
              >
                <Input 
                  placeholder="Nguyễn Văn A" 
                  disabled={!!editingUser}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input 
                  placeholder="user@example.com" 
                  disabled={!!editingUser}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              {!editingUser && (
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              <Form.Item
                label="Vai trò"
                name="roleId"
                rules={[
                  { required: true, message: 'Vui lòng chọn vai trò!' }
                ]}
              >
                <Select 
                  placeholder="Chọn vai trò"
                  disabled={!!editingUser}
                >
                  <Select.Option value={1}>Admin</Select.Option>
                  <Select.Option value={2}>Student</Select.Option>
                  <Select.Option value={3}>Mentor</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  { required: true, message: 'Vui lòng chọn giới tính!' }
                ]}
              >
                <Select 
                  placeholder="Chọn giới tính"
                  disabled={!!editingUser}
                >
                  <Select.Option value="MALE">Nam</Select.Option>
                  <Select.Option value="FEMALE">Nữ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ngày sinh"
                name="dob"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày sinh!' }
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                  disabled={!!editingUser}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[
                  { required: true, message: 'Vui lòng chọn trạng thái!' }
                ]}
                initialValue="ACTIVE"
              >
                <Select 
                  placeholder="Chọn trạng thái"
                  disabled={!!editingUser}
                >
                  <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                  <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {!editingUser && (
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <Space>
                <Button onClick={() => {
                  setIsModalVisible(false);
                  setEditingUser(null);
                  form.resetFields();
                }}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Tạo người dùng
                </Button>
              </Space>
            </div>
          )}
        </Form>
      </Modal>

      {/* Import Modal */}
      <Modal
        title="Import người dùng từ Excel"
        open={importModalVisible}
        onCancel={() => {
          setImportModalVisible(false);
          setFileList([]);
          setImportResult(null);
        }}
        footer={[
          <Button key="template" icon={<DownloadOutlined />} onClick={downloadTemplate}>
            Tải template
          </Button>,
          <Button key="cancel" onClick={() => setImportModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="import"
            type="primary"
            icon={<UploadOutlined />}
            loading={importLoading}
            onClick={handleImport}
            disabled={fileList.length === 0}
          >
            Import
          </Button>
        ]}
        width={800}
      >
        <div style={{ marginBottom: '16px' }}>
          <Alert
            message="Lưu ý về định dạng file Import"
            description={
              <div>
                <p>File Excel phải có các cột theo thứ tự:</p>
                <ul>
                  <li><strong>Full Name</strong>: Họ và tên đầy đủ</li>
                  <li><strong>Email</strong>: Email hợp lệ (VD: user@fpt.edu.vn)</li>
                  <li><strong>Password</strong>: Mật khẩu (tối thiểu 6 ký tự)</li>
                  <li><strong>Role ID</strong>: 1=Admin, 2=Student, 3=Mentor</li>
                  <li><strong>Gender</strong>: MALE hoặc FEMALE</li>
                  <li><strong>Date of Birth</strong>: Định dạng YYYY-MM-DD</li>
                  <li><strong>Status</strong>: ACTIVE hoặc INACTIVE</li>
                </ul>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          
          <Upload
            accept=".xlsx,.xls"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false} // Prevent auto upload
            maxCount={1}
          >
            <Button icon={<FileExcelOutlined />}>Chọn file Excel</Button>
          </Upload>
        </div>

        {importResult && (
          <div style={{ marginTop: '24px' }}>
            <Divider>Kết quả Import</Divider>
            
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={8}>
                <Statistic
                  title="Tổng số dòng"
                  value={importResult.totalRows}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Thành công"
                  value={importResult.successCount}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Thất bại"
                  value={importResult.failureCount}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>

            <Progress
              percent={Math.round((importResult.successCount / importResult.totalRows) * 100)}
              status={importResult.failureCount > 0 ? 'active' : 'success'}
              strokeColor={importResult.failureCount > 0 ? '#faad14' : '#52c41a'}
            />

            {importResult.failureCount > 0 && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5}>Chi tiết lỗi:</Title>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {importResult.failureDetails.map((detail, index) => (
                    <Alert
                      key={index}
                      message={`Dòng ${detail.row}: ${detail.email}`}
                      description={detail.error}
                      type="error"
                      showIcon
                      style={{ marginBottom: '8px' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;