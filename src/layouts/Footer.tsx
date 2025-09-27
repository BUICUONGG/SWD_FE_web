import React from 'react';
import { Layout, Typography, Row, Col, Space } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

export const Footer: React.FC = () => {
  return (
    <AntFooter style={{ background: '#001529', color: 'white', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[32, 32]}>
          {/* Company Info */}
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: 16 }}>
              SWD FE Web
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              Ứng dụng web hiện đại được xây dựng với React, TypeScript và Ant Design.
            </Text>
          </Col>

          {/* Quick Links */}
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: 16 }}>
              Liên kết nhanh
            </Title>
            <Space direction="vertical" size="small">
              <a href="/" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                Trang chủ
              </a>
              <a href="/about" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                Giới thiệu
              </a>
              <a href="/contact" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                Liên hệ
              </a>
            </Space>
          </Col>

          {/* Contact */}
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: 16 }}>
              Liên hệ
            </Title>
            <Space direction="vertical" size="small">
              <Space>
                <MailOutlined />
                <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  info@swdfeweb.com
                </Text>
              </Space>
              <Space>
                <PhoneOutlined />
                <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  (84) 123-456-789
                </Text>
              </Space>
              <Space>
                <EnvironmentOutlined />
                <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  Tp. Hồ Chí Minh, Việt Nam
                </Text>
              </Space>
            </Space>
          </Col>
        </Row>

        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
          marginTop: 32, 
          paddingTop: 24, 
          textAlign: 'center' 
        }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
            © 2025 SWD FE Web. All rights reserved.
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};