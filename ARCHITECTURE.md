# 🎯 SWD FE Web - Feature-Based Architecture

## 📋 Tóm Tắt Cấu Trúc Hoàn Chỉnh

Dự án đã được tái cấu trúc theo **Feature-Based Architecture** với 11 features chính dựa trên các Backend Controllers.

### 🗂️ Cấu Trúc Thư Mục

```
src/
├── features/                    # Các tính năng chính
│   ├── auth/                   # 🔐 Đăng nhập, đăng ký
│   ├── courses/                # 📚 Quản lý khóa học
│   ├── enrollment/             # 📝 Đăng ký khóa học
│   ├── subjects/               # 🏷️ Quản lý môn học
│   ├── majors/                 # 🎓 Quản lý ngành học
│   ├── semesters/              # 📅 Quản lý học kỳ
│   ├── mentors/                # 👨‍🏫 Quản lý mentor
│   ├── dashboard/              # 📊 Trang tổng hợp
│   ├── users/                  # 👤 Quản lý người dùng
│   ├── notifications/          # 🔔 Hệ thống thông báo
│   └── home/                   # 🏠 Trang chủ
│
└── shared/                      # Dùng chung
    ├── layouts/                # 📐 Header, Footer, MainLayout
    ├── components/             # 🧩 Global components
    ├── services/               # 🔧 API service, storage
    ├── hooks/                  # 🪝 Custom hooks
    ├── utils/                  # 🛠️ Utility functions
    ├── constants/              # 📋 API endpoints, config
    ├── types/                  # 🔤 TypeScript types
    ├── store/                  # 💾 State management
    └── styles/                 # 🎨 Global styles
```

### 🎯 Cấu Trúc Mỗi Feature

Mỗi feature có cấu trúc chuẩn:

```
feature/
├── pages/           # Trang chính (LoginPage.tsx, CourseListPage.tsx)
├── components/      # Component riêng (LoginForm.tsx, CourseCard.tsx)
├── services/        # API service (authService.ts)
├── types/           # TypeScript types
├── store/           # State management (nếu cần)
├── styles/          # CSS riêng (nếu cần)
└── index.ts         # Export toàn bộ
```

### 📚 Danh Sách Features

| # | Feature | Folder | Controller |
|---|---------|--------|-----------|
| 1 | 🔐 Auth | `features/auth` | AuthenticationController |
| 2 | 📚 Courses | `features/courses` | CourseController |
| 3 | 📝 Enrollment | `features/enrollment` | EnrollmentController |
| 4 | 🏷️ Subjects | `features/subjects` | SubjectController |
| 5 | 🎓 Majors | `features/majors` | MajorController |
| 6 | 📅 Semesters | `features/semesters` | SemesterController |
| 7 | 👨‍🏫 Mentors | `features/mentors` | MentorProfileController |
| 8 | 📊 Dashboard | `features/dashboard` | Dashboard Pages |
| 9 | 👤 Users | `features/users` | UserController |
| 10 | 🔔 Notifications | `features/notifications` | PushNotificationController |
| 11 | 🏠 Home | `features/home` | Landing Page |

### 🔧 Công Cụ & Utilities Được Tạo

#### 🪝 Hooks (`src/shared/hooks/`)
- `useAuth()` - Quản lý authentication state
- `useFetch()` - Gọi API dễ dàng
- `useDebounce()` - Trì hoãn function call
- `useThrottle()` - Throttle function calls

#### 🛠️ Utils (`src/shared/utils/`)

**Formatters (`formatters.ts`)**
- `formatDate()` - Format ngày tháng
- `formatCurrency()` - Format tiền tệ
- `formatNumber()` - Format số
- `formatPercentage()` - Format phần trăm
- `formatFileSize()` - Format kích thước file
- `formatTimeAgo()` - Thời gian "2 hours ago"

**Validators (`validators.ts`)**
- `validateEmail()` - Kiểm tra email
- `validatePassword()` - Kiểm tra mật khẩu mạnh
- `validatePhone()` - Kiểm tra số điện thoại
- `validateURL()` - Kiểm tra URL
- `isEmpty()` - Kiểm tra trống
- `validateForm()` - Validate form tổng thể

**Helpers (`helpers.ts`)**
- `deepCopy()` - Copy sâu object
- `getNestedValue()` - Lấy giá trị nested
- `setNestedValue()` - Set giá trị nested
- `removeDuplicates()` - Xóa trùng array
- `sortByKey()` - Sort array
- `generateId()` - Tạo ID unique
- `sleep()` - Wait/delay
- `retry()` - Retry async function
- `chunkArray()` - Chia array thành chunks
- `flattenArray()` - Flatten nested array

#### 📋 Constants (`src/shared/constants/`)
- `apiEndpoints.ts` - Tất cả API endpoints

#### 🔧 Services (`src/shared/services/`)
- `api.ts` - Base API configuration & utilities
- `storage.ts` - localStorage/sessionStorage wrapper

### 📖 Cách Sử Dụng

#### Sử dụng Hook
```typescript
import { useAuth } from '@/shared/hooks';

const { user, isAuthenticated, login, logout } = useAuth();
```

#### Sử dụng Utils
```typescript
import { validateEmail, formatDate, generateId } from '@/shared/utils';

const isValidEmail = validateEmail('test@example.com');
const formattedDate = formatDate(new Date());
const id = generateId();
```

#### Sử dụng API Endpoints
```typescript
import { API_ENDPOINTS } from '@/shared/constants';

const courseListUrl = API_ENDPOINTS.COURSES.LIST;
const courseDetailUrl = API_ENDPOINTS.COURSES.GET('123');
```

#### Sử dụng Auth Service
```typescript
import { authService } from '@/features/auth';

try {
  const response = await authService.login({
    email: 'user@example.com',
    password: 'password123'
  });
  // Handle response
} catch (error) {
  // Handle error
}
```

### ✅ Lợi Ích Của Cấu Trúc Này

1. ✨ **Mô-đun hóa**: Mỗi feature độc lập, dễ bảo trì
2. 📈 **Scalable**: Dễ thêm/xóa features mới
3. 🔄 **Tái sử dụng**: `shared/` chứa code dùng chung
4. 🗂️ **Tổ chức**: Cấu trúc rõ ràng, dễ tìm file
5. 👥 **Collaboration**: Team làm việc song song trên features khác nhau
6. 🧪 **Testing**: Dễ test từng feature độc lập
7. 🚀 **Performance**: Code splitting theo feature
8. 📚 **Maintainability**: Dễ bảo trì và nâng cấp

### 📝 Quy Ước Đặt Tên

#### Pages
- `*Page.tsx` - Trang chính (LoginPage, CourseListPage)

#### Components
- `*Form.tsx` - Form input (LoginForm, CourseForm)
- `*Card.tsx` - Card component (CourseCard, UserCard)
- `*List.tsx` - Danh sách (CourseList)
- `*Table.tsx` - Bảng dữ liệu (UserTable)
- `*Modal.tsx` - Modal dialog (DeleteModal)

#### Services
- `*Service.ts` - API service (authService, courseService)

#### Hooks
- `use*` - Custom hooks (useAuth, useFetch)

#### Utils
- `*Formatters.ts` - Format dữ liệu
- `*Validators.ts` - Validate dữ liệu
- `*Helpers.ts` - Helper functions

### 🚀 Bước Tiếp Theo

1. ✅ Tái cấu trúc theo feature-based (DONE)
2. ⏳ Tạo pages cho từng feature
3. ⏳ Tạo components cho từng feature
4. ⏳ Implement routing trong App.tsx
5. ⏳ Tạo state management (Zustand/Redux)
6. ⏳ Tích hợp authentication
7. ⏳ Testing từng feature

---

**Created:** 2025-10-29  
**Version:** 1.0  
**Architecture:** Feature-Based
