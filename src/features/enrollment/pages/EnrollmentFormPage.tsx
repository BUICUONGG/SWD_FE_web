import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, message, Spin, Select, InputNumber } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { enrollmentService } from '../services';
import { EnrollmentStatus } from '../types';
import '../styles/EnrollmentForm.css';

/**
 * Enrollment Form Page
 * Create/Edit đăng ký học viên
 */
export const EnrollmentFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  // Load enrollment if editing
  useEffect(() => {
    if (id) {
      loadEnrollment(parseInt(id));
    }
  }, [id]);

  const loadEnrollment = async (enrollmentId: number) => {
    try {
      setInitialLoading(true);
      const data = await enrollmentService.getById(enrollmentId);
      form.setFieldsValue({
        userId: data.userId,
        courseId: data.courseId,
        status: data.status,
        score: data.score,
        grade: data.grade,
      });
    } catch (error) {
      message.error('Lỗi khi tải thông tin đăng ký');
      navigate('/enrollments');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      if (id) {
        // Edit: chỉ cập nhật score/grade
        // Bạn có thể thêm endpoint riêng cho việc này
        message.info('Tính năng cập nhật đang phát triển');
      } else {
        // Create new enrollment
        await enrollmentService.enroll({
          userId: values.userId,
          courseId: values.courseId,
          status: values.status || EnrollmentStatus.PENDING,
        });
        message.success('Tạo đăng ký thành công');
      }

      navigate('/enrollments');
    } catch (error) {
      message.error(id ? 'Lỗi khi cập nhật đăng ký' : 'Lỗi khi tạo đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enrollment-form-container">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/enrollments')}
        className="enrollment-form-back-btn"
      >
        Quay Lại
      </Button>

      <Spin spinning={initialLoading}>
        <Card className="enrollment-form-card" title={id ? 'Chỉnh Sửa Đăng Ký' : 'Tạo Đăng Ký Mới'}>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="userId"
              label="ID Người Dùng"
              rules={[{ required: true, message: 'Vui lòng nhập ID người dùng!' }]}
            >
              <InputNumber placeholder="ID người dùng" style={{ width: '100%' }} disabled={!!id} />
            </Form.Item>

            <Form.Item
              name="courseId"
              label="ID Lớp Học"
              rules={[{ required: true, message: 'Vui lòng nhập ID lớp học!' }]}
            >
              <InputNumber placeholder="ID lớp học" style={{ width: '100%' }} disabled={!!id} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng Thái"
              initialValue={EnrollmentStatus.PENDING}
            >
              <Select
                options={[
                  { label: 'Chờ Duyệt', value: EnrollmentStatus.PENDING },
                  { label: 'Đã Phê Duyệt', value: EnrollmentStatus.APPROVED },
                  { label: 'Hoàn Thành', value: EnrollmentStatus.COMPLETED },
                  { label: 'Từ Chối', value: EnrollmentStatus.REJECTED },
                  { label: 'Đã Hủy', value: EnrollmentStatus.CANCELLED },
                ]}
                disabled={!!id}
              />
            </Form.Item>

            {id && (
              <>
                <Form.Item
                  name="score"
                  label="Điểm"
                >
                  <InputNumber placeholder="Điểm" style={{ width: '100%' }} min={0} max={100} />
                </Form.Item>

                <Form.Item
                  name="grade"
                  label="Xếp Loại"
                >
                  <Select
                    placeholder="Chọn xếp loại"
                    options={[
                      { label: 'A', value: 'A' },
                      { label: 'B', value: 'B' },
                      { label: 'C', value: 'C' },
                      { label: 'D', value: 'D' },
                      { label: 'F', value: 'F' },
                    ]}
                    allowClear
                  />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                {id ? 'Cập Nhật' : 'Tạo Mới'}
              </Button>
              <Button onClick={() => navigate('/enrollments')} style={{ marginLeft: 8 }} size="large">
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

export default EnrollmentFormPage;
