# 🔧 Phân tích lỗi và Đề xuất giải pháp

## 📋 Tổng quan vấn đề

### **Lỗi chính: Access Denied (HTTP 500)**
- **Endpoint:** `GET /api/enrollments/user/{userId}`
- **Error Message:** "Access Denied"
- **Nguyên nhân:** Backend không cho phép Student role truy cập endpoint này

---

## 🔍 Phân tích chi tiết

### 1. **Vấn đề Authorization**

**Hiện tượng:**
```
Failed to load resource: the server responded with a status of 500 ()
:8080/api/enrollments/user/2:1
Error: Access Denied at fetchDashboardData (StudentDashboard.tsx:167:19)
```

**Nguyên nhân có thể:**
- Backend endpoint `/api/enrollments/user/{userId}` chỉ cho phép ADMIN hoặc MENTOR truy cập
- Security config chặn STUDENT role
- Backend yêu cầu userId trong token phải khớp với userId trong URL path

### 2. **Inconsistent API Versioning**
- Auth endpoints: `/api/v1/auth/...` (có version)
- Các endpoints khác: `/api/enrollments/...`, `/api/courses/...` (không có version)
- **Ảnh hưởng:** Khó maintain khi upgrade API

### 3. **Thiếu Token Refresh Mechanism**
- Không có logic tự động refresh token khi hết hạn
- User có thể bị logout đột ngột khi token expire giữa chừng

---

## ✅ Các giải pháp đã thực hiện

### 1. **Cải thiện StudentDashboard Error Handling**

**Thay đổi:**
- ✅ Thêm logging chi tiết để debug
- ✅ Fallback sang demo data khi gặp "Access Denied"
- ✅ Hiển thị warning banner khi dùng demo data
- ✅ Giữ UX mượt mà thay vì hiển thị lỗi đỏ

**Code:**
```typescript
// Khi gặp Access Denied
if (enrollmentsResponse.message.toLowerCase().includes('access denied')) {
  console.log('⚠️ Access Denied - Using demo data');
  setEnrollments(DEMO_ENROLLMENTS);
  setEnrolledCourses(DEMO_COURSES);
  setUsingDemoData(true);
  return;
}
```

### 2. **Tạo API Interceptor với Token Refresh**

**File:** `src/utils/apiInterceptor.ts`

**Tính năng:**
- Tự động check token expiry trước khi gọi API
- Tự động refresh token khi gần hết hạn (< 5 phút)
- Retry request với token mới sau khi refresh
- Auto redirect to login nếu refresh thất bại

**Sử dụng:**
```typescript
import { apiCallWithRefresh } from '../utils/apiInterceptor';

// Thay vì fetch trực tiếp
const response = await apiCallWithRefresh<UserResponse>(
  getApiUrl('/api/users/me')
);
```

### 3. **Tạo Centralized Error Handler**

**File:** `src/utils/errorHandler.ts`

**Tính năng:**
- Handle errors nhất quán trong toàn app
- Hiển thị user-friendly messages
- Tự động redirect khi gặp auth errors (401, 403)
- Support nhiều loại errors: API, Network, Unknown

**Sử dụng:**
```typescript
import { handleApiError } from '../utils/errorHandler';

try {
  // API call
} catch (error) {
  handleApiError(error, 'ComponentName');
}
```

---

## 💡 Đề xuất cho Backend

### **GIẢI PHÁP 1: Thêm endpoint mới cho Student (RECOMMENDED)**

**Endpoint mới:**
```java
@GetMapping("/api/enrollments/my-enrollments")
@PreAuthorize("hasRole('STUDENT')")
public ResponseEntity<ApiResponse<List<EnrollmentResponse>>> getMyEnrollments(
    @AuthenticationPrincipal UserDetails userDetails
) {
    // Get userId from authenticated user
    String email = userDetails.getUsername();
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    
    // Return enrollments của user đó
    List<Enrollment> enrollments = enrollmentRepository.findByUserId(user.getUserId());
    return ResponseEntity.ok(/* map to response */);
}
```

**Ưu điểm:**
- ✅ Student chỉ được xem enrollment của chính mình (secure)
- ✅ Không cần truyền userId trong URL (lấy từ token)
- ✅ Đơn giản, dễ implement

### **GIẢI PHÁP 2: Sửa SecurityConfig cho endpoint hiện tại**

**Nếu muốn giữ endpoint `/api/enrollments/user/{userId}`:**

```java
// In SecurityConfig.java
.requestMatchers(HttpMethod.GET, "/api/enrollments/user/**")
    .access((authentication, context) -> {
        // Check if user is ADMIN/MENTOR or accessing their own data
        String requestedUserId = context.getRequest().getRequestURI()
            .split("/")[4]; // Extract userId from path
        String authenticatedUserId = authentication.get().getName();
        
        boolean isAdmin = authentication.get().getAuthorities()
            .stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
        return isAdmin || requestedUserId.equals(authenticatedUserId);
    })
```

**Nhược điểm:**
- ⚠️ Phức tạp hơn
- ⚠️ Dễ có security holes nếu không cẩn thận

### **GIẢI PHÁP 3: Thống nhất API Versioning**

**Nên chọn một trong hai:**

**Option A: Thêm version cho tất cả endpoints**
```
/api/v1/auth/login
/api/v1/enrollments/user/{id}
/api/v1/courses
/api/v1/users/me
```

**Option B: Bỏ version (không khuyến khích)**
```
/api/auth/login
/api/enrollments/user/{id}
/api/courses
```

---

## 🚀 Frontend Improvements

### **Cần làm tiếp:**

1. **Update enrollmentService để dùng endpoint mới**
   ```typescript
   // Thêm method mới
   getMyEnrollments: async (): Promise<EnrollmentListResponse | ApiErrorResponse> => {
     return apiCall<EnrollmentListResponse>(
       getApiUrl('/api/enrollments/my-enrollments')
     );
   }
   ```

2. **Apply API Interceptor cho tất cả services**
   - Thay thế `apiCall` hiện tại bằng `apiCallWithRefresh`
   - Test token refresh flow

3. **Thêm Error Boundary**
   ```typescript
   // Wrap entire app hoặc major routes
   <ErrorBoundary fallback={<ErrorPage />}>
     <App />
   </ErrorBoundary>
   ```

4. **Implement Retry Logic**
   - Retry failed requests (except auth errors)
   - Exponential backoff cho network errors

---

## 📊 Testing Checklist

### **Sau khi backend fix:**

- [ ] Login với student account
- [ ] Check token có được lưu vào localStorage
- [ ] Dashboard load được enrollments từ API
- [ ] Không còn fallback sang demo data
- [ ] Token tự động refresh khi gần hết hạn
- [ ] Logout và redirect to login khi token invalid

### **Edge cases cần test:**

- [ ] Token expired giữa chừng session
- [ ] Network error khi gọi API
- [ ] Backend trả về 500 error khác (không phải Access Denied)
- [ ] Student chưa có enrollment nào
- [ ] Multiple tabs cùng login (sync token across tabs)

---

## 📞 Liên hệ Backend Team

**Cần hỏi:**
1. Tại sao `/api/enrollments/user/{userId}` trả về "Access Denied" cho Student?
2. Role nào được phép truy cập endpoint này?
3. Có plan thêm endpoint `/api/enrollments/my-enrollments` không?
4. API versioning strategy là gì? (`/api/v1/` hay `/api/`?)
5. Token expiry time là bao lâu? (để config refresh timing)

**Gửi logs:**
```
🔑 Token exists: true
👤 User Response: {success: true, data: {...}}
📚 Fetching enrollments for userId: 2
❌ Enrollment API Error: {success: false, message: "Access Denied"}
```

---

## 🎯 Kết luận

### **Trạng thái hiện tại:**
- ✅ Frontend đã có fallback mechanism
- ✅ UX không bị ảnh hưởng nghiêm trọng
- ⚠️ Đang dùng demo data cho student dashboard
- ❌ Chưa integrate được với backend enrollment API

### **Next Steps:**
1. **Backend:** Implement endpoint `/api/enrollments/my-enrollments`
2. **Frontend:** Update service để dùng endpoint mới
3. **Testing:** Verify token refresh và error handling
4. **Deploy:** Test trên production environment

---

Generated: 2025-11-14
Status: ⚠️ Waiting for backend fix
