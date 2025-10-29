import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Select, DatePicker, message, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import { authService, isApiError } from '../services/authService';
import type { RegisterRequest } from '../types/auth';
import dayjs, { type Dayjs } from 'dayjs';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface RegisterPageProps {
  onRegisterSuccess?: () => void;
  onBackToLogin?: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onBackToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: {
    email: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    dob?: dayjs.Dayjs;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
  }) => {
    setLoading(true);
    try {
      const registerData: RegisterRequest = {
        email: values.email,
        fullName: values.fullName,
        password: values.password,
        confirmPassword: values.confirmPassword,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : undefined,
        gender: values.gender,
      };

      const response = await authService.register(registerData);
      
      if (isApiError(response)) {
        message.error(response.message || 'Đăng ký thất bại!');
        return;
      }

      message.success('Đăng ký tài khoản thành công!');
      form.resetFields();
      
      // Callback when register success
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
      
    } catch (error) {
      console.error('Register error:', error);
      message.error('Có lỗi xảy ra khi đăng ký!');
    } finally {
      setLoading(false);
    }
  };

  // Fill demo FPT account
  const fillDemoFPTAccount = () => {
    const randomId = Math.floor(Math.random() * 1000);
    form.setFieldsValue({
      email: `student${randomId}@fpt.edu.vn`,
      fullName: `Nguyễn Văn ${randomId}`,
      password: 'password123',
      confirmPassword: 'password123',
      gender: 'MALE',
      dob: dayjs('2000-01-01')
    });
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
          maxWidth: '500px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
        styles={{ body: { padding: '40px' } }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>
            Đăng ký tài khoản
          </Title>
          <Paragraph type="secondary">
            Tạo tài khoản mới để trải nghiệm hệ thống SWD Academy
          </Paragraph>
        </div>

        {/* Register Form */}
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          {/* Quick Fill Demo Button */}
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <Button 
              onClick={fillDemoFPTAccount}
              style={{
                background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                fontWeight: 500
              }}
              size="small"
            >
              📝 Điền thông tin mẫu
            </Button>
          </div>

          <Form.Item
            name="email"
            label="Email FPT"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
              { 
                pattern: /@fpt\.edu\.vn$/,
                message: 'Email phải có định dạng @fpt.edu.vn!'
              }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="student@fpt.edu.vn"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nguyễn Văn A"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              name="dob"
              label="Ngày sinh"
              style={{ width: '50%', marginRight: '8px' }}
            >
              <DatePicker 
                prefix={<CalendarOutlined />}
                placeholder="Chọn ngày sinh"
                style={{ borderRadius: '6px', width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              style={{ width: '50%', marginLeft: '8px' }}
            >
              <Select
                placeholder="Chọn giới tính"
                style={{ borderRadius: '6px' }}
              >
                <Option value="MALE">Nam</Option>
                <Option value="FEMALE">Nữ</Option>
                <Option value="OTHER">Khác</Option>
              </Select>
            </Form.Item>
          </Space.Compact>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 4, message: 'Mật khẩu phải có ít nhất 4 ký tự!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập mật khẩu"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập lại mật khẩu"
              style={{ borderRadius: '6px' }}
            />
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
                borderRadius: '6px',
                marginTop: '16px'
              }}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
            </Button>
          </Form.Item>
        </Form>

        {/* Requirements Notice */}
        <div style={{ 
          background: '#e6f7ff', 
          border: '1px solid #91d5ff',
          borderRadius: '6px',
          padding: '12px',
          marginTop: '16px'
        }}>
          <div style={{ fontSize: '14px', color: '#1890ff', fontWeight: 'bold', marginBottom: '8px' }}>
            📋 Yêu cầu đăng ký:
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            • Email phải có định dạng @fpt.edu.vn<br/>
            • Mật khẩu tối thiểu 4 ký tự<br/>
            • Họ tên là thông tin bắt buộc
          </div>
        </div>

        {/* Back to Login */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Paragraph type="secondary">
            Đã có tài khoản?{' '}
            <Button 
              type="link" 
              onClick={onBackToLogin}
              style={{ color: '#1890ff', fontWeight: '500', padding: 0 }}
            >
              Đăng nhập ngay
            </Button>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;