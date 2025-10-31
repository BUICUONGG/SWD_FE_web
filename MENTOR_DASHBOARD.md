# Mentor Dashboard - Hướng dẫn sử dụng

## 📋 Tổng quan

Trang Mentor Dashboard cung cấp một giao diện quản lý toàn diện cho các giảng viên để quản lý khóa học, theo dõi sinh viên và xử lý đơn đăng ký.

## 🎯 Tính năng chính

### 1. **Bảng điều khiển Mentor (MentorDashboard)**
- **Đường dẫn:** `/mentor/dashboard`
- **Bảo vệ:** Yêu cầu MENTOR scope trong JWT token

#### Nội dung:
- **Thống kê tổng quát:**
  - Tổng số khóa học quản lý
  - Tổng số sinh viên
  - Số lượng sinh viên đã phê duyệt
  - Số lượng chờ phê duyệt

- **Danh sách khóa học:**
  - Liệt kê tất cả khóa học mà giảng viên quản lý
  - Mã khóa học, tên, trạng thái
  - Số lượng sinh viên (hiện tại/tối đa)
  - Tỉ lệ hoàn thành
  - Nút "Chi tiết" để xem thêm thông tin

- **Đơn đăng ký chờ phê duyệt:**
  - Hiển thị danh sách sinh viên xin tham gia khóa học
  - Nút phê duyệt/từ chối
  - Thông tin về GPA sinh viên

- **Hoạt động gần đây:**
  - Timeline các sự kiện mới nhất
  - Bao gồm: đăng ký mới, phê duyệt, tiến độ lớp

- **Thống kê chi tiết:**
  - Tỉ lệ phê duyệt (%)
  - Tỉ lệ sinh viên hoàn thành (%)

### 2. **Quản lý khóa học chi tiết (MentorCourseManagement)**
- **Đường dẫn:** `/mentor/course/:courseId`
- **Bảo vệ:** Yêu cầu MENTOR scope

#### Nội dung:
- **Thông tin khóa học:**
  - Mô tả chi tiết
  - Mục tiêu học tập
  - Yêu cầu tiên quyết
  - Lịch học, ngày bắt đầu/kết thúc
  - Tài liệu học tập

- **Quản lý sinh viên:**
  - Bảng danh sách sinh viên tham gia
  - Tiến độ của từng sinh viên
  - Số bài nộp/bài tập
  - GPA của từng sinh viên
  - Thao tác: Xem chi tiết, xóa

- **Xử lý đơn đăng ký:**
  - Bảng đơn chờ phê duyệt
  - Thông tin sinh viên (tên, email, GPA)
  - Nút phê duyệt/từ chối
  - Trạng thái của từng đơn

- **Chỉnh sửa khóa học:**
  - Drawer form cho phép cập nhật thông tin
  - Các trường: tên, mô tả, sức chứa, trạng thái

## 🔐 Bảo mật

### JWT Token Requirements
```typescript
{
  iss: string;
  sub: string;        // email
  exp: number;
  iat: number;
  scope: 'MENTOR';    // Must be MENTOR for access
}
```

### Protected Routes
- `MentorProtectedRoute` component kiểm tra:
  - Token hợp lệ
  - Scope là 'MENTOR'
  - Nếu không, redirect về `/login`

## 📡 API Integration

### Services được sử dụng:
- **userService:** Lấy thông tin mentor hiện tại
- **courseService:** Lấy danh sách khóa học
  - `getAllCourses()` - Danh sách khóa học quản lý
  - `getCourseById(id)` - Chi tiết khóa học

### Mock Data
Hiện tại sử dụng mock data cho:
- Danh sách sinh viên
- Đơn đăng ký chờ phê duyệt
- Hoạt động gần đây

Khi backend sẵn sàng, cần thêm endpoints:
- `GET /api/enrollments/course/{courseId}` - Lấy danh sách sinh viên
- `GET /api/enrollments/pending/course/{courseId}` - Lấy đơn chờ phê duyệt
- `POST /api/enrollments/{enrollmentId}/approve` - Phê duyệt đơn
- `POST /api/enrollments/{enrollmentId}/reject` - Từ chối đơn

## 🎨 Component Structure

```
MentorDashboard
├── Header (Statistics Cards)
├── Left Column
│   ├── Courses List
│   ├── Enrollment Requests
│   └── Students Table
└── Right Column
    ├── Recent Activities
    ├── Statistics
    └── Quick Actions

MentorCourseManagement
├── Header (Back button, Actions)
├── Statistics Cards
├── Left Column
│   ├── Course Details (Tabs)
│   ├── Enrollment Requests
│   └── Students List
├── Right Column
│   ├── Quick Info
│   └── Quick Actions
└── Edit Drawer
```

## 🚀 Sử dụng

### Truy cập Dashboard
1. Đăng nhập với tài khoản mentor
2. Hệ thống tự động redirect đến `/mentor/dashboard`
3. Hoặc click vào "Quản lý khóa học" trong dropdown menu

### Xem chi tiết khóa học
1. Trên dashboard, click nút "Chi tiết" của khóa học
2. Hoặc truy cập trực tiếp: `/mentor/course/{courseId}`
3. Xem thông tin, sinh viên, đơn đăng ký

### Chỉnh sửa khóa học
1. Click nút "Chỉnh sửa" trên trang chi tiết
2. Cập nhật thông tin trong drawer
3. Click "Lưu" để lưu thay đổi

### Phê duyệt đơn đăng ký
1. Xem danh sách "Đơn đăng ký chờ phê duyệt"
2. Click "Phê duyệt" hoặc "Từ chối"
3. Trạng thái cập nhật tự động

## 📊 Dữ liệu mẫu

Trang hiện tại sử dụng dữ liệu mẫu cho mục đích demo:

```typescript
// Mock Enrollment Requests
{
  studentName: "Nguyễn Văn A",
  studentEmail: "nguyenvana@student.edu.vn",
  requestDate: "2025-10-28",
  status: "PENDING",
  gpa: 3.5
}

// Mock Students
{
  studentName: "Lê Minh C",
  studentId: "SV001",
  email: "leminhhc@student.edu.vn",
  joinedDate: "2025-10-26",
  progress: 75,
  submission: 8,
  assignment: 10,
  gpa: 3.2
}
```

## 🔧 Cải tiến trong tương lai

- [ ] Thêm phân trang cho danh sách sinh viên
- [ ] Export danh sách sinh viên sang Excel
- [ ] Tạo nhóm sinh viên theo tự động
- [ ] Gửi email thông báo phê duyệt/từ chối
- [ ] Xem điểm chi tiết của sinh viên
- [ ] Tạo bài kiểm tra/bài tập mới
- [ ] Chấm điểm trực tuyến
- [ ] Xem báo cáo chi tiết

## 📝 Ghi chú phát triển

### Files được tạo/sửa:
1. **pages/MentorDashboard.tsx** - Dashboard chính (435 lines)
2. **pages/MentorCourseManagement.tsx** - Quản lý khóa học (626 lines)
3. **pages/index.ts** - Export components
4. **router/index.tsx** - Thêm mentor routes
5. **components/ProtectedRoute.tsx** - Thêm MentorProtectedRoute
6. **layouts/Header.tsx** - Thêm mentor navigation
7. **hooks/useAuth.ts** - Hỗ trợ mentor role
8. **utils/jwt.ts** - Thêm isMentor check

### Types/Interfaces:
- `Course` - Khóa học (có extension)
- `CourseStatus` - Trạng thái khóa học
- `User` - Thông tin giảng viên

### Routes:
- `/mentor/dashboard` - Dashboard
- `/mentor/profile` - Profile
- `/mentor/course/:courseId` - Chi tiết khóa học
- `/mentor/course/:courseId/students` - Danh sách sinh viên

## ✅ Checklist triển khai

- [x] Tạo MentorDashboard component
- [x] Tạo MentorCourseManagement component
- [x] Thêm routes mentor
- [x] Tạo MentorProtectedRoute
- [x] Cập nhật Header cho mentor
- [x] Thêm mentor role vào JWT
- [x] Cập nhật useAuth hook
- [ ] Triển khai API endpoints thực tế
- [ ] Thêm email notification
- [ ] Thêm export/import sinh viên
- [ ] Thêm analytics dashboard

---

**Tác giả:** AI Assistant  
**Ngày tạo:** 2025-10-31  
**Phiên bản:** 1.0  
**Trạng thái:** Phát triển
