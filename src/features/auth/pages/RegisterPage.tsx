import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../../../shared/hooks/useAuth';
import { authService } from '../services';
import '../styles/RegisterPage.css';

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone?: string;
}

/**
 * Register Page Component
 */
export const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, setLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setLocalLoading(true);
      setLoading(true);

      // Validate password match
      if (values.password !== values.confirmPassword) {
        message.error('Mật khẩu không trùng khớp!');
        return;
      }

      // Call auth service
      const response = await authService.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
      });

      // Update store
      login(response.user, response.accessToken, response.refreshToken);

      // Show success message
      message.success('Đăng ký thành công!');

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại';
      message.error(errorMessage);
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Spin spinning={localLoading}>
        <Card className="register-card" title="Đăng Ký Tài Khoản">
          <Form
            form={form}
            onFinish={handleRegister}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="email@example.com"
                disabled={localLoading}
              />
            </Form.Item>

            <Form.Item
              name="fullName"
              label="Họ và Tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập họ và tên"
                disabled={localLoading}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số Điện Thoại"
              rules={[
                {
                  pattern: /^[0-9]{10}$/,
                  message: 'Số điện thoại phải có 10 chữ số!',
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="0123456789"
                disabled={localLoading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật Khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                {
                  min: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
                disabled={localLoading}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác Nhận Mật Khẩu"
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập lại mật khẩu"
                disabled={localLoading}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={localLoading}
                disabled={localLoading}
              >
                Đăng Ký
              </Button>
            </Form.Item>

            <div className="register-footer">
              <span>Đã có tài khoản? </span>
              <a onClick={() => navigate('/login')}>Đăng nhập</a>
            </div>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

export default RegisterPage;
