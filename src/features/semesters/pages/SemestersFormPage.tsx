import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, message, Spin, Select, Input, DatePicker } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { semesterService } from '../services';
import dayjs from 'dayjs';
import '../styles/SemestersForm.css';

/**
 * Semesters Form Page
 * Create/Edit kỳ học
 */
export const SemestersFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  // Load semester if editing
  useEffect(() => {
    if (id) {
      loadSemester();
    } else {
      setInitialLoading(false);
    }
  }, [id]);

  const loadSemester = async () => {
    try {
      const semester = await semesterService.getById(parseInt(id!));
      form.setFieldsValue({
        code: semester.code,
        name: semester.name,
        startDate: dayjs(semester.startDate),
        endDate: dayjs(semester.endDate),
        status: semester.status,
      });
    } catch (error) {
      message.error('Lỗi khi tải thông tin kỳ học');
      navigate('/semesters');
    } finally {
      setInitialLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const payload = {
        code: values.code,
        name: values.name,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        status: values.status,
      };

      if (id) {
        // Update existing semester
        await semesterService.update(parseInt(id), payload);
        message.success('Cập nhật kỳ học thành công');
      } else {
        // Create new semester
        await semesterService.create(payload);
        message.success('Tạo kỳ học thành công');
      }

      navigate('/semesters');
    } catch (error) {
      message.error(id ? 'Lỗi khi cập nhật kỳ học' : 'Lỗi khi tạo kỳ học');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Spin />;
  }

  return (
    <div className="semesters-form-container">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        className="semesters-form-back-btn"
        onClick={() => navigate('/semesters')}
      >
        Quay Lại
      </Button>

      <Card
        title={id ? 'Chỉnh Sửa Kỳ Học' : 'Tạo Kỳ Học Mới'}
        className="semesters-form-card"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Mã Kỳ"
            name="code"
            rules={[{ required: true, message: 'Vui lòng nhập mã kỳ' }]}
          >
            <Input
              placeholder="Nhập mã kỳ (ví dụ: FA24)"
              disabled={!!id}
            />
          </Form.Item>

          <Form.Item
            label="Tên Kỳ"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên kỳ' }]}
          >
            <Input placeholder="Nhập tên kỳ (ví dụ: Fall 2024)" />
          </Form.Item>

          <Form.Item
            label="Ngày Bắt Đầu"
            name="startDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="Chọn ngày bắt đầu"
            />
          </Form.Item>

          <Form.Item
            label="Ngày Kết Thúc"
            name="endDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="Chọn ngày kết thúc"
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
                { label: 'Đã Hoàn Thành', value: 'COMPLETED' },
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
