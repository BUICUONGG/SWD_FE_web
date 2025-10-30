// Re-export Ant Design components with custom styling if needed
export { Button } from 'antd';
export { Card } from 'antd';
export { Modal } from 'antd';
export { Spin as Loading } from 'antd';
export { Layout } from 'antd';
export { Menu } from 'antd';
export { Form } from 'antd';
export { Input } from 'antd';
export { Typography } from 'antd';
export { Space } from 'antd';
export { Row, Col } from 'antd';

// Custom components
export { AppLayout } from './AppLayout';
export { AdminProtectedRoute, StudentProtectedRoute, PublicRoute } from './ProtectedRoute';
export { CourseManagement } from './CourseManagement';
export { EnrollmentManagement } from './EnrollmentManagement';
export { MajorManagement } from './MajorManagement';
export { MentorProfileManagement } from './MentorProfileManagement';
export { SemesterManagement } from './SemesterManagement';
export { default as UserManagement } from './UserManagement';
export { default as StudentNavbar } from './StudentNavbar';
export { default as StudentLayout } from './StudentLayout';