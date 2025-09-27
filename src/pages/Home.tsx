import React from 'react';
import { Button, Card, Typography, Row, Col, Space } from 'antd';
import { 
  RocketOutlined, 
  ThunderboltOutlined, 
  CrownOutlined,
  ToolOutlined,
  SafetyOutlined,
  MobileOutlined 
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  return (
    <div style={{ background: '#f0f2f5' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
        color: 'white',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={1} style={{ 
            color: 'white', 
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '24px'
          }}>
            Chào mừng đến với SWD FE Web
          </Title>
          <Paragraph style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '1.5rem',
            marginBottom: '40px',
            maxWidth: '800px',
            margin: '0 auto 40px'
          }}>
            Ứng dụng web hiện đại được xây dựng với React, TypeScript và Ant Design
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large" 
              style={{ 
                height: '50px', 
                fontSize: '16px',
                background: 'white',
                color: '#1890ff',
                borderColor: 'white'
              }}
            >
              Bắt đầu ngay
            </Button>
            <Button 
              size="large" 
              ghost
              style={{ 
                height: '50px', 
                fontSize: '16px',
                borderColor: 'white',
                color: 'white'
              }}
            >
              Tìm hiểu thêm
            </Button>
          </Space>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
            Tính năng nổi bật
          </Title>
          
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ height: '100%', textAlign: 'center' }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <RocketOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }} />
                <Title level={4}>Hiệu suất cao</Title>
                <Paragraph style={{ color: '#666' }}>
                  Được xây dựng với Vite và React 18 để đảm bảo tốc độ tải nhanh và hiệu suất tối ưu.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ height: '100%', textAlign: 'center' }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <ThunderboltOutlined style={{ fontSize: '48px', color: '#722ed1', marginBottom: '20px' }} />
                <Title level={4}>TypeScript</Title>
                <Paragraph style={{ color: '#666' }}>
                  Type-safe với TypeScript giúp phát hiện lỗi sớm và nâng cao chất lượng code.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ height: '100%', textAlign: 'center' }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <CrownOutlined style={{ fontSize: '48px', color: '#fa541c', marginBottom: '20px' }} />
                <Title level={4}>UI/UX hiện đại</Title>
                <Paragraph style={{ color: '#666' }}>
                  Giao diện người dùng đẹp mắt với Ant Design, responsive và thân thiện trên mọi thiết bị.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ height: '100%', textAlign: 'center' }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <ToolOutlined style={{ fontSize: '48px', color: '#13c2c2', marginBottom: '20px' }} />
                <Title level={4}>Dễ dàng tùy chỉnh</Title>
                <Paragraph style={{ color: '#666' }}>
                  Cấu trúc code rõ ràng, components có thể tái sử dụng và dễ dàng mở rộng.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ height: '100%', textAlign: 'center' }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <SafetyOutlined style={{ fontSize: '48px', color: '#f5222d', marginBottom: '20px' }} />
                <Title level={4}>Bảo mật</Title>
                <Paragraph style={{ color: '#666' }}>
                  Tích hợp authentication và authorization để bảo vệ dữ liệu người dùng.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ height: '100%', textAlign: 'center' }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <MobileOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '20px' }} />
                <Title level={4}>Responsive</Title>
                <Paragraph style={{ color: '#666' }}>
                  Hoạt động mượt mà trên desktop, tablet và mobile với thiết kế responsive.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: '#001529',
        color: 'white',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Title level={2} style={{ color: 'white', marginBottom: '24px' }}>
            Sẵn sàng bắt đầu?
          </Title>
          <Paragraph style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '1.2rem',
            marginBottom: '40px'
          }}>
            Tham gia cùng chúng tôi và trải nghiệm những tính năng tuyệt vời
          </Paragraph>
          <Button 
            type="primary" 
            size="large"
            style={{ 
              height: '50px', 
              fontSize: '16px',
              background: '#1890ff',
              borderColor: '#1890ff'
            }}
          >
            Đăng ký ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;