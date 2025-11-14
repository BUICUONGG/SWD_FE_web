# Hướng dẫn kết nối Backend

## 🔍 Kiểm tra Backend Server

### Bước 1: Kiểm tra Backend có đang chạy không?

Mở browser và truy cập: `http://localhost:8080`

Kết quả mong đợi:
- ✅ Trang Swagger UI hoặc trang chủ backend
- ❌ "This site can't be reached" = Backend chưa chạy

### Bước 2: Test API Endpoint

Mở DevTools Console (F12) và chạy lệnh sau:

```javascript
// Test 1: Check backend health
fetch('http://localhost:8080/api/health')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);

// Test 2: Check authentication
const token = localStorage.getItem('accessToken');
console.log('Token:', token ? 'Có' : 'Không có');

// Test 3: Test enrollments API
fetch('http://localhost:8080/api/enrollments/user/1', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Accept': 'application/json'
  }
})
  .then(r => {
    console.log('Status:', r.status);
    return r.text();
  })
  .then(text => {
    console.log('Response:', text);
    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON:', json);
    } catch (e) {
      console.error('Not valid JSON - Backend trả về HTML');
    }
  })
  .catch(console.error);
```

### Bước 3: Kiểm tra CORS

Nếu thấy lỗi CORS trong console:
```
Access to fetch at 'http://localhost:8080' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Giải pháp**: Backend cần cấu hình CORS cho phép `http://localhost:3000`

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

## 🚀 Khởi động Backend Server

### Spring Boot Application

```bash
# Từ thư mục backend
cd path/to/backend

# Chạy với Maven
mvn spring-boot:run

# Hoặc với Gradle
./gradlew bootRun

# Hoặc chạy JAR file
java -jar target/your-app.jar
```

### Kiểm tra Backend đã chạy

```bash
# Linux/Mac
curl http://localhost:8080/api/health

# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:8080/api/health
```

## 📋 Checklist

- [ ] Backend server đang chạy tại port 8080
- [ ] Database đã được khởi tạo và có dữ liệu
- [ ] CORS đã được cấu hình cho phép localhost:3000  
- [ ] Token authentication hoạt động (đăng nhập thành công)
- [ ] API endpoints trả về JSON (không phải HTML)

## 🔧 Debug Tips

### 1. Xem response thực sự từ API

```javascript
// Trong console
fetch('http://localhost:8080/api/teams/my-teams', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
})
.then(r => r.text())
.then(text => {
  console.log('Raw response:', text);
  // Nếu thấy HTML tags = Backend lỗi
  // Nếu thấy JSON = Backend OK
});
```

### 2. Kiểm tra token có hợp lệ không

```javascript
// Decode JWT token
const token = localStorage.getItem('accessToken');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
  console.log('Token expired?', payload.exp * 1000 < Date.now());
}
```

### 3. Test trực tiếp với Swagger UI

Truy cập: `http://localhost:8080/swagger-ui/index.html`

- Thử gọi API trực tiếp từ Swagger
- Xem response structure
- Kiểm tra authentication

## ✅ Khi nào frontend sẽ đọc được database?

Frontend sẽ đọc được database khi:

1. ✅ Backend server chạy và listen ở port 8080
2. ✅ Database connection hoạt động
3. ✅ User đã đăng nhập và có valid token
4. ✅ API endpoints trả về JSON đúng format
5. ✅ CORS được cấu hình đúng

Sau khi tất cả điều kiện trên đã OK, **refresh trang (F5)** và frontend sẽ tự động load dữ liệu từ database!
