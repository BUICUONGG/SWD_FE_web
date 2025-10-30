import React from 'react';
import { FloatButton } from 'antd';
import { BugOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

export const TestingFloatButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on test page itself
  if (location.pathname === '/api-test') {
    return null;
  }

  const handleClick = () => {
    navigate('/api-test');
  };

  return (
    <FloatButton
      icon={<BugOutlined />}
      tooltip="API Testing Dashboard"
      type="primary"
      style={{
        right: 24,
        bottom: 80,
      }}
      onClick={handleClick}
    />
  );
};

export default TestingFloatButton;