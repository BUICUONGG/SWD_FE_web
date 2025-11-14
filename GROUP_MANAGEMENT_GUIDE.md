# 👥 HƯỚNG DẪN QUẢN LÝ NHÓM (GROUP MANAGEMENT)

## 📋 Tổng quan

Hệ thống quản lý nhóm cho phép sinh viên:
- Tạo nhóm mới cho các lớp học đã đăng ký
- Xem danh sách tất cả nhóm trong lớp
- Xin tham gia nhóm khác
- Quản lý thành viên nhóm của mình

---

## 🎯 Các tính năng chính

### 1. **Tạo nhóm mới** ✨
**Điều kiện:**
- Đã đăng ký ít nhất 1 lớp học (Enrollment status = APPROVED)
- Chưa tạo nhóm cho lớp đó

**Quy trình:**
1. Click nút **"Tạo nhóm mới"**
2. Chọn lớp học từ dropdown (chỉ hiển thị các lớp đã đăng ký)
3. Nhập tên nhóm (3-100 ký tự)
4. Nhập mô tả nhóm (tùy chọn, tối đa 500 ký tự)
5. Chọn số lượng thành viên tối đa (2-10 người)
6. Click **"Tạo nhóm"**

**Kết quả:**
- Bạn tự động trở thành **Nhóm trưởng** (Leader)
- Nhóm được hiển thị trong danh sách "Nhóm của bạn"

**API Endpoint:**
```
POST /api/teams/create
Body: {
  name: string,
  description?: string,
  enrollmentId: number,
  maxMembers: number
}
```

---

### 2. **Xem danh sách nhóm** 📋

**Bộ lọc:**
- **Theo lớp học:** Chọn lớp học từ dropdown để chỉ xem nhóm của lớp đó
- **Tìm kiếm:** Nhập từ khóa để tìm theo tên nhóm hoặc mô tả

**Thông tin hiển thị:**
- Tên nhóm
- Mô tả nhóm
- Tên lớp học
- Tên nhóm trưởng
- Số lượng thành viên (hiện tại/tối đa)
- Progress bar % đầy
- Tags: "Đã tham gia" / "Đầy"

**API Endpoints:**
```
GET /api/teams?CourseId={courseId}&mentorId={mentorId}
GET /api/teams (tất cả nhóm)
```

---

### 3. **Xin tham gia nhóm** 🙋

**Điều kiện:**
- Nhóm còn chỗ trống (currentMembers < maxMembers)
- Chưa tham gia nhóm đó

**Quy trình:**
1. Click nút **"Xin tham gia"** trên nhóm muốn tham gia
2. Hệ thống xử lý yêu cầu
3. Nhận thông báo kết quả

**Trạng thái:**
- ✅ **Thành công:** Bạn được thêm vào nhóm
- ❌ **Thất bại:** Nhóm đầy hoặc đã tham gia

**API Endpoint:**
```
POST /api/teams/{teamId}/join
```

**Lưu ý:** Theo API documentation, endpoint này không yêu cầu authorization check, nên nó sẽ hoạt động cho mọi authenticated user.

---

### 4. **Xem thành viên nhóm** 👥

**Quy trình:**
1. Click nút **"Xem thành viên"** trên nhóm
2. Modal hiển thị danh sách thành viên với:
   - Avatar
   - Họ tên
   - Email
   - Vai trò (Leader/Member)
   - Ngày tham gia

**Thông tin Nhóm trưởng:**
- Có icon 👑 và tag màu vàng "Nhóm trưởng"

---

### 5. **Xem nhóm của mình** 📊

**Thống kê hiển thị:**
- **Tổng số nhóm:** Tất cả nhóm trong hệ thống (theo filter)
- **Nhóm của bạn:** Số nhóm bạn đã tham gia
- **Nhóm còn chỗ:** Số nhóm vẫn còn chỗ trống
- **Lớp đã đăng ký:** Số lớp học bạn đã đăng ký

**API Endpoint:**
```
GET /api/teams/my-teams?enrollmentId={enrollmentId}
GET /api/teams/my-teams (tất cả nhóm của mình)
```

---

## 🔄 Luồng hoạt động hoàn chỉnh

### **Kịch bản 1: Student tạo nhóm mới**

```
1. Student đăng ký lớp học
   ↓
2. Enrollment được APPROVE
   ↓
3. Student vào trang "Nhóm học"
   ↓
4. Click "Tạo nhóm mới"
   ↓
5. Chọn lớp học, nhập thông tin nhóm
   ↓
6. Submit → Trở thành Leader
   ↓
7. Nhóm xuất hiện trong "Nhóm của bạn"
```

### **Kịch bản 2: Student tham gia nhóm có sẵn**

```
1. Student vào trang "Nhóm học"
   ↓
2. Lọc theo lớp học đã đăng ký
   ↓
3. Tìm nhóm phù hợp (còn chỗ trống)
   ↓
4. Click "Xin tham gia"
   ↓
5. Hệ thống xử lý
   ↓
6. Thành công → Được thêm vào nhóm
```

### **Kịch bản 3: Leader quản lý nhóm**

```
1. Leader tạo nhóm
   ↓
2. Các student khác xin tham gia
   ↓
3. Leader xem danh sách thành viên
   ↓
4. (Tương lai) Leader approve/reject requests
   ↓
5. (Tương lai) Leader chọn idea cho nhóm
```

---

## 🎨 Giao diện

### **Header**
```
👥 Nhóm học
Xem danh sách các nhóm và xin tham gia
```

### **Search & Filter Bar**
```
[🔍 Tìm kiếm theo tên nhóm, mô tả...]        [➕ Tạo nhóm mới]

Lọc theo lớp: [Dropdown: Chọn lớp học]
```

### **Statistics Cards**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ 15          │ 3           │ 8           │ 5           │
│ Tổng số     │ Nhóm của    │ Nhóm còn    │ Lớp đã      │
│ nhóm        │ bạn         │ chỗ         │ đăng ký     │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### **Team List**
```
┌─────────────────────────────────────────────────────┐
│ [Icon] Nhóm 1 - Quản lý bán hàng  [✓ Đã tham gia]   │
│                                                      │
│ Xây dựng hệ thống quản lý bán hàng online...       │
│ [CS445 - Lập trình React] [Nhóm trưởng: Nguyễn A] │
│ 👥 4/5 thành viên                                   │
│ [████████░░] 80%                                    │
│                                                      │
│                    [Xem thành viên] [Đã tham gia]   │
└─────────────────────────────────────────────────────┘
```

---

## ⚠️ Lưu ý quan trọng

### **Quyền hạn:**
- ✅ **STUDENT:** Có thể tạo nhóm, xin tham gia nhóm, xem nhóm
- ✅ **MENTOR:** Có thể xem tất cả nhóm trong lớp của mình
- ✅ **ADMIN:** Full access

### **Giới hạn:**
- Mỗi student có thể tạo **nhiều nhóm** (theo từng lớp)
- Mỗi nhóm có **2-10 thành viên**
- Tên nhóm: **3-100 ký tự**
- Mô tả: **tối đa 500 ký tự**

### **Trạng thái nhóm:**
- **FORMING:** Nhóm đang tuyển thành viên
- **ACTIVE:** Nhóm đã đủ thành viên, đang hoạt động
- **COMPLETED:** Nhóm đã hoàn thành project
- **ARCHIVED:** Nhóm đã bị lưu trữ

---

## 🐛 Xử lý lỗi

### **Không có lớp học nào:**
```
⚠️ Bạn chưa đăng ký lớp học nào
Vui lòng đăng ký lớp học trước khi tạo nhóm.
[Đi đến trang Khám phá khóa học]
```

### **Nhóm đã đầy:**
```
❌ Nhóm đầy
Nhóm này đã đủ thành viên rồi.
```

### **Đã tham gia nhóm:**
```
ℹ️ Đã tham gia
Bạn đã tham gia nhóm này rồi!
```

### **Lỗi kết nối:**
```
❌ Lỗi kết nối
Không thể kết nối đến server. Vui lòng thử lại.
[Thử lại]
```

---

## 🚀 Tính năng sắp tới (TODO)

### **Phase 2:**
- [ ] Application system (gửi đơn join, approve/reject)
- [ ] Invite system (leader mời student vào nhóm)
- [ ] Leave team (rời khỏi nhóm)
- [ ] Kick member (leader kick thành viên)

### **Phase 3:**
- [ ] Idea management (tạo và chọn idea cho nhóm)
- [ ] Team chat/discussion
- [ ] File sharing trong nhóm
- [ ] Task assignment

### **Phase 4:**
- [ ] Team performance tracking
- [ ] Peer review system
- [ ] Team analytics dashboard

---

## 📊 Database Schema (Tham khảo)

### **TeamEntity:**
```java
- teamId: Long
- name: String
- description: String
- enrollmentId: Long
- leaderId: Long
- maxMembers: Integer
- status: TeamStatus
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
```

### **TeamMemberEntity:**
```java
- id: Long
- teamId: Long
- userId: Long
- role: MemberRole (LEADER/MEMBER)
- joinedAt: LocalDateTime
```

---

## 🔗 API Reference Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/teams/create` | POST | Student | Tạo nhóm mới |
| `/api/teams/my-teams` | GET | Auth | Xem nhóm của mình |
| `/api/teams?CourseId=` | GET | Auth | Xem nhóm theo lớp |
| `/api/teams/{teamId}/join` | POST | Auth | Xin tham gia nhóm |
| `/api/teams/{teamId}/select-idea` | PUT | Leader | Chọn idea chính |

---

## 📞 Support

Nếu gặp vấn đề, liên hệ:
- **Backend Team:** Kiểm tra API endpoints
- **Frontend Team:** Kiểm tra UI/UX và logic
- **QA Team:** Report bugs

---

**Last Updated:** November 14, 2025  
**Version:** 1.0.0  
**Status:** ✅ Core features implemented
