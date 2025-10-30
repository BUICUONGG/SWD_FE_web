# 🎓 HƯỚNG DẪN TỔ CHỨC FEATURES

## 📌 Overview

Dự án đã được tái cấu trúc hoàn toàn theo **Feature-Based Architecture**. Mỗi feature có cấu trúc rõ ràng:

```
feature/
├── pages/           # Trang chính của feature
├── components/      # Component riêng
├── services/        # API service
├── types/           # TypeScript types
├── store/           # State (nếu cần)
├── styles/          # CSS (nếu cần)
└── index.ts         # Export entry point
```

---

## 🎯 Khi Tạo Feature Mới

### 1️⃣ Tạo Folder Structure

```bash
# Tạo cấu trúc cơ bản
src/features/
└── my-feature/
    ├── pages/
    ├── components/
    ├── services/
    ├── types/
    ├── store/
    ├── styles/
    └── index.ts
```

### 2️⃣ Tạo Types

```typescript
// src/features/my-feature/types/index.ts
export interface MyModel {
  id: string;
  name: string;
  // ...
}

export interface MyListResponse {
  items: MyModel[];
  total: number;
}
```

### 3️⃣ Tạo Service

```typescript
// src/features/my-feature/services/myFeatureService.ts
import { get, post } from '@/shared/services/api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { MyModel, MyListResponse } from '../types';

export const myFeatureService = {
  // GET list
  getList: () => 
    get<MyListResponse>('/api/v1/my-feature'),

  // GET detail
  getDetail: (id: string) => 
    get<MyModel>(`/api/v1/my-feature/${id}`),

  // CREATE
  create: (data: Omit<MyModel, 'id'>) => 
    post<MyModel>('/api/v1/my-feature', data),

  // UPDATE
  update: (id: string, data: Partial<MyModel>) => 
    post<MyModel>(`/api/v1/my-feature/${id}`, data),

  // DELETE
  delete: (id: string) => 
    get<void>(`/api/v1/my-feature/${id}`)
};
```

### 4️⃣ Tạo Page

```typescript
// src/features/my-feature/pages/MyListPage.tsx
import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import { myFeatureService } from '../services/myFeatureService';
import type { MyModel } from '../types';

const MyListPage: React.FC = () => {
  const [items, setItems] = useState<MyModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await myFeatureService.getList();
      setItems(response.items);
    } catch (error) {
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? <Spin /> : <div>Items: {items.length}</div>}
    </div>
  );
};

export default MyListPage;
```

### 5️⃣ Tạo Component

```typescript
// src/features/my-feature/components/MyCard.tsx
import React from 'react';
import { Card, Button, Space } from 'antd';
import type { MyModel } from '../types';

interface MyCardProps {
  item: MyModel;
  onEdit?: (item: MyModel) => void;
  onDelete?: (id: string) => void;
}

export const MyCard: React.FC<MyCardProps> = ({ 
  item, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card title={item.name}>
      <p>ID: {item.id}</p>
      <Space>
        <Button onClick={() => onEdit?.(item)}>Edit</Button>
        <Button danger onClick={() => onDelete?.(item.id)}>Delete</Button>
      </Space>
    </Card>
  );
};
```

### 6️⃣ Export Index

```typescript
// src/features/my-feature/index.ts
export { default as MyListPage } from './pages/MyListPage';
export { default as MyDetailPage } from './pages/MyDetailPage';
export { MyCard } from './components/MyCard';
export { myFeatureService } from './services/myFeatureService';
export type * from './types';
```

---

## 📚 Ví Dụ Thực Tế - Feature Courses

### Structure
```
src/features/courses/
├── pages/
│   ├── CourseListPage.tsx
│   ├── CourseDetailPage.tsx
│   └── index.ts
├── components/
│   ├── CourseCard.tsx
│   ├── CourseForm.tsx
│   ├── CourseFilter.tsx
│   └── index.ts
├── services/
│   └── courseService.ts
├── types/
│   └── index.ts
├── store/
│   └── courseStore.ts
└── index.ts
```

### Service Example
```typescript
// src/features/courses/services/courseService.ts
import { get, post, put, delete_ } from '@/shared/services/api';
import type { Course, CreateCourseRequest } from '../types';

export const courseService = {
  // Get all courses
  list: (filters?: { semester?: string; major?: string }) =>
    get<{ courses: Course[]; total: number }>('/api/v1/courses', { 
      params: filters 
    }),

  // Get course detail
  getById: (id: string) =>
    get<Course>(`/api/v1/courses/${id}`),

  // Create course
  create: (data: CreateCourseRequest) =>
    post<Course>('/api/v1/courses', data),

  // Update course
  update: (id: string, data: Partial<CreateCourseRequest>) =>
    put<Course>(`/api/v1/courses/${id}`, data),

  // Delete course
  delete: (id: string) =>
    delete_<void>(`/api/v1/courses/${id}`),

  // Get course by semester
  getBySemester: (semesterId: string) =>
    get<Course[]>(`/api/v1/courses/semester/${semesterId}`),
};
```

---

## 🔄 Khi Sử Dụng Feature

### Trong Component
```typescript
import { courseService } from '@/features/courses';
import { useAuth } from '@/shared/hooks';
import { formatDate } from '@/shared/utils';

const MyComponent = () => {
  const { user } = useAuth();

  const handleLoadCourses = async () => {
    try {
      const response = await courseService.list();
      console.log(response.courses);
    } catch (error) {
      console.error('Failed to load courses');
    }
  };

  return <div>...</div>;
};
```

### Trong Page
```typescript
import { CourseListPage } from '@/features/courses';

// Sử dụng trực tiếp trong routing
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/courses" element={<CourseListPage />} />
    </Routes>
  );
}
```

---

## 🧪 Testing Feature

```typescript
// src/features/courses/__tests__/courseService.test.ts
import { courseService } from '../services/courseService';

describe('courseService', () => {
  test('should fetch course list', async () => {
    const response = await courseService.list();
    expect(response.courses).toBeDefined();
    expect(Array.isArray(response.courses)).toBe(true);
  });

  test('should fetch course by id', async () => {
    const course = await courseService.getById('123');
    expect(course.id).toBe('123');
  });
});
```

---

## 📋 Checklist: Khi Tạo Feature

- [ ] Tạo folder structure (pages, components, services, types)
- [ ] Tạo types/interfaces
- [ ] Tạo service layer
- [ ] Tạo pages
- [ ] Tạo components
- [ ] Tạo store (nếu cần global state)
- [ ] Export từ index.ts
- [ ] Cập nhật routing
- [ ] Test toàn bộ
- [ ] Documentation

---

## 🚀 Best Practices

### ✅ DO

```typescript
// ✅ Import từ shared utilities
import { formatDate, validateEmail } from '@/shared/utils';
import { useAuth, useFetch } from '@/shared/hooks';
import { API_ENDPOINTS } from '@/shared/constants';

// ✅ Sử dụng types đúng cách
import type { Course } from '../types';

// ✅ Tách biệt logic ra service
const data = await courseService.list();

// ✅ Xử lý lỗi đúng cách
try {
  await courseService.create(data);
} catch (error) {
  console.error('Error:', error);
}
```

### ❌ DON'T

```typescript
// ❌ Import từ wrong path
import { formatDate } from '../../shared/utils/formatters';

// ❌ Gọi API trực tiếp từ component
const response = await fetch('/api/v1/courses');

// ❌ Logic phức tạp trong component
const data = items.filter(...).map(...).reduce(...);

// ❌ Magic strings
const url = '/api/v1/courses/list';
```

---

## 📞 Liên Hệ & Support

Nếu có câu hỏi, vui lòng tham khảo:
- `ARCHITECTURE.md` - Chi tiết architecture
- `FEATURES_CHECKLIST.md` - Progress tracker
- `STRUCTURE_GUIDE.md` - Quick reference

---

**Last Updated:** 2025-10-29  
**Version:** 1.0
