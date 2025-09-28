import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Checkbox, Divider, Space, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface LoginPageProps {
  onAdminLogin?: () => void;
  onStudentLogin?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAdminLogin, onStudentLogin }) => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Login với username/password (Admin)
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('Đăng nhập Admin thành công!');
      console.log('Admin login values:', values);
      
      // Chuyển đến trang Admin Dashboard
      if (onAdminLogin) {
        onAdminLogin();
      }
    } catch (error) {
      message.error('Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Login với Google (Student)
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('Đăng nhập sinh viên thành công!');
      
      // Chuyển đến trang Student Dashboard
      if (onStudentLogin) {
        onStudentLogin();
      }
    } catch (error) {
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
      padding: '24px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
        bodyStyle={{ padding: '40px' }}
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
          name="login"
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
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
              placeholder="Nhập email của bạn"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
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
            <a href="#" style={{ color: '#1890ff', fontWeight: '500' }}>
              Đăng ký ngay
            </a>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;