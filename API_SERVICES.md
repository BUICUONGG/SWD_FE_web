# API Services Documentation

Hướng dẫn sử dụng các API services đã được restructure hoàn toàn cho dự án SWD_FE_web.

## 📁 Cấu trúc thư mục

```
src/
├── shared/
│   ├── services/
│   │   └── apiClient.ts          # API client trung tâm
│   └── types/
│       └── api.ts                # Type definitions cho tất cả API
├── features/
│   ├── users/services/
│   │   └── userService.ts        # User API service
│   ├── mentors/services/
│   │   └── mentorService.ts      # Mentor API service
│   ├── semesters/services/
│   │   └── semesterService.ts    # Semester API service
│   ├── subjects/services/
│   │   └── subjectService.ts     # Subject API service
│   └── notifications/services/
│       └── notificationService.ts # Notification API service
└── services/
    └── index.ts                  # Export tất cả services
```

## 🚀 Cách sử dụng

### 1. Import API Services

```typescript
// Import individual services
import { userService } from '@/features/users/services/userService';
import { mentorService } from '@/features/mentors/services/mentorService';

// Or import from centralized index
import { 
  userService, 
  mentorService, 
  semesterService, 
  subjectService, 
  notificationService 
} from '@/services';
```

### 2. User Service

```typescript
// Get current user
const currentUser = await userService.getCurrentUser();

// Get user by ID
const user = await userService.getById('user-id');

// Search users
const searchResults = await userService.search({
  keyword: 'john',
  role: 'STUDENT',
  status: 'ACTIVE',
  page: 1,
  size: 10
});

// Create new user
const newUser = await userService.create({
  email: 'user@example.com',
  fullName: 'John Doe',
  password: 'password123',
  role: 'STUDENT'
});

// Update user
const updatedUser = await userService.update('user-id', {
  fullName: 'John Smith',
  status: 'INACTIVE'
});

// Import users from Excel
const importResult = await userService.import(file);

// Export users to Excel
await userService.export({ role: 'STUDENT', format: 'xlsx' });
```

### 3. Mentor Service

```typescript
// Get mentor profile
const mentor = await mentorService.getById('mentor-id');

// Search mentors by department
const mentors = await mentorService.search({
  department: 'Computer Science',
  specialization: 'AI',
  status: 'ACTIVE'
});

// Create mentor profile
const newMentor = await mentorService.create({
  userId: 'user-id',
  department: 'Computer Science',
  specialization: 'Machine Learning',
  skills: ['Python', 'TensorFlow'],
  experience: 5
});

// Update mentor skills
await mentorService.updateSkills('mentor-id', ['React', 'Node.js']);

// Get available mentors
const availableMentors = await mentorService.getAvailable({
  department: 'Software Engineering'
});
```

### 4. Semester Service

```typescript
// Get current semester
const currentSemester = await semesterService.getCurrent();

// Get upcoming semester
const upcomingSemester = await semesterService.getUpcoming();

// Create new semester
const newSemester = await semesterService.create({
  code: 'SP2024',
  name: 'Spring 2024',
  startDate: '2024-01-15',
  endDate: '2024-05-15'
});

// Get semesters by academic year
const semesters = await semesterService.getByAcademicYear('2024');

// Set current semester
await semesterService.setCurrent('semester-id');
```

### 5. Subject Service

```typescript
// Get subject by code
const subject = await subjectService.getByCode('CS101');

// Search subjects
const subjects = await subjectService.search({
  department: 'Computer Science',
  credits: 3,
  status: 'ACTIVE'
});

// Create new subject
const newSubject = await subjectService.create({
  code: 'CS201',
  name: 'Data Structures',
  credits: 3,
  department: 'Computer Science',
  prerequisites: ['CS101']
});

// Update prerequisites
await subjectService.updatePrerequisites('subject-id', ['CS101', 'MATH101']);

// Import subjects from Excel
const importResult = await subjectService.import(file);
```

### 6. Notification Service

```typescript
// Get my notifications
const myNotifications = await notificationService.getMyNotifications({
  page: 1,
  size: 20,
  read: false
});

// Get unread count
const unreadCount = await notificationService.getUnreadCount();

// Send notification to specific users
await notificationService.send({
  title: 'Assignment Due',
  message: 'Your assignment is due tomorrow',
  type: 'WARNING',
  recipients: ['user-id-1', 'user-id-2']
});

// Send notification to all users
await notificationService.sendToAll({
  title: 'System Maintenance',
  message: 'System will be down for maintenance',
  type: 'INFO'
});

// Send notification by role
await notificationService.sendByRole({
  title: 'New Course Available',
  message: 'Check out the new courses',
  type: 'SUCCESS',
  roles: ['STUDENT']
});

// Mark as read
await notificationService.markAsRead('notification-id');

// Mark all as read
await notificationService.markAllAsRead();
```

## 🔧 API Client Features

### Authentication
- Tự động thêm JWT token vào header
- Tự động xử lý lỗi 401/403
- Redirect đến login khi token hết hạn

### Error Handling
- Centralized error handling
- Hiển thị message lỗi tự động (Ant Design)
- Type-safe error responses

### File Operations
```typescript
// Upload file
const result = await uploadFile('/api/upload', file, 'avatar');

// Download file
await downloadFile('/api/export', 'data.xlsx', { format: 'xlsx' });
```

### Configuration
```typescript
// API endpoints are centralized in API_CONFIG
const { USERS, MENTORS, SEMESTERS } = API_CONFIG.ENDPOINTS;
```

## 📋 Response Types

Tất cả API responses đều follow chuẩn format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
  path?: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
```

## 🔒 Type Safety

Tất cả services đều có TypeScript types đầy đủ:

```typescript
// Request types
CreateUserRequest, UpdateUserRequest, UserSearchParams
CreateMentorProfileRequest, UpdateMentorProfileRequest
CreateSemesterRequest, UpdateSemesterRequest
CreateSubjectRequest, UpdateSubjectRequest
CreateNotificationRequest, UpdateNotificationRequest

// Entity types
User, MentorProfile, Semester, Subject, Notification

// Response types
ApiResponse<T>, PaginatedResponse<T>
```

## 🎯 Best Practices

1. **Always handle errors**: Sử dụng try-catch khi call API
2. **Type safety**: Import và sử dụng proper types
3. **Pagination**: Sử dụng pagination cho large datasets
4. **Loading states**: Hiển thị loading khi call API
5. **Error messages**: Hiển thị user-friendly error messages

```typescript
// Example with proper error handling
const handleGetUsers = async () => {
  try {
    setLoading(true);
    const response = await userService.getAll({ page: 1, size: 10 });
    setUsers(response.data.content);
  } catch (error) {
    message.error('Không thể tải danh sách người dùng');
  } finally {
    setLoading(false);
  }
};
```

## 🔄 Migration từ API cũ

1. Replace old API calls với new services
2. Update import statements
3. Update type definitions
4. Test thoroughly

Các API services mới này đã được thiết kế để:
- ✅ Type-safe hoàn toàn
- ✅ Centralized configuration
- ✅ Consistent error handling
- ✅ File upload/download support
- ✅ Authentication handling
- ✅ Pagination support
- ✅ Search và filter capabilities
- ✅ Bulk operations
- ✅ Statistics và reporting