import React from 'react';
import { Button, Card, Typography, Row, Col, Space, Statistic, Timeline } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  UsergroupAddOutlined,
  BookOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
  RocketOutlined,
  HeartOutlined,
  LoginOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#fff9f3' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #ff8c28 0%, #ff7a00 100%)',
        color: 'white',
        padding: '120px 24px',
        textAlign: 'center',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={1} style={{ 
            color: 'white', 
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
          }}>
            🚀 EXE - Executive Team Management
          </Title>
          <Title level={2} style={{ 
            color: 'rgba(255, 255, 255, 0.95)', 
            fontSize: '1.8rem',
            fontWeight: '500',
            marginBottom: '24px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            Nền tảng quản lý nhóm môn khởi nghiệp
          </Title>
          <Paragraph style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '1.1rem',
            marginBottom: '48px',
            maxWidth: '900px',
            margin: '0 auto 48px'
          }}>
            Hệ thống toàn diện giúp quản lý sinh viên, khoá học, ghi danh tham gia và kết quả học tập một cách hiệu quả và chuyên nghiệp.
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
              style={{ 
                height: '50px', 
                fontSize: '16px',
                background: 'white',
                color: '#ff8c28',
                borderColor: 'white',
                fontWeight: '600'
              }}
            >
              Đăng Nhập Ngay
            </Button>
            <Button 
              size="large" 
              ghost
              onClick={() => navigate('/register')}
              icon={<ArrowRightOutlined />}
              style={{ 
                height: '50px', 
                fontSize: '16px',
                borderColor: 'white',
                color: 'white',
                fontWeight: '600'
              }}
            >
              Đăng Ký Tài Khoản
            </Button>
          </Space>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ padding: '60px 24px', background: 'linear-gradient(135deg, #fff9f3 0%, #ffe8cc 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <UsergroupAddOutlined style={{ fontSize: '40px', color: '#ff8c28', marginBottom: '12px' }} />
                <Statistic 
                  title="Sinh Viên" 
                  value={0}
                  valueStyle={{ color: '#ff8c28', fontSize: '28px', fontWeight: 'bold' }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <BookOutlined style={{ fontSize: '40px', color: '#ff7a00', marginBottom: '12px' }} />
                <Statistic 
                  title="Khoá Học" 
                  value={0}
                  valueStyle={{ color: '#ff7a00', fontSize: '28px', fontWeight: 'bold' }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <TeamOutlined style={{ fontSize: '40px', color: '#e67300', marginBottom: '12px' }} />
                <Statistic 
                  title="Nhóm Môn" 
                  value={0}
                  valueStyle={{ color: '#e67300', fontSize: '28px', fontWeight: 'bold' }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: '40px', color: '#ff8c28', marginBottom: '12px' }} />
                <Statistic 
                  title="Hoàn Thành" 
                  value={0}
                  valueStyle={{ color: '#ff8c28', fontSize: '28px', fontWeight: 'bold' }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px', color: '#ff8c28', fontSize: '2.5rem' }}>
            ✨ Tính Năng Chính
          </Title>
          
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ 
                  height: '100%', 
                  textAlign: 'center',
                  borderTop: '5px solid #ff8c28',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '40px 24px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 140, 40, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03)';
                }}
              >
                <UsergroupAddOutlined style={{ fontSize: '48px', color: '#ff8c28', marginBottom: '20px' }} />
                <Title level={4} style={{ color: '#ff8c28' }}>Quản Lý Sinh Viên</Title>
                <Paragraph style={{ color: '#666' }}>
                  Quản lý hồ sơ sinh viên, thông tin liên hệ, vai trò và trạng thái hoạt động một cách tập trung.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ 
                  height: '100%', 
                  textAlign: 'center',
                  borderTop: '5px solid #ff7a00',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '40px 24px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 140, 40, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03)';
                }}
              >
                <BookOutlined style={{ fontSize: '48px', color: '#ff7a00', marginBottom: '20px' }} />
                <Title level={4} style={{ color: '#ff7a00' }}>Quản Lý Khoá Học</Title>
                <Paragraph style={{ color: '#666' }}>
                  Tạo và quản lý các khoá học, thiết lập thời gian bắt đầu kết thúc, và quản lý giáo viên phụ trách.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ 
                  height: '100%', 
                  textAlign: 'center',
                  borderTop: '5px solid #e67300',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '40px 24px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 140, 40, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03)';
                }}
              >
                <TeamOutlined style={{ fontSize: '48px', color: '#e67300', marginBottom: '20px' }} />
                <Title level={4} style={{ color: '#e67300' }}>Quản Lý Ghi Danh</Title>
                <Paragraph style={{ color: '#666' }}>
                  Xử lý ghi danh sinh viên vào khoá học, phê duyệt các yêu cầu và theo dõi trạng thái đăng ký.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ 
                  height: '100%', 
                  textAlign: 'center',
                  borderTop: '5px solid #ff8c28',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '40px 24px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 140, 40, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03)';
                }}
              >
                <CheckCircleOutlined style={{ fontSize: '48px', color: '#ff8c28', marginBottom: '20px' }} />
                <Title level={4} style={{ color: '#ff8c28' }}>Đánh Giá & Điểm</Title>
                <Paragraph style={{ color: '#666' }}>
                  Nhập và quản lý điểm số, xếp loại kết quả học tập của sinh viên trong từng khoá học.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ 
                  height: '100%', 
                  textAlign: 'center',
                  borderTop: '5px solid #ff7a00',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '40px 24px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 140, 40, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03)';
                }}
              >
                <CalendarOutlined style={{ fontSize: '48px', color: '#ff7a00', marginBottom: '20px' }} />
                <Title level={4} style={{ color: '#ff7a00' }}>Quản Lý Kỳ Học</Title>
                <Paragraph style={{ color: '#666' }}>
                  Tổ chức các kỳ học, thiết lập thời gian hoạt động và quản lý lịch học chi tiết.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ 
                  height: '100%', 
                  textAlign: 'center',
                  borderTop: '5px solid #e67300',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '40px 24px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 140, 40, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03)';
                }}
              >
                <TrophyOutlined style={{ fontSize: '48px', color: '#e67300', marginBottom: '20px' }} />
                <Title level={4} style={{ color: '#e67300' }}>Báo Cáo & Thống Kê</Title>
                <Paragraph style={{ color: '#666' }}>
                  Xem báo cáo chi tiết về hiệu quả học tập, thống kê tham gia và những thống kê cần thiết khác.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Timeline Section */}
      <div style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #fff9f3 0%, #ffe8cc 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px', color: '#ff8c28', fontSize: '2.5rem' }}>
            📋 Quy Trình Làm Việc
          </Title>
          
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <Timeline
                items={[
                  {
                    color: '#ff8c28',
                    children: (
                      <>
                        <p style={{ fontWeight: 'bold', color: '#ff8c28' }}>Bước 1: Tạo Khoá Học</p>
                        <p>Admin tạo các khoá học mới với thông tin chi tiết</p>
                      </>
                    ),
                  },
                  {
                    color: '#ff7a00',
                    children: (
                      <>
                        <p style={{ fontWeight: 'bold', color: '#ff7a00' }}>Bước 2: Ghi Danh Sinh Viên</p>
                        <p>Sinh viên ghi danh vào khoá học họ muốn tham gia</p>
                      </>
                    ),
                  },
                  {
                    color: '#e67300',
                    children: (
                      <>
                        <p style={{ fontWeight: 'bold', color: '#e67300' }}>Bước 3: Phê Duyệt Đơn</p>
                        <p>Admin phê duyệt hoặc từ chối các đơn ghi danh</p>
                      </>
                    ),
                  },
                  {
                    color: '#ff8c28',
                    children: (
                      <>
                        <p style={{ fontWeight: 'bold', color: '#ff8c28' }}>Bước 4: Đánh Giá Kết Quả</p>
                        <p>Giáo viên nhập điểm và đánh giá sinh viên sau khoá học</p>
                      </>
                    ),
                  },
                ]}
              />
            </Col>
            
            <Col xs={24} md={12}>
              <Card
                style={{ 
                  background: 'linear-gradient(135deg, #ff8c28 0%, #ff7a00 100%)',
                  borderRadius: '12px',
                  color: 'white',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '40px'
                }}
                bodyStyle={{ border: 'none', background: 'transparent' }}
              >
                <div style={{ textAlign: 'center' }}>
                  <RocketOutlined style={{ fontSize: '64px', marginBottom: '24px' }} />
                  <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
                    Bắt Đầu Hôm Nay
                  </Title>
                  <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '32px', fontSize: '1.1rem' }}>
                    Tham gia hệ thống EXE và quản lý nhóm môn khởi nghiệp một cách chuyên nghiệp.
                  </Paragraph>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                      type="primary"
                      size="large"
                      block
                      icon={<LoginOutlined />}
                      onClick={() => navigate('/login')}
                      style={{ 
                        height: '50px', 
                        fontSize: '16px',
                        background: 'white',
                        color: '#ff8c28',
                        borderColor: 'white',
                        fontWeight: '600'
                      }}
                    >
                      Đăng Nhập Ngay
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #ff8c28 0%, #ff7a00 100%)',
        color: 'white',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <HeartOutlined style={{ fontSize: '40px', marginBottom: '20px' }} />
          <Title level={2} style={{ color: 'white', marginBottom: '16px', textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            Được Xây Dựng Với Tình Yêu Thích
          </Title>
          <Paragraph style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '1rem',
            marginBottom: '0'
          }}>
            © 2024 EXE - Executive Team Management System. Hệ thống quản lý chuyên nghiệp cho nhóm môn khởi nghiệp.
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default HomePage;