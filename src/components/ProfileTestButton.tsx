import React from 'react';
import { Button, Card, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

const ProfileTestButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card 
      style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 1000,
        background: '#f0f9ff',
        border: '1px solid #1890ff'
      }}
      size="small"
    >
      <Space>
        <Button 
          type="primary" 
          icon={<UserOutlined />}
          onClick={() => navigate('/profile')}
        >
          🧪 Test Profile Page
        </Button>
      </Space>
    </Card>
  );
};

export default ProfileTestButton;