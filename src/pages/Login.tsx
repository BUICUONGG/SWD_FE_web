import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Checkbox, Divider, Space, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { authService, isApiError, isLoginSuccess } from '../services/authService';
import { TokenStorage, getUserFromToken } from '../utils/jwt';
import type { LoginRequest } from '../types/auth';

const { Title, Paragraph } = Typography;

interface LoginPageProps {
  onAdminLogin?: (userName?: string) => void;
  onStudentLogin?: (userName?: string) => void;
  onRegisterClick?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAdminLogin, onStudentLogin, onRegisterClick }) => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form] = Form.useForm();

  // Fill demo account data
  const fillDemoAccount = (type: 'admin' | 'student') => {
    if (type === 'admin') {
      form.setFieldsValue({
        email: 'admin@admin.com',
        password: 'admin'
      });
    } else {
      form.setFieldsValue({
        email: 'student@student.com',
        password: 'student'
      });
    }
  };

  // Login với username/password (API call)
  const onFinish = async (values: { email: string; password: string; remember: boolean }) => {
    setLoading(true);
    try {
      const loginData: LoginRequest = {
        email: values.email,
        password: values.password
      };

      const response = await authService.login(loginData);
      
      if (isApiError(response)) {
        message.error(response.message || 'Đăng nhập thất bại!');
        return;
      }

      if (isLoginSuccess(response)) {
        // Lưu tokens vào localStorage
        TokenStorage.setAccessToken(response.data.accessToken);
        TokenStorage.setRefreshToken(response.data.refreshToken);
        
        // Lấy thông tin user từ token
        const userInfo = getUserFromToken(response.data.accessToken);
        
        if (userInfo) {
          message.success('Đăng nhập thành công!');
          
          // Gọi callback tương ứng với role
          if (userInfo.isAdmin && onAdminLogin) {
            onAdminLogin(userInfo.email);
          } else if (userInfo.isStudent && onStudentLogin) {
            onStudentLogin(userInfo.email);
          }
        } else {
          message.error('Không thể lấy thông tin người dùng!');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Có lỗi xảy ra khi đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  // Demo login với student account (có thể thay thế bằng Google OAuth thật)
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // Demo login với student account
      const studentLoginData: LoginRequest = {
        email: 'student@student.com',
        password: 'student'
      };

      const response = await authService.login(studentLoginData);
      
      if (isApiError(response)) {
        message.error(response.message || 'Đăng nhập Student thất bại!');
        return;
      }

      if (isLoginSuccess(response)) {
        // Lưu tokens vào localStorage
        TokenStorage.setAccessToken(response.data.accessToken);
        TokenStorage.setRefreshToken(response.data.refreshToken);
        
        // Lấy thông tin user từ token
        const userInfo = getUserFromToken(response.data.accessToken);
        
        if (userInfo && userInfo.isStudent) {
          message.success('Đăng nhập sinh viên thành công!');
          
          if (onStudentLogin) {
            onStudentLogin(userInfo.email);
          }
        } else {
          message.error('Tài khoản không phải sinh viên!');
        }
      }
    } catch (error) {
      console.error('Student login error:', error);
      message.error('Có lỗi xảy ra khi đăng nhập!');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
        styles={{ body: { padding: '40px' } }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>
            Đăng nhập tài khoản
          </Title>
          <Paragraph type="secondary">
            Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục.
          </Paragraph>
        </div>

        {/* Login Form */}
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          {/* Quick Login Buttons */}
          <div style={{ marginBottom: '24px' }}>
            <Typography.Text style={{ 
              display: 'block', 
              marginBottom: '12px', 
              color: '#666',
              fontSize: '14px'
            }}>
              Đăng nhập nhanh:
            </Typography.Text>
            <Space size="small" style={{ width: '100%', justifyContent: 'center' }}>
              <Button 
                onClick={() => fillDemoAccount('admin')}
                style={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '6px',
                  fontWeight: 500
                }}
                size="small"
              >
                👨‍💼 Admin
              </Button>
              <Button 
                onClick={() => fillDemoAccount('student')}
                style={{
                  background: 'linear-gradient(45deg, #4834d4, #686de0)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '6px',
                  fontWeight: 500
                }}
                size="small"
              >
                🎓 Student
              </Button>
            </Space>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nhập email"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập mật khẩu của bạn"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <a href="#" style={{ color: '#1890ff' }}>
                Quên mật khẩu?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              style={{ 
                height: '48px',
                fontSize: '16px',
                fontWeight: '500',
                borderRadius: '6px'
              }}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <Divider>Hoặc</Divider>

        {/* Social Login */}
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button 
            block 
            size="large"
            icon={<GoogleOutlined />}
            loading={googleLoading}
            onClick={handleGoogleLogin}
            style={{ 
              height: '48px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {googleLoading ? 'Đang đăng nhập...' : 'Đăng nhập sinh viên (Google)'}
          </Button>
          <Button 
            block 
            size="large"
            icon={<FacebookOutlined />}
            style={{ 
              height: '48px',
              borderRadius: '6px',
              backgroundColor: '#1877f2',
              borderColor: '#1877f2',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Đăng nhập với Facebook
          </Button>
        </Space>

        {/* Instructions */}
        <div style={{ 
          background: '#f6ffed', 
          border: '1px solid #b7eb8f',
          borderRadius: '6px',
          padding: '12px',
          marginTop: '16px'
        }}>
          <div style={{ fontSize: '14px', color: '#52c41a', fontWeight: 'bold', marginBottom: '8px' }}>
            💡 Hướng dẫn đăng nhập:
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            • <strong>Admin:</strong> Sử dụng form username/password bên trên<br/>
            • <strong>Sinh viên:</strong> Nhấn nút "Đăng nhập sinh viên (Google)"
          </div>
        </div>

        {/* Sign up link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Paragraph type="secondary">
            Chưa có tài khoản?{' '}
            <Button 
              type="link" 
              onClick={onRegisterClick}
              style={{ color: '#1890ff', fontWeight: '500', padding: 0 }}
            >
              Đăng ký ngay
            </Button>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;