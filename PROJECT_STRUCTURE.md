# SWD FE Web Project Structure Guide

## 📁 Cấu trúc thư mục

```
src/
├── assets/        # Ảnh, icon, css global
├── components/    # Component dùng chung (Button, Card, Modal...)
├── hooks/         # Custom hooks (useAuth, useDebounce...)
├── pages/         # Các trang chính (Home, Login, Dashboard...)
├── services/      # API call, axios instance, logic gọi backend
├── stores/        # State management (Redux, Zustand, Recoil...)
├── types/         # Định nghĩa TypeScript types, interface
├── utils/         # Hàm helper (formatDate, validateEmail...)
├── App.tsx        # Root component
├── main.tsx       # Entry point (render app)
├── App.css        # Style cho App
└── index.css      # Style global
```

## 🚀 Cách sử dụng từng thư mục

### 📂 `components/`
Chứa các component tái sử dụng như Button, Card, Modal...
```typescript
// Ví dụ sử dụng
import { Button, Card } from '../components';

<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
```

### 📂 `hooks/`
Chứa các custom hook cho logic tái sử dụng
```typescript
// Ví dụ sử dụng
import { useAuth, useDebounce } from '../hooks';

const { isAuthenticated, user, login, logout } = useAuth();
const debouncedValue = useDebounce(searchTerm, 300);
```

### 📂 `pages/`
Chứa các trang chính của ứng dụng
```typescript
// pages/Home.tsx
import React from 'react';

const HomePage: React.FC = () => {
  return <div>Home Page</div>;
};

export default HomePage;
```

### 📂 `services/`
Chứa logic API call và axios configuration
```typescript
// Sử dụng API service
import { authService, userService } from '../services';

const user = await authService.login(email, password);
const users = await userService.getUsers();
```

### 📂 `stores/`
State management sử dụng Zustand (có thể thay thế bằng Redux, Context API...)
```typescript
// Sử dụng store
import { useAuthStore, useAppStore } from '../stores';

const { user, login, logout } = useAuthStore();
const { theme, setTheme } = useAppStore();
```

### 📂 `types/`
Định nghĩa TypeScript interfaces và types
```typescript
// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
}
```

### 📂 `utils/`
Các hàm helper và utilities
```typescript
// Sử dụng utilities
import { formatDate, validateEmail, debounce } from '../utils';

const formattedDate = formatDate(new Date());
const isValid = validateEmail('test@example.com');
```

## ⚙️ Cấu hình

### Port Configuration
Project được cấu hình chạy trên port **3000**:
- Xem file `vite.config.ts` để thay đổi cấu hình
- Server sẽ tự động mở tại `http://localhost:3000`

### Environment Variables
File `.env` chứa các biến môi trường:
```env
VITE_API_URL=http://localhost:8080/api
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=SWD FE Web
VITE_APP_VERSION=1.0.0
```

## 🎯 Các lệnh chính

```bash
# Cài đặt dependencies
npm install

# Chạy development server (port 3000)
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📝 Hướng dẫn phát triển

### 1. Tạo Component mới
```typescript
// src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {
  return (
    <div onClick={onClick}>
      <h3>{title}</h3>
    </div>
  );
};
```

### 2. Tạo Page mới
```typescript
// src/pages/NewPage.tsx
import React from 'react';
import { Button, Card } from '../components';

const NewPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>New Page</h1>
      {/* Page content */}
    </div>
  );
};

export default NewPage;
```

### 3. Tạo Custom Hook
```typescript
// src/hooks/useCustomHook.ts
import { useState, useEffect } from 'react';

export const useCustomHook = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  
  // Custom logic here
  
  return { value, setValue };
};
```

### 4. Thêm API Service
```typescript
// src/services/newService.ts
import api from './api';
import type { ApiResponse } from '../types';

export const newService = {
  getData: async (): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>('/data');
    return response.data.data;
  },
};
```

## 🎨 Styling

Project sử dụng CSS thuần với các utility classes tương tự Tailwind CSS. Các file CSS chính:
- `src/index.css`: Global styles và utility classes
- `src/App.css`: Component-specific styles

## 📋 Best Practices

1. **Tách biệt logic và UI**: Sử dụng custom hooks cho logic phức tạp
2. **Type Safety**: Luôn định nghĩa types/interfaces rõ ràng
3. **Component Reusability**: Tạo components có thể tái sử dụng
4. **Error Handling**: Xử lý lỗi ở service layer
5. **Code Organization**: Giữ code clean và có tổ chức tốt

## 🔧 Mở rộng

Để mở rộng project:
1. Thêm routing với React Router
2. Cài đặt UI library (Ant Design, Material-UI...)
3. Thêm testing với Jest, React Testing Library
4. Setup CI/CD pipeline
5. Thêm internationalization (i18n)