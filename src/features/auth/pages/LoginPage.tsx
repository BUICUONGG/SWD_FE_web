import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../../shared/hooks/useAuth';
import { authService } from '../services';
import '../styles/LoginPage.css';

interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * Login Page Component
 */
export const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, setLoading, isLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setLocalLoading(true);
      setLoading(true);

      // Call auth service
      const response = await authService.login({
        email: values.email,
        password: values.password,
      });

      // Update store
      login(response.user, response.accessToken, response.refreshToken);

      // Show success message
      message.success('Đăng nhập thành công!');

      // Redirect to welcome page
      setTimeout(() => {
        navigate('/welcome');
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
      message.error(errorMessage);
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Spin spinning={localLoading || isLoading}>
        <Card className="login-card" title="Đăng Nhập">
          <Form
            form={form}
            onFinish={handleLogin}
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
                prefix={<UserOutlined />}
                placeholder="email@example.com"
                disabled={localLoading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
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
                Đăng Nhập
              </Button>
            </Form.Item>

            <div className="login-footer">
              <span>Chưa có tài khoản? </span>
              <a onClick={() => navigate('/register')}>Đăng ký</a>
            </div>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

export default LoginPage;
