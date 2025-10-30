import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, message, Spin, Select, Input, DatePicker } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { userService } from '../services';
import dayjs from 'dayjs';
import '../styles/UsersForm.css';

/**
 * Users Form Page
 * Create/Edit người dùng
 */
export const UsersFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  // Load user if editing
  useEffect(() => {
    if (id) {
      loadUser();
    } else {
      setInitialLoading(false);
    }
  }, [id]);

  const loadUser = async () => {
    try {
      const user = await userService.getById(parseInt(id!));
      form.setFieldsValue({
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : undefined,
        role: user.role,
      });
    } catch (error) {
      message.error('Lỗi khi tải thông tin người dùng');
      navigate('/users');
    } finally {
      setInitialLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const payload: any = {
        email: values.email,
        fullName: values.fullName,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
        role: values.role,
      };

      if (id) {
        // Update existing user
        await userService.update(parseInt(id), payload);
        message.success('Cập nhật người dùng thành công');
      } else {
        // Create new user
        payload.password = values.password;
        await userService.create(payload);
        message.success('Tạo người dùng thành công');
      }

      navigate('/users');
    } catch (error) {
      message.error(id ? 'Lỗi khi cập nhật người dùng' : 'Lỗi khi tạo người dùng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Spin />;
  }

  return (
    <div className="users-form-container">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        className="users-form-back-btn"
        onClick={() => navigate('/users')}
      >
        Quay Lại
      </Button>

      <Card
        title={id ? 'Chỉnh Sửa Người Dùng' : 'Tạo Người Dùng Mới'}
        className="users-form-card"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input
              placeholder="Nhập email"
              disabled={!!id}
              type="email"
            />
          </Form.Item>

          <Form.Item
            label="Tên Đầy Đủ"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập tên đầy đủ' }]}
          >
            <Input placeholder="Nhập tên đầy đủ" />
          </Form.Item>

          {!id && (
            <Form.Item
              label="Mật Khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          <Form.Item
            label="Vai Trò"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select
              placeholder="Chọn vai trò"
              options={[
                { label: 'Admin', value: 'ADMIN' },
                { label: 'Sinh Viên', value: 'STUDENT' },
                { label: 'Giảng Viên', value: 'MENTOR' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Giới Tính"
            name="gender"
          >
            <Select
              placeholder="Chọn giới tính"
              allowClear
              options={[
                { label: 'Nam', value: 'Nam' },
                { label: 'Nữ', value: 'Nữ' },
                { label: 'Khác', value: 'Khác' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Ngày Sinh"
            name="dateOfBirth"
          >
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              {id ? 'Cập Nhật' : 'Tạo Mới'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
