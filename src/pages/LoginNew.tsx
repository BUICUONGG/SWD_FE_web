import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Checkbox, Divider, Space, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService, isApiError, isLoginSuccess } from '../services/authService';
import { TokenStorage, getUserFromToken } from '../utils/jwt';
import type { LoginRequest } from '../types/auth';

const { Title, Paragraph } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

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
        const { accessToken, refreshToken } = response.data;
        
        // Store tokens
        TokenStorage.setAccessToken(accessToken);
        TokenStorage.setRefreshToken(refreshToken);
        
        // Get user info from token
        const user = getUserFromToken(accessToken);
        if (user) {
          message.success(`Chào mừng ${user.email}!`);
          
          // Trigger storage event to update auth state
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'accessToken',
            newValue: accessToken
          }));
          
          // Navigate based on role
          if (user.isAdmin) {
            navigate('/admin/dashboard');
          } else if (user.isStudent) {
            navigate('/student/dashboard');
          } else {
            navigate('/');
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Có lỗi xảy ra khi đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  // Login với Google
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      message.info('Chức năng đăng nhập Google đang được phát triển...');
    } catch {
      message.error('Đăng nhập Google thất bại!');
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
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: 450, 
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: 'none'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🎓
          </div>
          <Title level={2} style={{ marginBottom: 8, color: '#1f2937' }}>
            Đăng nhập
          </Title>
          <Paragraph style={{ color: '#6b7280', fontSize: '16px' }}>
            Chào mừng trở lại với SWD Academy
          </Paragraph>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nhập email của bạn"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập mật khẩu"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              <a href="#" style={{ color: '#667eea' }}>Quên mật khẩu?</a>
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
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        {/* Demo accounts section */}
        <div style={{ 
          background: '#f8fafc', 
          padding: '16px', 
          borderRadius: '8px', 
          marginTop: '16px',
          border: '1px solid #e5e7eb'
        }}>
          <Paragraph style={{ marginBottom: 12, fontWeight: 500, color: '#374151' }}>
            🚀 Tài khoản demo:
          </Paragraph>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              size="small" 
              block 
              onClick={() => fillDemoAccount('admin')}
              style={{ 
                borderRadius: '6px',
                borderColor: '#d1d5db',
                color: '#374151'
              }}
            >
              👨‍💼 Admin (admin@admin.com / admin)
            </Button>
            <Button 
              size="small" 
              block 
              onClick={() => fillDemoAccount('student')}
              style={{ 
                borderRadius: '6px',
                borderColor: '#d1d5db',
                color: '#374151'
              }}
            >
              👨‍🎓 Student (student@student.com / student)
            </Button>
          </Space>
        </div>

        <Divider style={{ margin: '24px 0' }}>
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>Hoặc đăng nhập với</span>
        </Divider>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button 
            icon={<GoogleOutlined />} 
            loading={googleLoading}
            onClick={handleGoogleLogin}
            block
            style={{ 
              height: '44px',
              borderRadius: '8px',
              borderColor: '#d1d5db'
            }}
          >
            Đăng nhập với Google
          </Button>
          
          <Button 
            icon={<FacebookOutlined />} 
            block
            style={{ 
              height: '44px',
              borderRadius: '8px',
              borderColor: '#d1d5db'
            }}
          >
            Đăng nhập với Facebook
          </Button>
        </Space>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Paragraph style={{ color: '#6b7280', margin: 0 }}>
            Chưa có tài khoản? {' '}
            <Link 
              to="/register"
              style={{ 
                color: '#667eea',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Đăng ký ngay
            </Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;