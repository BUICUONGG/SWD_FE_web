import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Typography, Space, Button, Descriptions, Modal } from 'antd';
import { HistoryOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import StudentLayout from '../components/StudentLayout';

const { Title } = Typography;

interface EnrollmentRecord {
  id: number;
  courseCode: string;
  courseName: string;
  instructor: string;
  enrollmentDate: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'DROPPED';
  semester: string;
  credits: number;
  grade?: string;
}

const StudentEnrollmentHistory: React.FC = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<EnrollmentRecord | null>(null);

  useEffect(() => {
    // Mock data
    const mockData: EnrollmentRecord[] = [
      {
        id: 1,
        courseCode: 'CS435',
        courseName: 'Quản trị dự án phần mềm',
        instructor: 'TS. Lê Văn C',
        enrollmentDate: '2024-09-01',
        status: 'APPROVED',
        semester: 'Fall 2024',
        credits: 4,
        grade: 'A'
      },
      {
        id: 2,
        courseCode: 'CS440',
        courseName: 'Thiết kế UI/UX hiện đại',
        instructor: 'ThS. Trần Thị B',
        enrollmentDate: '2024-09-05',
        status: 'COMPLETED',
        semester: 'Fall 2024',
        credits: 3,
        grade: 'B+'
      },
      {
        id: 3,
        courseCode: 'CS445',
        courseName: 'Lập trình React nâng cao',
        instructor: 'TS. Nguyễn Văn A',
        enrollmentDate: '2024-10-01',
        status: 'PENDING',
        semester: 'Fall 2024',
        credits: 3
      }
    ];

    setTimeout(() => {
      setEnrollments(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'APPROVED': return 'green';
      case 'COMPLETED': return 'blue';
      case 'DROPPED': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ duyệt';
      case 'APPROVED': return 'Đã duyệt';
      case 'COMPLETED': return 'Hoàn thành';
      case 'DROPPED': return 'Đã bỏ';
      default: return status;
    }
  };

  const columns = [
    {
      title: 'Mã lớp',
      dataIndex: 'courseCode',
      key: 'courseCode',
      width: 100,
      render: (code: string) => <span style={{ fontWeight: 'bold' }}>{code}</span>
    },
    {
      title: 'Tên lớp học',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
      key: 'instructor',
      width: 150,
    },
    {
      title: 'Học kỳ',
      dataIndex: 'semester',
      key: 'semester',
      width: 120,
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Tín chỉ',
      dataIndex: 'credits',
      key: 'credits',
      width: 80,
      align: 'center' as const,
    },
    {
      title: 'Điểm',
      dataIndex: 'grade',
      key: 'grade',
      width: 80,
      align: 'center' as const,
      render: (grade: string) => grade || '-'
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_: any, record: EnrollmentRecord) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setSelectedRecord(record)}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  return (
    <StudentLayout>
      <div style={{ padding: '24px' }}>
        <Space align="center" style={{ marginBottom: '24px' }}>
          <HistoryOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Title level={2} style={{ margin: 0 }}>
            Lịch sử đăng ký lớp học
          </Title>
        </Space>

        <Card>
          <Table
            columns={columns}
            dataSource={enrollments}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng cộng ${total} bản ghi`
            }}
          />
        </Card>

        {/* Detail Modal */}
        <Modal
          title={
            <Space>
              <CalendarOutlined />
              <span>Chi tiết đăng ký</span>
            </Space>
          }
          open={!!selectedRecord}
          onCancel={() => setSelectedRecord(null)}
          footer={[
            <Button key="close" onClick={() => setSelectedRecord(null)}>
              Đóng
            </Button>
          ]}
          width={600}
        >
          {selectedRecord && (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Mã lớp">
                <strong>{selectedRecord.courseCode}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Tên lớp học">
                {selectedRecord.courseName}
              </Descriptions.Item>
              <Descriptions.Item label="Giảng viên">
                {selectedRecord.instructor}
              </Descriptions.Item>
              <Descriptions.Item label="Học kỳ">
                {selectedRecord.semester}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng ký">
                {new Date(selectedRecord.enrollmentDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {getStatusText(selectedRecord.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tín chỉ">
                {selectedRecord.credits}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm số">
                {selectedRecord.grade ? (
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                    {selectedRecord.grade}
                  </span>
                ) : (
                  <span style={{ color: '#8c8c8c' }}>Chưa có điểm</span>
                )}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </StudentLayout>
  );
};

export default StudentEnrollmentHistory;