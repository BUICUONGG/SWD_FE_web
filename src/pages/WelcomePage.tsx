import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Statistic, Avatar } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../shared/hooks/useAuth';

const { Title, Paragraph } = Typography;

/**
 * Welcome Page - Displayed after user login
 */
export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();

  return (
    <div style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 64px)', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ff8c28 0%, #ff7a00 100%)',
          color: 'white',
          padding: '60px 40px',
          borderRadius: '12px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: 'white', color: '#ff8c28' }} />
          </div>
          <Title level={1} style={{ color: 'white', marginBottom: '8px' }}>
            👋 Xin chào, {user?.fullName}!
          </Title>
          <Paragraph style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0 }}>
            Chào mừng bạn đến với EXE - Executive Team Management
          </Paragraph>
        </div>

        {/* Quick Actions */}
        <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
          <Col xs={24} md={12}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                borderTop: '5px solid #ff8c28',
                height: '100%'
              }}
              onClick={() => isStudent ? navigate('/student-dashboard') : navigate('/dashboard')}
            >
              <DashboardOutlined style={{ fontSize: '48px', color: '#ff8c28', marginBottom: '16px' }} />
              <Title level={4} style={{ marginBottom: '8px' }}>
                {isStudent ? 'Bảng Điều Khiển' : 'Dashboard'}
              </Title>
              <Paragraph style={{ color: '#666', marginBottom: '16px' }}>
                {isStudent
                  ? 'Xem thông tin khoá học và ghi danh của bạn'
                  : 'Quản lý hệ thống và xem thống kê'
                }
              </Paragraph>
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #ff8c28 0%, #ff7a00 100%)',
                  border: 'none'
                }}
              >
                Truy Cập
              </Button>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                borderTop: '5px solid #ff7a00',
                height: '100%'
              }}
              onClick={() => navigate('/courses')}
            >
              <BookOutlined style={{ fontSize: '48px', color: '#ff7a00', marginBottom: '16px' }} />
              <Title level={4} style={{ marginBottom: '8px' }}>
                Khoá Học
              </Title>
              <Paragraph style={{ color: '#666', marginBottom: '16px' }}>
                {isStudent
                  ? 'Xem danh sách các khoá học có sẵn'
                  : 'Quản lý các khoá học trong hệ thống'
                }
              </Paragraph>
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #ff7a00 0%, #e67300 100%)',
                  border: 'none'
                }}
              >
                Khám Phá
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Additional Info */}
        <Card style={{ marginBottom: '40px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <TeamOutlined style={{ fontSize: '40px', color: '#ff8c28', marginBottom: '12px' }} />
                <Statistic title="Nhóm Tham Gia" value={0} valueStyle={{ color: '#ff8c28' }} />
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <BookOutlined style={{ fontSize: '40px', color: '#ff7a00', marginBottom: '12px' }} />
                <Statistic title="Khoá Học" value={0} valueStyle={{ color: '#ff7a00' }} />
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <CalendarOutlined style={{ fontSize: '40px', color: '#e67300', marginBottom: '12px' }} />
                <Statistic title="Kỳ Học Hiện Tại" value={0} valueStyle={{ color: '#e67300' }} />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Help Text */}
        <Card style={{ background: '#fff9f3', borderLeft: '4px solid #ff8c28' }}>
          <Title level={4} style={{ color: '#ff8c28', marginBottom: '12px' }}>
            💡 Cần Giúp Đỡ?
          </Title>
          <Paragraph style={{ marginBottom: '16px' }}>
            Bạn có thể:
          </Paragraph>
          <ul style={{ marginLeft: '20px' }}>
            <li>Truy cập <strong>Bảng Điều Khiển</strong> để xem tổng quan</li>
            <li>Khám phá <strong>Khoá Học</strong> để ghi danh</li>
            <li>Liên hệ <strong>Quản Trị Viên</strong> nếu cần hỗ trợ</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default WelcomePage;
