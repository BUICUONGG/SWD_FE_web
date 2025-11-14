import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Alert,
  Progress,
  Typography,
  Divider,
  Space,
  Tag,
  Select,
  Button,
  Table,
  Avatar,
  Empty
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  BulbOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { reportService, isDashboardResponse, isApiError, isStudentReportResponse, isMentorPerformanceResponse } from '../services/reportService';
import { semesterService, isSemesterListResponse } from '../services/semesterService';
import { mentorProfileService } from '../services/mentorProfileService';
import type { DashboardData, MentorPerformance, StudentReport } from '../types/report';
import type { Semester } from '../types/semester';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminReportDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>();
  const [selectedMentor, setSelectedMentor] = useState<number | undefined>();
  const [mentorPerformance, setMentorPerformance] = useState<MentorPerformance[]>([]);
  const [studentReport, setStudentReport] = useState<StudentReport | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Sample data functions
  const getSampleSemesters = (): Semester[] => [
    { semesterId: 1, code: 'FA2025', name: 'Fall 2025', year: 2025, term: 'FALL', startDate: '2025-09-01', endDate: '2025-12-31' },
    { semesterId: 2, code: 'SP2025', name: 'Spring 2025', year: 2025, term: 'SPRING', startDate: '2025-01-01', endDate: '2025-04-30' },
    { semesterId: 3, code: 'SU2024', name: 'Summer 2024', year: 2024, term: 'SUMMER', startDate: '2024-05-01', endDate: '2024-08-31' }
  ];

  const getSampleMentors = () => [
    { mentorProfileId: 1, userId: 10, fullName: 'TS. Nguyễn Văn A', specialization: 'Software Development' },
    { mentorProfileId: 2, userId: 11, fullName: 'ThS. Trần Thị B', specialization: 'AI & Machine Learning' },
    { mentorProfileId: 3, userId: 12, fullName: 'TS. Lê Văn C', specialization: 'Data Science' },
    { mentorProfileId: 4, userId: 13, fullName: 'ThS. Phạm Thị D', specialization: 'Web Development' }
  ];

  const getSampleMentorPerformance = (): MentorPerformance[] => [
    {
      mentorId: 1,
      mentorName: 'TS. Nguyễn Văn A',
      shortName: 'NVA',
      totalCourses: 3,
      totalStudents: 72,
      totalTeams: 15,
      averageStudentsPerCourse: 24,
      averageTeamsPerCourse: 5,
      teamFormationRate: 92.5,
      courses: []
    },
    {
      mentorId: 2,
      mentorName: 'ThS. Trần Thị B',
      shortName: 'TTB',
      totalCourses: 2,
      totalStudents: 54,
      totalTeams: 11,
      averageStudentsPerCourse: 27,
      averageTeamsPerCourse: 5.5,
      teamFormationRate: 88.9,
      courses: []
    },
    {
      mentorId: 3,
      mentorName: 'TS. Lê Văn C',
      shortName: 'LVC',
      totalCourses: 4,
      totalStudents: 98,
      totalTeams: 19,
      averageStudentsPerCourse: 24.5,
      averageTeamsPerCourse: 4.75,
      teamFormationRate: 95.2,
      courses: []
    }
  ];

  const getSampleStudentReport = (): StudentReport => ({
    reportType: 'BY_MENTOR',
    filterName: 'TS. Nguyễn Văn A',
    filterValue: 1,
    totalStudents: 72,
    enrolledStudents: 72,
    studentsInTeams: 68,
    studentsWithoutTeams: 4,
    courseDetails: [
      {
        courseId: 1,
        courseCode: 'SWD392',
        courseName: 'Web Development',
        mentorName: 'TS. Nguyễn Văn A',
        enrolledCount: 28,
        teamsCount: 6,
        studentsInTeams: 27,
        teamFormationRate: 96.4
      },
      {
        courseId: 2,
        courseCode: 'PRJ301',
        courseName: 'Java Web Application',
        mentorName: 'TS. Nguyễn Văn A',
        enrolledCount: 24,
        teamsCount: 5,
        studentsInTeams: 22,
        teamFormationRate: 91.7
      },
      {
        courseId: 3,
        courseCode: 'SWP391',
        courseName: 'Software Project',
        mentorName: 'TS. Nguyễn Văn A',
        enrolledCount: 20,
        teamsCount: 4,
        studentsInTeams: 19,
        teamFormationRate: 95.0
      }
    ]
  });

  const getSampleDashboardData = (): DashboardData => {
    return {
      totalUsers: 156,
      totalStudents: 142,
      totalMentors: 12,
      totalCourses: 18,
      totalEnrollments: 284,
      totalTeams: 52,
      totalIdeas: 234,
      activeCourses: 15,
      completedCourses: 3,
      currentSemesterStats: {
        semesterCode: 'FA2025',
        semesterName: 'Fall Semester 2025',
        coursesCount: 18,
        enrollmentsCount: 284,
        teamsCount: 52,
        averageTeamSize: 4.73
      }
    };
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch semesters
        const semestersResponse = await semesterService.getAllSemesters();
        if (!isApiError(semestersResponse) && isSemesterListResponse(semestersResponse)) {
          setSemesters(semestersResponse.data);
        } else {
          setSemesters(getSampleSemesters());
        }

        // Fetch mentors
        const mentorsResponse = await mentorProfileService.getAllMentorProfiles();
        if (mentorsResponse.success && Array.isArray(mentorsResponse.data)) {
          setMentors(mentorsResponse.data);
        } else {
          setMentors(getSampleMentors());
        }

        // Fetch dashboard data
        await fetchDashboard();
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setSemesters(getSampleSemesters());
        setMentors(getSampleMentors());
        setData(getSampleDashboardData());
        setError('Đang sử dụng dữ liệu mẫu (Không kết nối được backend)');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await reportService.getDashboard();
      
      if (isApiError(response)) {
        console.warn('API error, using sample data:', response.message);
        setData(getSampleDashboardData());
        setError('Đang sử dụng dữ liệu mẫu (API chưa sẵn sàng)');
      } else if (isDashboardResponse(response)) {
        setData(response.data);
      } else {
        console.warn('API not ready, using sample data');
        setData(getSampleDashboardData());
        setError('Đang sử dụng dữ liệu mẫu (API chưa kết nối)');
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setData(getSampleDashboardData());
      setError('Đang sử dụng dữ liệu mẫu (Không kết nối được backend)');
    }
  };

  const handleApplyFilters = async () => {
    setLoadingFilters(true);
    try {
      // Fetch mentor performance
      if (selectedSemester) {
        const performanceResponse = await reportService.getMentorPerformance(selectedSemester);
        if (!isApiError(performanceResponse) && isMentorPerformanceResponse(performanceResponse)) {
          setMentorPerformance(performanceResponse.data);
        } else {
          setMentorPerformance(getSampleMentorPerformance());
        }
      }

      // Fetch student report by mentor
      if (selectedMentor && selectedSemester) {
        const reportResponse = await reportService.getStudentsByMentor(selectedMentor, selectedSemester);
        console.log('Student report response (with semester):', reportResponse);
        if (!isApiError(reportResponse) && isStudentReportResponse(reportResponse)) {
          console.log('Student report data:', reportResponse.data);
          setStudentReport(reportResponse.data);
        } else {
          console.log('Using sample student report');
          setStudentReport(getSampleStudentReport());
        }
      } else if (selectedMentor) {
        const reportResponse = await reportService.getStudentsByMentor(selectedMentor);
        console.log('Student report response (no semester):', reportResponse);
        if (!isApiError(reportResponse) && isStudentReportResponse(reportResponse)) {
          console.log('Student report data:', reportResponse.data);
          setStudentReport(reportResponse.data);
        } else {
          console.log('Using sample student report');
          setStudentReport(getSampleStudentReport());
        }
      }
    } catch (err) {
      console.error('Error applying filters:', err);
      setMentorPerformance(getSampleMentorPerformance());
      setStudentReport(getSampleStudentReport());
    } finally {
      setLoadingFilters(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedSemester(undefined);
    setSelectedMentor(undefined);
    setMentorPerformance([]);
    setStudentReport(null);
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Đang tải dữ liệu dashboard...">
          <div style={{ minHeight: '200px' }} />
        </Spin>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Thông báo"
          description={error || 'Không thể tải dữ liệu dashboard'}
          type="warning"
          showIcon
        />
      </div>
    );
  }

  const userDistribution = [
    { label: 'Sinh viên', value: data.totalStudents, color: '#3b82f6', percent: data.totalUsers > 0 ? (data.totalStudents / data.totalUsers) * 100 : 0 },
    { label: 'Giảng viên', value: data.totalMentors, color: '#10b981', percent: data.totalUsers > 0 ? (data.totalMentors / data.totalUsers) * 100 : 0 },
    { label: 'Admin', value: data.totalUsers - data.totalStudents - data.totalMentors, color: '#8b5cf6', percent: data.totalUsers > 0 ? ((data.totalUsers - data.totalStudents - data.totalMentors) / data.totalUsers) * 100 : 0 }
  ];

  const courseStatusPercent = data.totalCourses > 0 ? (data.activeCourses / data.totalCourses) * 100 : 0;

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
          🎯 Dashboard Tổng quan
        </Title>
        <Text type="secondary">Tổng hợp thống kê và báo cáo hệ thống</Text>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          message="Thông báo"
          description={error}
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
          closable
        />
      )}

      {/* Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>
          <FilterOutlined /> Bộ lọc báo cáo chi tiết
        </Title>
        <Alert
          message="Hướng dẫn sử dụng"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li><strong>Chọn Học kỳ:</strong> Xem hiệu suất tất cả giảng viên trong học kỳ đó</li>
              <li><strong>Chọn Giảng viên:</strong> Xem báo cáo sinh viên của giảng viên (có thể kết hợp với học kỳ)</li>
            </ul>
          }
          type="info"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
        <Space size="middle" wrap>
          <Space direction="vertical" size={4}>
            <Text strong>Học kỳ</Text>
            <Select
              placeholder="Chọn học kỳ"
              style={{ width: 200 }}
              value={selectedSemester}
              onChange={setSelectedSemester}
              allowClear
            >
              {semesters.map(sem => (
                <Option key={sem.semesterId} value={sem.semesterId}>
                  {sem.name} ({sem.code})
                </Option>
              ))}
            </Select>
          </Space>
          <Space direction="vertical" size={4}>
            <Text strong>Giảng viên</Text>
            <Select
              placeholder="Chọn giảng viên"
              style={{ width: 250 }}
              value={selectedMentor}
              onChange={setSelectedMentor}
              allowClear
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {mentors.map(mentor => (
                <Option key={mentor.mentorProfileId} value={mentor.userId}>
                  {mentor.fullName}
                </Option>
              ))}
            </Select>
          </Space>
          <Space style={{ marginTop: 24 }}>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={handleApplyFilters}
              loading={loadingFilters}
              disabled={!selectedSemester && !selectedMentor}
            >
              Áp dụng lọc
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleResetFilters}
              disabled={!selectedSemester && !selectedMentor}
            >
              Xóa bộ lọc
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Main Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: '12px',
              borderTop: '4px solid #3b82f6',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            <Statistic
              title={<Text strong style={{ fontSize: '16px' }}>👥 Tổng số người dùng</Text>}
              value={data.totalUsers}
              prefix={<UserOutlined style={{ color: '#3b82f6' }} />}
              valueStyle={{ color: '#3b82f6', fontSize: '28px', fontWeight: 'bold' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Space>
              <Tag color="blue">{data.totalStudents} SV</Tag>
              <Tag color="green">{data.totalMentors} GV</Tag>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: '12px',
              borderTop: '4px solid #10b981',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            <Statistic
              title={<Text strong style={{ fontSize: '16px' }}>📚 Tổng khóa học</Text>}
              value={data.totalCourses}
              prefix={<BookOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ color: '#10b981', fontSize: '28px', fontWeight: 'bold' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Space>
              <Tag color="success">{data.activeCourses} Hoạt động</Tag>
              <Tag>{data.completedCourses} Hoàn thành</Tag>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: '12px',
              borderTop: '4px solid #f59e0b',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            <Statistic
              title={<Text strong style={{ fontSize: '16px' }}>👥 Tổng số nhóm</Text>}
              value={data.totalTeams}
              prefix={<TeamOutlined style={{ color: '#f59e0b' }} />}
              valueStyle={{ color: '#f59e0b', fontSize: '28px', fontWeight: 'bold' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">Số lượng nhóm đã tạo</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: '12px',
              borderTop: '4px solid #8b5cf6',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            <Statistic
              title={<Text strong style={{ fontSize: '16px' }}>💡 Tổng số ý tưởng</Text>}
              value={data.totalIdeas}
              prefix={<BulbOutlined style={{ color: '#8b5cf6' }} />}
              valueStyle={{ color: '#8b5cf6', fontSize: '28px', fontWeight: 'bold' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">Ý tưởng đã đề xuất</Text>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <RiseOutlined style={{ color: '#1890ff' }} />
                <Text strong>Phân bố người dùng</Text>
              </Space>
            }
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {userDistribution.map((item) => (
                <div key={item.label}>
                  <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text strong>{item.label}</Text>
                    <Text>{item.value} ({item.percent.toFixed(1)}%)</Text>
                  </Space>
                  <Progress
                    percent={item.percent}
                    strokeColor={item.color}
                    showInfo={false}
                    strokeWidth={12}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <Text strong>Trạng thái khóa học</Text>
              </Space>
            }
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={courseStatusPercent}
                width={180}
                strokeWidth={10}
                strokeColor={{
                  '0%': '#52c41a',
                  '100%': '#1890ff'
                }}
                format={() => (
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>
                      {data.activeCourses}
                    </div>
                    <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      Đang hoạt động
                    </div>
                  </div>
                )}
              />
              <Divider />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Hoàn thành"
                    value={data.completedCourses}
                    prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Đang học"
                    value={data.activeCourses}
                    prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Current Semester Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <TrophyOutlined style={{ color: '#faad14' }} />
                <Text strong>Thống kê học kỳ hiện tại: {data.currentSemesterStats.semesterName}</Text>
              </Space>
            }
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card type="inner">
                  <Statistic
                    title="Khóa học"
                    value={data.currentSemesterStats.coursesCount}
                    prefix={<BookOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card type="inner">
                  <Statistic
                    title="Đăng ký"
                    value={data.currentSemesterStats.enrollmentsCount}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card type="inner">
                  <Statistic
                    title="Nhóm"
                    value={data.currentSemesterStats.teamsCount}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card type="inner">
                  <Statistic
                    title="Số SV trung bình/nhóm"
                    value={data.currentSemesterStats.averageTeamSize.toFixed(2)}
                    prefix={<RiseOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Additional Ratio Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={8}>
          <Card
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: '#fff', fontSize: '14px' }}>Tỷ lệ đăng ký/sinh viên</Text>
              <Text style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>
                {data.totalStudents > 0 ? (data.totalEnrollments / data.totalStudents).toFixed(2) : 0}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                {data.totalEnrollments} đăng ký / {data.totalStudents} sinh viên
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: '#fff', fontSize: '14px' }}>Tỷ lệ tạo nhóm</Text>
              <Text style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>
                {data.totalEnrollments > 0 ? ((data.totalTeams * data.currentSemesterStats.averageTeamSize / data.totalEnrollments) * 100).toFixed(1) : 0}%
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                Sinh viên đã tham gia nhóm
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: '#fff', fontSize: '14px' }}>Ý tưởng trung bình/nhóm</Text>
              <Text style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>
                {data.totalTeams > 0 ? (data.totalIdeas / data.totalTeams).toFixed(1) : 0}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                {data.totalIdeas} ý tưởng / {data.totalTeams} nhóm
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Mentor Performance Table */}
      {mentorPerformance.length > 0 && (
        <Card 
          title={
            <Space>
              <TeamOutlined />
              <Text strong>Hiệu suất Giảng viên</Text>
            </Space>
          }
          style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}
        >
          <Table
            dataSource={mentorPerformance}
            rowKey="mentorId"
            pagination={false}
            columns={[
              {
                title: 'Giảng viên',
                dataIndex: 'mentorName',
                key: 'mentorName',
                render: (text, record) => (
                  <Space>
                    <Avatar style={{ backgroundColor: '#1890ff' }}>{record.shortName}</Avatar>
                    <Text strong>{text}</Text>
                  </Space>
                )
              },
              {
                title: 'Khóa học',
                dataIndex: 'totalCourses',
                key: 'totalCourses',
                align: 'center',
                render: (val) => <Tag color="blue">{val}</Tag>
              },
              {
                title: 'Sinh viên',
                dataIndex: 'totalStudents',
                key: 'totalStudents',
                align: 'center',
                render: (val) => <Tag color="green">{val}</Tag>
              },
              {
                title: 'Nhóm',
                dataIndex: 'totalTeams',
                key: 'totalTeams',
                align: 'center',
                render: (val) => <Tag color="orange">{val}</Tag>
              },
              {
                title: 'TB SV/Khóa',
                dataIndex: 'averageStudentsPerCourse',
                key: 'averageStudentsPerCourse',
                align: 'center',
                render: (val) => <Text>{val.toFixed(1)}</Text>
              },
              {
                title: 'Tỷ lệ tạo nhóm',
                dataIndex: 'teamFormationRate',
                key: 'teamFormationRate',
                align: 'center',
                render: (val) => (
                  <Progress 
                    type="circle" 
                    percent={val} 
                    width={50}
                    strokeColor={val >= 90 ? '#52c41a' : val >= 80 ? '#faad14' : '#ff4d4f'}
                  />
                )
              }
            ]}
          />
        </Card>
      )}

      {/* Student Report by Mentor */}
      {studentReport && (
        <Card
          title={
            <Space>
              <UserOutlined />
              <Text strong>Báo cáo Sinh viên - {studentReport.filterName}</Text>
            </Space>
          }
          style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}
        >
          <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
            <Col span={6}>
              <Statistic 
                title="Tổng sinh viên" 
                value={studentReport.totalStudents}
                prefix={<UserOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="Đã tham gia nhóm" 
                value={studentReport.studentsInTeams}
                valueStyle={{ color: '#52c41a' }}
                prefix={<TeamOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="Chưa có nhóm" 
                value={studentReport.studentsWithoutTeams}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="Tỷ lệ tạo nhóm" 
                value={studentReport.totalStudents > 0 ? ((studentReport.studentsInTeams / studentReport.totalStudents) * 100).toFixed(1) : 0}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
          </Row>

          <Divider />

          {studentReport.courseDetails && studentReport.courseDetails.length > 0 ? (
            <Table
              dataSource={studentReport.courseDetails}
              rowKey="courseId"
              pagination={false}
              columns={[
                {
                  title: 'Khóa học',
                  dataIndex: 'courseName',
                  key: 'courseName',
                  render: (text, record) => (
                    <Space direction="vertical" size={2}>
                      <Text strong>{text}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{record.courseCode}</Text>
                    </Space>
                  )
                },
                {
                  title: 'SV đăng ký',
                  dataIndex: 'enrolledCount',
                  key: 'enrolledCount',
                  align: 'center'
                },
                {
                  title: 'Số nhóm',
                  dataIndex: 'teamsCount',
                  key: 'teamsCount',
                  align: 'center'
                },
                {
                  title: 'SV trong nhóm',
                  dataIndex: 'studentsInTeams',
                  key: 'studentsInTeams',
                  align: 'center'
                },
                {
                  title: 'Tỷ lệ tạo nhóm',
                  dataIndex: 'teamFormationRate',
                  key: 'teamFormationRate',
                  align: 'center',
                  render: (val) => (
                    <Tag color={val >= 90 ? 'success' : val >= 80 ? 'warning' : 'error'}>
                      {val.toFixed(1)}%
                    </Tag>
                  )
                }
              ]}
            />
          ) : (
            <Empty 
              description="Giảng viên này chưa có khóa học nào hoặc chưa có dữ liệu"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default AdminReportDashboard;
