import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, message, Spin, Select, Input, InputNumber } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { mentorService } from '../services';
import '../styles/MentorsForm.css';

/**
 * Mentors Form Page
 * Create/Edit hồ sơ giảng viên
 */
export const MentorsFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  // Load mentor if editing
  useEffect(() => {
    if (id) {
      loadMentor();
    } else {
      setInitialLoading(false);
    }
  }, [id]);

  const loadMentor = async () => {
    try {
      const mentor = await mentorService.getById(parseInt(id!));
      form.setFieldsValue({
        userId: mentor.userId,
        shortName: mentor.shortName,
        department: mentor.department,
        specialization: mentor.specialization,
        yearsOfExperience: mentor.yearsOfExperience,
        status: mentor.status,
      });
    } catch (error) {
      message.error('Lỗi khi tải thông tin giảng viên');
      navigate('/mentors');
    } finally {
      setInitialLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const payload = {
        userId: values.userId,
        shortName: values.shortName,
        department: values.department,
        specialization: values.specialization,
        yearsOfExperience: values.yearsOfExperience,
        status: values.status,
      };

      if (id) {
        // Update existing mentor
        await mentorService.update(parseInt(id), payload);
        message.success('Cập nhật hồ sơ giảng viên thành công');
      } else {
        // Create new mentor
        await mentorService.create(payload);
        message.success('Tạo hồ sơ giảng viên thành công');
      }

      navigate('/mentors');
    } catch (error) {
      message.error(id ? 'Lỗi khi cập nhật hồ sơ giảng viên' : 'Lỗi khi tạo hồ sơ giảng viên');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Spin />;
  }

  return (
    <div className="mentors-form-container">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        className="mentors-form-back-btn"
        onClick={() => navigate('/mentors')}
      >
        Quay Lại
      </Button>

      <Card
        title={id ? 'Chỉnh Sửa Hồ Sơ Giảng Viên' : 'Tạo Hồ Sơ Giảng Viên Mới'}
        className="mentors-form-card"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="User ID"
            name="userId"
            rules={[{ required: true, message: 'Vui lòng nhập User ID' }]}
          >
            <InputNumber
              placeholder="Nhập User ID"
              disabled={!!id}
              min={1}
            />
          </Form.Item>

          <Form.Item
            label="Tên Viết Tắt"
            name="shortName"
          >
            <Input placeholder="Nhập tên viết tắt" />
          </Form.Item>

          <Form.Item
            label="Khoa/Bộ Môn"
            name="department"
          >
            <Input placeholder="Nhập khoa/bộ môn" />
          </Form.Item>

          <Form.Item
            label="Chuyên Ngành"
            name="specialization"
          >
            <Input placeholder="Nhập chuyên ngành" />
          </Form.Item>

          <Form.Item
            label="Kinh Nghiệm (năm)"
            name="yearsOfExperience"
          >
            <InputNumber
              placeholder="Nhập số năm kinh nghiệm"
              min={0}
            />
          </Form.Item>

          <Form.Item
            label="Trạng Thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select
              placeholder="Chọn trạng thái"
              options={[
                { label: 'Hoạt Động', value: 'ACTIVE' },
                { label: 'Không Hoạt Động', value: 'INACTIVE' },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              {id ? 'Cập Nhật' : 'Tạo Mới'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
