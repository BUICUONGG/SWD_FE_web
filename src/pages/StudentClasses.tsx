import React from 'react';
import { Card, Row, Col, Typography, Empty, Button } from 'antd';
import { ArrowLeftOutlined, BuildOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';

const { Title, Paragraph } = Typography;

const StudentClasses: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StudentLayout>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            🏫 Lớp học
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: '8px 0 0 0' }}>
            Quản lý các lớp học của bạn
          </Paragraph>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card>
              <Empty
                description="Tính năng này đang được phát triển"
                style={{ padding: '40px 0' }}
              >
                <div style={{ marginTop: 16 }}>
                  <BuildOutlined style={{ fontSize: '48px', color: '#bfbfbf' }} />
                </div>
              </Empty>
            </Card>
          </Col>
        </Row>

        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/student/dashboard')}
          style={{ marginTop: 16 }}
        >
          Quay lại
        </Button>
      </div>
    </StudentLayout>
  );
};

export default StudentClasses;
