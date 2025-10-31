import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  List,
  Tag,
  Button,
  Spin,
  Input,
  Space,
  Avatar,
  Progress,
  Typography,
  Empty,
  Alert,
  Modal,
  Table,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  CrownOutlined,
  UserAddOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import StudentLayout from '../components/StudentLayout';
import { teamService, isApiError as isTeamApiError, isTeamListResponse, isJoinTeamResponse } from '../services/teamService';
import { userService, isApiError, isUserResponse } from '../services/userService';
import type { Team } from '../types/team';

const { Title, Text, Paragraph } = Typography;

const StudentGroups: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [joinedTeamIds, setJoinedTeamIds] = useState<Set<number>>(new Set());
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showTeamDetail, setShowTeamDetail] = useState(false);
  const [joiningTeamId, setJoiningTeamId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current user
        const userResponse = await userService.getCurrentUser();
        if (isApiError(userResponse)) {
          throw new Error(userResponse.message);
        }
        if (!isUserResponse(userResponse)) {
          throw new Error('Failed to get user info');
        }
        // Get userId for fetching user's teams
        const userId = userResponse.data.userId;
        const teamsResponse = await teamService.getAllTeams();
        if (isTeamApiError(teamsResponse)) {
          throw new Error(teamsResponse.message);
        }
        if (!isTeamListResponse(teamsResponse)) {
          throw new Error('Failed to fetch teams');
        }
        setTeams(teamsResponse.data);
        setFilteredTeams(teamsResponse.data);

        // Fetch user's teams to check which ones they joined
        const userTeamsResponse = await teamService.getTeamsByUser(userId);
        if (!isTeamApiError(userTeamsResponse) && isTeamListResponse(userTeamsResponse)) {
          const userTeamIds = new Set(userTeamsResponse.data.map(t => t.teamId));
          setJoinedTeamIds(userTeamIds);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = teams.filter(team =>
      team.name.toLowerCase().includes(value.toLowerCase()) ||
      team.description?.toLowerCase().includes(value.toLowerCase()) ||
      team.courseName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTeams(filtered);
  };

  const handleJoinTeam = async (team: Team) => {
    if (joinedTeamIds.has(team.teamId)) {
      Modal.info({
        title: 'Đã tham gia',
        content: 'Bạn đã tham gia nhóm này rồi!'
      });
      return;
    }

    if (team.currentMembers >= team.maxMembers) {
      Modal.error({
        title: 'Nhóm đầy',
        content: 'Nhóm này đã đủ thành viên rồi.'
      });
      return;
    }

    setJoiningTeamId(team.teamId);
    try {
      const response = await teamService.joinTeam(team.teamId);
      if (isJoinTeamResponse(response)) {
        // Update local state
        setJoinedTeamIds(new Set([...joinedTeamIds, team.teamId]));
        // Update team member count
        const updatedTeams = teams.map(t =>
          t.teamId === team.teamId
            ? { ...t, currentMembers: t.currentMembers + 1 }
            : t
        );
        setTeams(updatedTeams);
        setFilteredTeams(updatedTeams.filter(t =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.courseName.toLowerCase().includes(searchTerm.toLowerCase())
        ));

        Modal.success({
          title: 'Thành công',
          content: `Bạn đã xin tham gia nhóm "${team.name}" thành công!`
        });
      } else if (isTeamApiError(response)) {
        Modal.error({
          title: 'Lỗi',
          content: response.message || 'Xin tham gia nhóm thất bại'
        });
      }
    } catch (err) {
      console.error('Error joining team:', err);
      Modal.error({
        title: 'Lỗi',
        content: 'Có lỗi xảy ra khi xin tham gia nhóm'
      });
    } finally {
      setJoiningTeamId(null);
    }
  };

  const showTeamMembers = (team: Team) => {
    setSelectedTeam(team);
    setShowTeamDetail(true);
  };

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" tip="Đang tải nhóm..." />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            👥 Nhóm học
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: '8px 0 0 0' }}>
            Xem danh sách các nhóm và xin tham gia
          </Paragraph>
        </Card>

        {error && (
          <Alert
            message="Lỗi tải dữ liệu"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Search Bar */}
        <Card style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm theo tên nhóm, mô tả hoặc lớp học..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            size="large"
          />
        </Card>

        {/* Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>
                  {teams.length}
                </div>
                <Text type="secondary">Tổng số nhóm</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#52c41a' }}>
                  {joinedTeamIds.size}
                </div>
                <Text type="secondary">Nhóm của bạn</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#faad14' }}>
                  {teams.filter(t => t.currentMembers < t.maxMembers).length}
                </div>
                <Text type="secondary">Nhóm còn chỗ trống</Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Teams List */}
        <Card title={<><TeamOutlined /> Danh sách nhóm</>}>
          {filteredTeams.length === 0 ? (
            <Empty
              description={searchTerm ? 'Không tìm thấy nhóm nào' : 'Không có nhóm nào'}
              style={{ padding: '40px 0' }}
            />
          ) : (
            <List
              dataSource={filteredTeams}
              renderItem={(team) => {
                const isJoined = joinedTeamIds.has(team.teamId);
                const isFull = team.currentMembers >= team.maxMembers;
                const isJoining = joiningTeamId === team.teamId;

                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={64}
                          style={{ backgroundColor: '#1890ff', fontSize: '24px' }}
                        >
                          <TeamOutlined />
                        </Avatar>
                      }
                      title={
                        <Space>
                          <Text strong style={{ fontSize: '16px' }}>{team.name}</Text>
                          {isJoined && (
                            <Tag color="green">✓ Đã tham gia</Tag>
                          )}
                          {isFull && !isJoined && (
                            <Tag color="red">Đầy</Tag>
                          )}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {team.description && (
                            <Text type="secondary">{team.description}</Text>
                          )}
                          <Space>
                            <Tag color="blue">{team.courseName}</Tag>
                            <Tag color="purple">Nhóm trưởng: {team.leaderName}</Tag>
                          </Space>
                          <Space>
                            <UserOutlined />
                            <Text type="secondary">
                              {team.currentMembers}/{team.maxMembers} thành viên
                            </Text>
                          </Space>
                          <Progress
                            percent={Math.round((team.currentMembers / team.maxMembers) * 100)}
                            size="small"
                            strokeColor={
                              team.currentMembers >= team.maxMembers
                                ? '#ff4d4f'
                                : team.currentMembers >= (team.maxMembers * 0.7)
                                ? '#faad14'
                                : '#52c41a'
                            }
                          />
                        </Space>
                      }
                    />
                    <Space>
                      <Button
                        type="default"
                        onClick={() => showTeamMembers(team)}
                      >
                        Xem thành viên
                      </Button>
                      <Tooltip title={isFull ? 'Nhóm đã đầy' : isJoined ? 'Bạn đã tham gia' : ''}>
                        <Button
                          type={isJoined ? 'default' : 'primary'}
                          icon={isJoining ? <LoadingOutlined /> : <UserAddOutlined />}
                          loading={isJoining}
                          disabled={isFull || isJoined || isJoining}
                          onClick={() => handleJoinTeam(team)}
                        >
                          {isJoined ? 'Đã tham gia' : isFull ? 'Đầy' : 'Xin tham gia'}
                        </Button>
                      </Tooltip>
                    </Space>
                  </List.Item>
                );
              }}
            />
          )}
        </Card>

        {/* Team Members Modal */}
        <Modal
          title={`👥 Thành viên nhóm: ${selectedTeam?.name}`}
          open={showTeamDetail}
          onCancel={() => setShowTeamDetail(false)}
          width={700}
          footer={null}
        >
          {selectedTeam && (
            <Table
              dataSource={selectedTeam.members.map((member, idx) => ({
                key: idx,
                ...member
              }))}
              columns={[
                {
                  title: 'Tên',
                  dataIndex: 'fullName',
                  key: 'fullName',
                  render: (text: string, record: any) => (
                    <Space>
                      <Avatar src={record.avatarUrl} size={32} icon={<UserOutlined />} />
                      <span>{text}</span>
                      {record.role === 'LEADER' && (
                        <Tag icon={<CrownOutlined />} color="gold">
                          Nhóm trưởng
                        </Tag>
                      )}
                    </Space>
                  ),
                },
                {
                  title: 'Email',
                  dataIndex: 'email',
                  key: 'email',
                },
                {
                  title: 'Vào nhóm',
                  dataIndex: 'joinedAt',
                  key: 'joinedAt',
                  render: (text: string) => new Date(text).toLocaleDateString('vi-VN'),
                },
              ]}
              pagination={false}
              size="small"
            />
          )}
        </Modal>
      </div>
    </StudentLayout>
  );
};

export default StudentGroups;
