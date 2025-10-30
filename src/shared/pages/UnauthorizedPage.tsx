import { useNavigate } from 'react-router-dom';
import { Result, Button, Space } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';

/**
 * Unauthorized Page
 * Hiển thị khi user cố gắng truy cập route không được phép
 */
export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f5f5',
      }}
    >
      <Result
        status="403"
        title="Không Có Quyền Truy Cập"
        subTitle="Bạn không có quyền truy cập tài nguyên này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là một lỗi."
        extra={
          <Space>
            <Button
              type="primary"
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              Quay Lại
            </Button>
            <Button
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
            >
              Trang Chủ
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default UnauthorizedPage;
