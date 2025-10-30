# 🚀 Frontend-Backend Integration Testing Guide

## 📋 Mục tiêu
Test tất cả API services đã tạo với backend thực để đảm bảo integration hoạt động đúng.

## 🛠️ Setup Backend

### 1. Chuẩn bị Backend
```bash
# Clone backend repository (if needed)
git clone <backend-repo-url>
cd <backend-project>

# Install dependencies
mvn clean install
# hoặc
./gradlew build

# Run backend server
mvn spring-boot:run
# hoặc
./gradlew bootRun
```

Backend sẽ chạy trên: `http://localhost:8080`

### 2. Kiểm tra Backend Health
```bash
# Test backend health endpoint
curl http://localhost:8080/actuator/health

# Hoặc truy cập browser:
# http://localhost:8080/swagger-ui.html (nếu có Swagger)
```

## 🎯 Frontend Testing Setup

### 1. Cấu hình Environment
File `.env.development` đã được tạo với:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 2. Truy cập Test Dashboard
```bash
# Frontend đang chạy trên:
http://localhost:3001

# Truy cập API Test Dashboard:
http://localhost:3001/api-test
```

## 🧪 Các bước Test

### Bước 1: Đăng nhập
1. Truy cập: `http://localhost:3001/login`
2. Sử dụng đăng nhập nhanh:
   - **Admin**: admin@admin.com / admin
   - **Student**: student@student.com / student
3. Đăng nhập thành công sẽ có JWT token

### Bước 2: Test API Dashboard  
1. Truy cập: `http://localhost:3001/api-test`
2. Click **"🚀 Test All APIs"** để test basic endpoints
3. Hoặc test từng service riêng lẻ

### Bước 3: Xem kết quả
- ✅ **Green tags**: API call thành công
- ❌ **Red tags**: API call thất bại
- **Click vào tags**: Xem chi tiết response/error
- **Check Console**: Xem full request/response logs

## 📊 Test Cases Coverage

### 🔐 Authentication Service
- [x] Login (admin@admin.com / admin)
- [x] Login (student@student.com / student)  
- [x] Token refresh
- [x] Logout
- [x] Token introspection

### 👥 User Service  
- [x] GET /api/v1/users/current - Get current user
- [x] GET /api/v1/users?page=1&size=10 - Get all users  
- [x] GET /api/v1/users/search - Search users
- [x] GET /api/v1/users/stats - Get user statistics
- [ ] POST /api/v1/users - Create user
- [ ] PUT /api/v1/users/{id} - Update user
- [ ] DELETE /api/v1/users/{id} - Delete user

### 👨‍🏫 Mentor Service
- [x] GET /api/v1/mentor-profiles - Get all mentors
- [x] GET /api/v1/mentor-profiles/search - Search mentors  
- [x] GET /api/v1/mentor-profiles/available - Get available mentors
- [x] GET /api/v1/mentor-profiles/stats - Get mentor statistics
- [ ] POST /api/v1/mentor-profiles - Create mentor profile
- [ ] PUT /api/v1/mentor-profiles/{id} - Update mentor profile

### 📅 Semester Service
- [x] GET /api/v1/semesters/current - Get current semester
- [x] GET /api/v1/semesters/upcoming - Get upcoming semester
- [x] GET /api/v1/semesters - Get all semesters
- [x] GET /api/v1/semesters/stats - Get semester statistics
- [ ] POST /api/v1/semesters - Create semester
- [ ] PUT /api/v1/semesters/{id} - Update semester

### 📚 Subject Service  
- [x] GET /api/v1/subjects - Get all subjects
- [x] GET /api/v1/subjects/search - Search subjects
- [x] GET /api/v1/subjects/departments - Get departments
- [x] GET /api/v1/subjects/stats - Get subject statistics
- [ ] POST /api/v1/subjects - Create subject
- [ ] PUT /api/v1/subjects/{id} - Update subject

### 🔔 Notification Service
- [x] GET /api/v1/notifications/my - Get my notifications
- [x] GET /api/v1/notifications/unread-count - Get unread count
- [x] GET /api/v1/notifications - Get all notifications
- [x] GET /api/v1/notifications/stats - Get notification statistics
- [ ] POST /api/v1/notifications/send - Send notification
- [ ] PATCH /api/v1/notifications/read/{id} - Mark as read

## 🐛 Troubleshooting

### Lỗi CORS (Cross-Origin)
```bash
# Backend cần cấu hình CORS cho http://localhost:3001
# Thêm vào application.yml hoặc application.properties:

# application.yml
spring:
  web:
    cors:
      allowed-origins: 
        - http://localhost:3000
        - http://localhost:3001
      allowed-methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
      allowed-headers: "*"
      allow-credentials: true
```

### Lỗi 401 Unauthorized
- Đảm bảo đã đăng nhập và có JWT token
- Check localStorage có `accessToken` không
- Token có thể đã expired, thử đăng nhập lại

### Lỗi 404 Not Found
- Kiểm tra backend có endpoint đó không
- Check API endpoint paths trong `apiClient.ts`
- Xem Swagger UI nếu có: `http://localhost:8080/swagger-ui.html`

### Lỗi Connection Refused
- Đảm bảo backend đang chạy trên port 8080
- Test: `curl http://localhost:8080/actuator/health`

## 📝 Test Reports

### Sample Success Response:
```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "content": [...],
    "totalElements": 50,
    "totalPages": 5,
    "size": 10,
    "number": 0
  }
}
```

### Sample Error Response:
```json
{
  "success": false,
  "message": "Unauthorized access",
  "timestamp": "2025-10-30T10:30:00Z",
  "path": "/api/v1/users"
}
```

## 🔄 Continuous Testing

### Automated Testing Script
Có thể tạo script để test liên tục:

```javascript
// Run in browser console
const testAPIs = async () => {
  const tests = [
    () => userService.getCurrentUser(),
    () => userService.getAll({ page: 1, size: 5 }),
    () => mentorService.getAll({ page: 1, size: 5 }),
    // ... more tests
  ];
  
  for (const test of tests) {
    try {
      const result = await test();
      console.log('✅ Test passed:', result);
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }
};

testAPIs();
```

## 📈 Performance Monitoring

- Monitor request/response times trong Network tab
- Check memory usage trong Performance tab  
- Log API response times trong Console

## ✅ Success Criteria

- [ ] Tất cả basic read APIs (GET) hoạt động
- [ ] Authentication flow hoạt động đúng
- [ ] Error handling hiển thị proper messages
- [ ] CORS configuration đúng
- [ ] JWT token management hoạt động
- [ ] Pagination responses đúng format
- [ ] Search/filter parameters hoạt động

## 🎉 Next Steps

Sau khi basic testing thành công:
1. Test CRUD operations (POST, PUT, DELETE)
2. Test file upload/download
3. Test real-time notifications
4. Load testing với nhiều concurrent requests
5. Integration với actual UI components