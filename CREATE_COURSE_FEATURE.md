# Mentor - Tạo Khóa Học Mới

## ✅ Tính năng

Mentor được phép tạo khóa học mới trực tiếp từ MentorDashboard.

## 🎯 Cách sử dụng

### 1. Truy cập tính năng
- Đăng nhập với tài khoản mentor: `mentor@mentor.com / mentor`
- Vào `/mentor/dashboard`
- Kéo xuống phần "🚀 Thao tác nhanh"
- Click nút "➕ Tạo khóa học mới"

### 2. Điền thông tin khóa học
Modal sẽ mở ra với các trường:

| Trường | Kiểu | Bắt buộc | Ví dụ |
|--------|------|---------|-------|
| **Mã khóa học** | Text | ✅ Có | CS445 |
| **Tên khóa học** | Text | ✅ Có | Lập trình React |
| **Sức chứa tối đa** | Number | ✅ Có | 50 |
| **Hạn cuối tạo nhóm** | Date | ✅ Có | 2025-12-31 |
| **Trạng thái** | Select | ✅ Có | Sắp tới / Mở đăng ký / Đang diễn ra |

### 3. Gửi yêu cầu
- Click "OK" để tạo khóa học
- Hệ thống sẽ gọi API: `POST /api/courses`
- Nếu thành công, dashboard sẽ reload
- Khóa học mới sẽ xuất hiện trong danh sách

## 🔧 Cấu trúc Code

### Form Data gửi đi:
```typescript
{
  code: string;           // Mã khóa học (VD: CS445)
  name: string;           // Tên khóa học (VD: Lập trình React)
  maxStudents: number;    // Sức chứa (VD: 50)
  teamFormationDeadline: string; // ISO Date (YYYY-MM-DD)
  status: string;         // UPCOMING | OPEN | IN_PROGRESS
  mentorId: number;       // Lấy từ mentor?.userId
  subjectId: number;      // Mặc định: 1
  semesterId: number;     // Mặc định: 1
}
```

### API Endpoint:
```
POST /api/courses
Content-Type: application/json
Authorization: Bearer {token}

{
  code: "CS445",
  name: "Lập trình React",
  maxStudents: 50,
  teamFormationDeadline: "2025-12-31",
  status: "UPCOMING",
  mentorId: 1,
  subjectId: 1,
  semesterId: 1
}
```

### Response Success:
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "courseId": 1,
    "code": "CS445",
    "name": "Lập trình React",
    ...
  }
}
```

## 📝 Files được cập nhật

### `src/pages/MentorDashboard.tsx`

**Thêm:**
- Import: `Modal, Form, Input, InputNumber, DatePicker, Select, message`
- State: `createModalVisible, createLoading, createForm`
- Function: `handleCreateCourse(values)`
- Modal component
- Click handler trên nút "Tạo khóa học mới"

**Xoá:**
- Không xoá gì

## 🔄 Flow

```
1. Mentor click "➕ Tạo khóa học mới"
   ↓
2. Modal mở ra hiển thị form
   ↓
3. Mentor điền thông tin khóa học
   ↓
4. Click "OK"
   ↓
5. handleCreateCourse() được gọi
   ↓
6. Validate form data
   ↓
7. Gọi courseService.createCourse(courseData)
   ↓
8. API xử lý: POST /api/courses
   ↓
9a. Thành công: message.success() + reload dashboard
   ↓
9b. Thất bại: message.error() hiển thị lỗi
```

## ✨ UX Features

- ✅ Modal có loading indicator khi gửi
- ✅ Validation trên các trường bắt buộc
- ✅ Date picker cho deadline
- ✅ Select dropdown cho trạng thái
- ✅ Auto-reset form sau khi thành công
- ✅ Error handling với pesan cụ thể
- ✅ Dashboard auto-reload để show khóa học mới

## 🚀 Tính năng tiếp theo

- [ ] Edit khóa học
- [ ] Delete khóa học
- [ ] Archieve khóa học
- [ ] Clone khóa học từ năm trước
- [ ] Batch import khóa học từ file
- [ ] Lên lịch publish khóa học

## 📊 Permissions

| Role | Tạo khóa học | Edit | Delete | View |
|------|-------------|------|--------|------|
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **Mentor** | ✅ | ✅ | ✅ | ✅ |
| **Student** | ❌ | ❌ | ❌ | ✅ |

---

**Created:** 2025-10-31  
**Status:** ✅ Ready for Testing
