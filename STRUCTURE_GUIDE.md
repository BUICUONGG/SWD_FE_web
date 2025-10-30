# 📁 SWD FE Web - Feature-Based Architecture (NEW STRUCTURE)

## ✨ Cấu Trúc Mới Sau Khi Tái Cấu Trúc

### 🎯 Quy Tắc Tổ Chức

Mỗi feature có cấu trúc như sau:
```
feature/
├── pages/          # Các trang chính của feature
├── components/     # Component riêng của feature
├── services/       # API service riêng của feature
├── types/          # TypeScript types/interfaces
├── store/          # State management (nếu cần)
└── styles/         # CSS riêng (nếu cần)
```

### 📚 Danh Sách Features & Controllers

| # | Feature | Controller | Mô Tả |
|---|---------|-----------|--------|
| 1 | **auth** | AuthenticationController | Đăng nhập, đăng ký, OAuth |
| 2 | **courses** | CourseController | Quản lý khóa học |
| 3 | **enrollment** | EnrollmentController | Đăng ký khóa học |
| 4 | **subjects** | SubjectController | Quản lý môn học |
| 5 | **majors** | MajorController | Quản lý ngành học |
| 6 | **semesters** | SemesterController | Quản lý học kỳ |
| 7 | **mentors** | MentorProfileController | Quản lý mentor/giảng viên |
| 8 | **dashboard** | - | Trang tổng hợp (Admin/Student) |
| 9 | **users** | UserController | Quản lý người dùng |
| 10 | **notifications** | PushNotificationController | Hệ thống thông báo |
| 11 | **home** | - | Trang chủ (Landing page) |

### 📋 Quy Ước Đặt Tên

#### Pages
- `LoginPage.tsx` - Trang chính
- `CourseListPage.tsx` - Danh sách
- `CourseDetailPage.tsx` - Chi tiết

#### Components
- `*Form.tsx` - Form (LoginForm, CourseForm)
- `*Card.tsx` - Card (CourseCard, UserCard)
- `*List.tsx` - Danh sách (CourseList)
- `*Table.tsx` - Bảng (UserTable)
- `*Modal.tsx` - Modal (DeleteModal, CreateModal)

#### Services
- `authService.ts` - API service
- `courseService.ts` - API service

#### Types
- `index.ts` - Export tất cả types

### ✅ Lợi Ích

1. ✨ **Mô-đun**: Mỗi feature độc lập
2. 📈 **Scalable**: Dễ thêm/xóa features
3. 🔄 **Tái sử dụng**: shared/ cho code dùng chung
4. 🗂️ **Tổ chức**: Cấu trúc rõ ràng
5. 👥 **Collaboration**: Team làm việc song song
6. 🧪 **Testing**: Dễ test từng feature

---

**Đã tạo:** 2025-10-29
**Tác giả:** AI Assistant
