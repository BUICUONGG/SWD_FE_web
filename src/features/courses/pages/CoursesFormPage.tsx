import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Card, message, Spin, Select, InputNumber, DatePicker } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { coursesService } from '../services';
import { CourseStatus } from '../types';
import '../styles/CoursesForm.css';

/**
 * Courses Form Page
 * Create/Edit khóa học
 */
export const CoursesFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  // Load course if editing
  useEffect(() => {
    if (id) {
      loadCourse(parseInt(id));
    }
  }, [id]);

  const loadCourse = async (courseId: number) => {
    try {
      setInitialLoading(true);
      const data = await coursesService.getById(courseId);
      form.setFieldsValue({
        code: data.code,
        name: data.name,
        description: data.description,
        status: data.status,
        semesterId: data.semesterId,
        mentorId: data.mentorId,
        subjectId: data.subjectId,
        maxStudents: data.maxStudents,
        startDate: data.startDate ? dayjs(data.startDate) : null,
        endDate: data.endDate ? dayjs(data.endDate) : null,
      });
    } catch (error) {
      message.error('Lỗi khi tải thông tin khóa học');
      navigate('/courses');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD'),
      };

      if (id) {
        await coursesService.update(parseInt(id), payload);
        message.success('Cập nhật khóa học thành công');
      } else {
        await coursesService.create(payload);
        message.success('Tạo khóa học thành công');
      }

      navigate('/courses');
    } catch (error) {
      message.error(id ? 'Lỗi khi cập nhật khóa học' : 'Lỗi khi tạo khóa học');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="courses-form-container">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/courses')}
        className="courses-form-back-btn"
      >
        Quay Lại
      </Button>

      <Spin spinning={initialLoading}>
        <Card className="courses-form-card" title={id ? 'Sửa Khóa Học' : 'Tạo Khóa Học Mới'}>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="code"
              label="Mã Khóa"
              rules={[{ required: true, message: 'Vui lòng nhập mã khóa!' }]}
            >
              <Input placeholder="Ví dụ: CS101" disabled={!!id} />
            </Form.Item>

            <Form.Item
              name="name"
              label="Tên Khóa"
              rules={[{ required: true, message: 'Vui lòng nhập tên khóa!' }]}
            >
              <Input placeholder="Ví dụ: Lập Trình Web" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô Tả"
            >
              <Input.TextArea placeholder="Mô tả chi tiết khóa học" rows={4} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng Thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select
                options={[
                  { label: 'Hoạt Động', value: CourseStatus.ACTIVE },
                  { label: 'Không Hoạt Động', value: CourseStatus.INACTIVE },
                  { label: 'Lưu Trữ', value: CourseStatus.ARCHIVED },
                  { label: 'Nháp', value: CourseStatus.DRAFT },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="semesterId"
              label="Học Kỳ"
              rules={[{ required: true, message: 'Vui lòng chọn học kỳ!' }]}
            >
              <InputNumber placeholder="ID học kỳ" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="mentorId"
              label="Mentor"
              rules={[{ required: true, message: 'Vui lòng chọn mentor!' }]}
            >
              <InputNumber placeholder="ID mentor" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="subjectId"
              label="Môn Học"
              rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
            >
              <InputNumber placeholder="ID môn học" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="maxStudents"
              label="Số Sinh Viên Tối Đa"
            >
              <InputNumber placeholder="Số lượng" min={1} />
            </Form.Item>

            <Form.Item
              name="startDate"
              label="Ngày Bắt Đầu"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Ngày Kết Thúc"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                {id ? 'Cập Nhật' : 'Tạo Mới'}
              </Button>
              <Button onClick={() => navigate('/courses')} style={{ marginLeft: 8 }} size="large">
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

export default CoursesFormPage;
