# Troubleshooting - Create Course Feature

## ❌ Lỗi gặp phải

### Error 1: Failed to load resource: the server responded with a status of 500
- **URL:** `:8080/api/courses:1`
- **Status:** 500 Internal Server Error
- **Nguyên nhân:** URL format sai (dấu `:` thay vì `/`)

### Error 2: Ant Design Warnings
```
Warning: [antd: Spin] `tip` only work in nest or fullscreen pattern
Warning: [antd: Timeline] `Timeline.Item` is deprecated. Please use `items` instead
Warning: [antd: Progress] `width` is deprecated. Please use `size` instead
```

---

## ✅ Giải pháp áp dụng

### 1. **Cải thiện Error Handling**
```typescript
// Thêm validation cụ thể
if (!courseData.code || !courseData.name || !courseData.teamFormationDeadline) {
  message.error('Vui lòng điền tất cả các trường bắt buộc');
  return;
}

// Trim string values
code: values.code?.trim(),
name: values.name?.trim(),

// Parse numeric values
maxStudents: parseInt(values.maxStudents),
subjectId: parseInt(values.subjectId) || 1,
semesterId: parseInt(values.semesterId) || 1,
```

### 2. **Thêm Input cho subjectId và semesterId**
- Cho phép user nhập giá trị thay vì mặc định
- Default: 1 (có thể update nếu backend có dữ liệu khác)

### 3. **Cải thiện Refresh Strategy**
- Thay vì `window.location.reload()` ngay lập tức
- Fetch courses list mới từ API
- Update state trực tiếp
- Fallback: reload page sau 1 giây nếu fetch thất bại

### 4. **Thêm Console Logging**
```typescript
console.log('Creating course with data:', courseData);
console.log('Course created successfully:', response.data);
console.error('API Error:', response);
console.error('Failed to refresh courses:', err);
```

---

## 🔍 Debug Steps

### Khi gặp lỗi, kiểm tra:

1. **Console Logs:**
   - Mở DevTools (F12)
   - Xem tab "Console"
   - Tìm message "Creating course with data:" để xem dữ liệu gửi
   - Tìm "API Error:" để xem response từ server

2. **Network Tab:**
   - Xem POST request tới `/api/courses`
   - Kiểm tra request body
   - Kiểm tra response status và message

3. **Form Validation:**
   - Chắc chắn tất cả fields bắt buộc được điền
   - Không để trống code, name, hoặc deadline date
   - Chọn status từ dropdown

---

## 📋 Checklist

- [x] Thêm validation input
- [x] Parse numeric values
- [x] Trim string values
- [x] Thêm console logging
- [x] Cải thiện error messages
- [x] Thêm subjectId/semesterId inputs
- [x] Tối ưu refresh strategy (không reload page ngay)
- [ ] Test với real backend data
- [ ] Verify API response format
- [ ] Kiểm tra mentor permission trên backend

---

## 🚀 Next Steps

1. **Test lại create course:**
   ```
   1. Đăng nhập mentor
   2. Click "➕ Tạo khóa học mới"
   3. Điền form:
      - Mã: CS450
      - Tên: Test Course
      - Sức chứa: 30
      - Deadline: 2025-12-31
      - Trạng thái: UPCOMING
      - Subject ID: 1
      - Semester ID: 1
   4. Click OK
   5. Kiểm tra console logs
   ```

2. **Nếu lỗi tiếp tục:**
   - Kiểm tra backend logs
   - Verify `/api/courses` endpoint
   - Kiểm tra mentorId có hợp lệ không
   - Verify subjectId, semesterId có tồn tại không

3. **Tối ưu hóa:**
   - Fetch danh sách subjects/semesters từ API
   - Replace hardcoded IDs bằng dropdowns
   - Thêm loading state cho form
   - Thêm success toast notification

---

## 📝 Files Modified

- ✅ `src/pages/MentorDashboard.tsx`
  - Improved handleCreateCourse()
  - Added form inputs for subjectId, semesterId
  - Better error handling
  - Optimized refresh logic

---

**Last Updated:** 2025-10-31  
**Status:** Ready for Testing ✅
