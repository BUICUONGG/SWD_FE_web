import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Button,
  Form,
  Input,
  Select,
  message,
  Spin,
  Space,
  Tag
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  CloseOutlined,
  SaveOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { userService, isApiError, isUserResponse } from '../services/userService';
import ChangePasswordModal from '../components/ChangePasswordModal';
import type { User } from '../types/user';

const { Title, Text, Paragraph } = Typography;

const AdminProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getCurrentUser();
      console.log('API Response from /api/users/me:', response);
      if (isApiError(response)) {
        message.error('Không thể tải thông tin cá nhân');
      } else if (isUserResponse(response)) {
        console.log('User data from database:', response.data);
        setUser(response.data);
        form.setFieldsValue({
          fullName: response.data.fullName,
          email: response.data.email,
          gender: response.data.gender,
          dob: response.data.dob,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      message.error('Có lỗi xảy ra khi tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const getUserAvatar = () => {
    if (user?.avatarUrl) {
      return user.avatarUrl;
    }
    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#87d068'];
    const nameHash = (user?.fullName || 'User').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = nameHash % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'Admin')}&background=${colors[colorIndex].slice(1)}&color=fff&size=256&font-size=0.5`;
  };

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue();
      console.log('Saving profile with values:', values);
      
      const response = await userService.updateCurrentUser({
        fullName: values.fullName,
        email: values.email,
        gender: values.gender,
        dob: values.dob,
      });

      console.log('Update response:', response);

      if (isApiError(response)) {
        message.error(response.message || 'Cập nhật thông tin thất bại');
      } else if (isUserResponse(response)) {
        console.log('Profile updated successfully:', response.data);
        setUser(response.data);
        message.success('Cập nhật thông tin thành công');
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Cập nhật thông tin thất bại');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Profile Header */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
        <Row align="middle" gutter={24}>
          <Col xs={24} sm={4} style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              src={getUserAvatar()}
              style={{ border: '4px solid white', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
            />
          </Col>
          <Col xs={24} sm={20}>
            <Title level={2} style={{ color: 'white', margin: '0 0 8px 0' }}>
              {user?.fullName}
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '16px' }}>
              <MailOutlined /> {user?.email}
            </Paragraph>
            <Space style={{ marginTop: 12 }}>
              <Tag color="blue">👨‍💼 Quản trị viên</Tag>
              <Tag color="green">✓ Hoạt động</Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Left Column - Profile Info */}
        <Col xs={24} lg={16}>
          <Card title={<><UserOutlined /> Thông tin cá nhân</>} style={{ marginBottom: 16 }}>
            {editing ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
              >
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                  <Input prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} disabled />
                </Form.Item>

                <Form.Item
                  label="Giới tính"
                  name="gender"
                  rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                >
                  <Select placeholder="Chọn giới tính">
                    <Select.Option value="MALE">Nam</Select.Option>
                    <Select.Option value="FEMALE">Nữ</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Ngày sinh"
                  name="dob"
                  rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                >
                  <Input type="date" />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                      Lưu
                    </Button>
                    <Button icon={<CloseOutlined />} onClick={() => setEditing(false)}>
                      Hủy
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <div style={{ marginBottom: 16 }}>
                      <Text type="secondary">Họ và tên</Text>
                      <Paragraph style={{ fontSize: 16, fontWeight: 500 }}>
                        {user?.fullName}
                      </Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div style={{ marginBottom: 16 }}>
                      <Text type="secondary">Email</Text>
                      <Paragraph style={{ fontSize: 16, fontWeight: 500 }}>
                        {user?.email}
                      </Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div style={{ marginBottom: 16 }}>
                      <Text type="secondary">Giới tính</Text>
                      <Paragraph style={{ fontSize: 16, fontWeight: 500 }}>
                        {user?.gender === 'MALE' ? '👨 Nam' : '👩 Nữ'}
                      </Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div style={{ marginBottom: 16 }}>
                      <Text type="secondary">Ngày sinh</Text>
                      <Paragraph style={{ fontSize: 16, fontWeight: 500 }}>
                        {user?.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                      </Paragraph>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </Card>

          {/* Account Info */}
          <Card title={<><CalendarOutlined /> Thông tin tài khoản</>}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div>
                  <Text type="secondary">Ngày tạo tài khoản</Text>
                  <Paragraph style={{ fontSize: 16, fontWeight: 500 }}>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text type="secondary">Cập nhật lần cuối</Text>
                  <Paragraph style={{ fontSize: 16, fontWeight: 500 }}>
                    {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('vi-VN') : '-'}
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text type="secondary">Nhà cung cấp</Text>
                  <Paragraph style={{ fontSize: 16, fontWeight: 500 }}>
                    {user?.provider === 'LOCAL' ? '📧 Email/Password' : '🔐 ' + user?.provider}
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text type="secondary">Trạng thái</Text>
                  <Paragraph style={{ fontSize: 16, fontWeight: 500 }}>
                    <Tag color="green">✓ Hoạt động</Tag>
                  </Paragraph>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right Column - Settings */}
        <Col xs={24} lg={8}>
          {/* Account Settings */}
          <Card title={<><SettingOutlined style={{ marginRight: 8 }} />Cài đặt</>}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button block onClick={() => setPasswordModalOpen(true)}>🔐 Đổi mật khẩu</Button>
              <Button block>📧 Xác nhận email</Button>
              <Button block>🔔 Cài đặt thông báo</Button>
              <Button block danger>🗑️ Xóa tài khoản</Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <ChangePasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </div>
  );
};

export default AdminProfile;
