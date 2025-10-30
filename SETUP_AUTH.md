# 📦 Setup Auth Feature - Hướng Dẫn Cài Đặt

## 1️⃣ Cài đặt Dependencies

```bash
npm install react-router-dom zustand

# Hoặc nếu dùng yarn
yarn add react-router-dom zustand
```

## 2️⃣ Dependencies Cần Thiết

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^6.x.x",    // ← Thêm
    "zustand": "^4.x.x",              // ← Thêm
    "antd": "^5.27.4",
    "@ant-design/icons": "^6.0.2"
  }
}
```

## 3️⃣ Thành Phần Sẽ Tạo

✅ **Auth Store** (`src/shared/store/authStore.ts`)
- Quản lý user, token, authentication state
- Actions: login, logout, register, setUser

✅ **Auth Guard** (`src/shared/components/ProtectedRoute.tsx`)
- Kiểm tra authentication trước khi render page
- Redirect không đăng nhập đến /login

✅ **Auth Endpoints** (Đã có trong `API_ENDPOINTS`)

✅ **Auth Service** (Đã có trong `authService.ts`)

✅ **Login Page** (Hoàn thành components)
- LoginForm
- Gọi authService
- Lưu token, user info

✅ **Register Page** (Hoàn thành components)
- RegisterForm
- Validation
- Success message

✅ **Routing** (`src/App.tsx`)
- Setup React Router
- Protected Routes
- Auth flow complete

## 4️⃣ Flow Hoàn Chỉnh

```
User Visit /
    ↓
Check localStorage (token)
    ↓
Set to Auth Store
    ↓
Render App with routes
    ↓
Try to access /dashboard
    ↓
Check ProtectedRoute (isAuthenticated)
    ↓
Yes → Render Dashboard
No → Redirect to /login
    ↓
User Login
    ↓
Call authService.login()
    ↓
Get token + user info
    ↓
Save to localStorage + Auth Store
    ↓
Redirect to /dashboard
```

## ⏭️ Next Steps

1. Cài đặt dependencies
2. Tạo Auth Store
3. Tạo ProtectedRoute component
4. Hoàn thành Login/Register Pages
5. Update App.tsx với Router
6. Test flow

---

**Đã Chuẩn Bị:** Tôi sẽ tạo tất cả files này cho bạn!
