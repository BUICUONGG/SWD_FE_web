import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Select, DatePicker, message, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import { authService, isApiError } from '../services/authService';
import type { RegisterRequest } from '../types/auth';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface RegisterPageProps {
  onRegisterSuccess?: () => void;
  onBackToLogin?: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ 
  onRegisterSuccess, 
  onBackToLogin 
}) => {
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
      
      // Call success callback
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

  // Validate DOB (must be at least 16 years old)
    const validateDOB = (_: unknown, value: dayjs.Dayjs) => {
    if (!value) {
      return Promise.resolve();
    }
    
    const age = dayjs().diff(value, 'year');
    if (age < 16) {
      return Promise.reject(new Error('Bạn phải ít nhất 16 tuổi để đăng ký!'));
    }
    
    return Promise.resolve();
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
          width: 500, 
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
            Đăng ký tài khoản
          </Title>
          <Paragraph style={{ color: '#6b7280', fontSize: '16px' }}>
            Tạo tài khoản mới để bắt đầu hành trình học tập
          </Paragraph>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          layout="vertical"
          scrollToFirstError
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
              prefix={<MailOutlined />} 
              placeholder="Nhập email của bạn"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' },
              { max: 50, message: 'Họ và tên không được quá 50 ký tự!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nhập họ và tên đầy đủ"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              label="Ngày sinh"
              name="dob"
              style={{ width: '60%', marginRight: '16px' }}
              rules={[
                { validator: validateDOB }
              ]}
            >
              <DatePicker 
                placeholder="Chọn ngày sinh"
                style={{ width: '100%', borderRadius: '8px' }}
                format="DD/MM/YYYY"
                suffixIcon={<CalendarOutlined />}
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Form.Item>

            <Form.Item
              label="Giới tính"
              name="gender"
              style={{ width: '40%' }}
            >
              <Select 
                placeholder="Chọn giới tính"
                style={{ borderRadius: '8px' }}
                allowClear
              >
                <Option value="MALE">Nam</Option>
                <Option value="FEMALE">Nữ</Option>
                <Option value="OTHER">Khác</Option>
              </Select>
            </Form.Item>
          </Space.Compact>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              { 
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số!'
              }
            ]}
            hasFeedback
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập mật khẩu"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
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
            hasFeedback
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập lại mật khẩu"
              style={{ borderRadius: '8px' }}
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
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Đăng ký tài khoản
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Paragraph style={{ color: '#6b7280', margin: 0 }}>
            Đã có tài khoản? {' '}
            <Button 
              type="link"
              onClick={onBackToLogin}
              style={{ 
                color: '#667eea',
                fontWeight: '500',
                padding: 0,
                height: 'auto'
              }}
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