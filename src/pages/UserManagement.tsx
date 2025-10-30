import React from 'react';
import { Card, Typography, Alert } from 'antd';

const { Title } = Typography;

const UserManagement: React.FC = () => {
  return (
    <Card>
      <Title level={3}>Quản lý người dùng</Title>
      <Alert
        message="Tính năng đang phát triển"
        description="Tính năng quản lý người dùng sẽ được phát triển trong phiên bản tiếp theo."
        type="info"
        showIcon
      />
    </Card>
  );
};

export default UserManagement;