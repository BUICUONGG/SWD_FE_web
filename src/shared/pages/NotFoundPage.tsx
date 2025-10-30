import { useNavigate } from 'react-router-dom';
import { Result, Button, Space } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';

/**
 * Not Found Page
 * Hiển thị khi user truy cập route không tồn tại
 */
export const NotFoundPage: React.FC = () => {
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
        status="404"
        title="Trang Không Tồn Tại"
        subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
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

export default NotFoundPage;
