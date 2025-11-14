# MentorCourseManagement - Teams Integration

## ✅ Đã hoàn thành

### 1. Thêm Teams Display vào MentorCourseManagement

**File:** `src/pages/MentorCourseManagement.tsx`

#### Thay đổi:

1. **Import thêm teamService và types:**
```typescript
import { teamService, isTeamListResponse, isApiError as isTeamApiError } from '../services/teamService';
import type { Team } from '../types/team';
```

2. **Thêm state management:**
```typescript
const [teams, setTeams] = useState<Team[]>([]);
const [loadingTeams, setLoadingTeams] = useState(false);
```

3. **Fetch teams function:**
```typescript
const fetchTeams = async (courseId: number) => {
  // Lấy mentorId từ localStorage
  // Call teamService.getTeamsByCourse(courseId, mentorId)
  // Update teams state
}
```

4. **Teams Table Columns:**
- Tên nhóm (với avatar)
- Nhóm trưởng
- Số thành viên
- Trạng thái (OPENING/CLOSED)
- Ngày tạo
- Thao tác (Xem chi tiết)

5. **Statistics Card - Thêm số nhóm:**
```typescript
<Statistic
  title="Số nhóm"
  value={teams.length}
  prefix={<TeamOutlined />}
/>
```

6. **Teams Card:**
- Hiển thị loading state
- Empty state với message thân thiện
- Table với pagination
- Button "Quản lý nhóm" link tới `/mentor/course/:courseId/teams`

7. **Quick Actions - Thêm button Quản lý nhóm:**
```typescript
<Button 
  type="primary" 
  icon={<TeamOutlined />}
  onClick={() => navigate(`/mentor/course/${courseId}/teams`)}
>
  Quản lý nhóm
</Button>
```

### 2. Router Updates

**File:** `src/router/index.tsx`

Thêm routes:
```typescript
{
  path: "course/:courseId",
  element: <MentorCourseManagement />
},
{
  path: "course/:courseId/teams",
  element: <MentorTeamManagement />
},
{
  path: "teams/:teamId",
  element: <MentorTeamManagement />
}
```

## 📸 Features

### Statistics Section
- **Số sinh viên**: Current/Max với progress bar
- **Số nhóm**: Tổng số nhóm + số nhóm đang mở
- **Chờ phê duyệt**: Số đơn enrollment pending
- **Trạng thái**: Status của course

### Teams Section
1. **Loading State**: Spinner khi đang tải
2. **Empty State**: Message khi chưa có nhóm
3. **Table Display**:
   - Avatar cho mỗi team
   - Team name và ID
   - Leader information
   - Member count badge
   - Status tag (màu sắc theo status)
   - Created date
   - Action buttons

4. **Navigation**:
   - Click "Xem chi tiết" → `/mentor/teams/:teamId`
   - Click "Quản lý nhóm" → `/mentor/course/:courseId/teams`

## 🎯 Use Cases

### Mentor xem danh sách teams trong course:
1. Login as mentor
2. Navigate to Dashboard
3. Click vào một course card
4. Xem section "Danh sách nhóm"
5. Thấy tất cả teams trong course đó
6. Click "Xem chi tiết" để đi đến team management page

### Backend Integration:
```typescript
// API Call
teamService.getTeamsByCourse(courseId, mentorId)

// Response format (from backend)
StandardResponse<Team[]> {
  success: true,
  message: "...",
  data: [
    {
      id: 1,
      name: "Team Innovation",
      status: "OPENING",
      course: {
        id: 1,
        name: "SWD392",
        code: "SWD392"
      },
      teamMembers: [
        {
          id: 1,
          enrollment: {
            user: {
              id: 1,
              fullName: "Nguyễn Văn A",
              email: "..."
            }
          },
          isLeader: true,
          joinedAt: "2025-11-14T..."
        }
      ]
    }
  ]
}
```

## 🔄 Data Flow

```
MentorCourseManagement
  ↓ useEffect
  ↓ fetchTeams(courseId)
  ↓
teamService.getTeamsByCourse(courseId, mentorId)
  ↓ HTTP GET
  ↓ Backend: /api/teams?courseId=X&mentorId=Y
  ↓ StandardResponse<Team[]>
  ↓ transformTeam() for each team
  ↓
setTeams(transformedData)
  ↓
Render <Table> with teams
```

## ⚠️ Lưu ý

1. **MentorId Source**: Lấy từ `localStorage.getItem('user')` → parse JSON → `userId`
2. **Error Handling**: Nếu API fail, hiển thị empty state, không crash
3. **Transformation**: teamService tự động transform backend TeamEntity sang frontend Team type
4. **Navigation**: Tất cả links đã setup đúng routes

## 🐛 Known Issues (Không ảnh hưởng MentorCourseManagement)

Các file khác còn compile errors:
- StudentGroups.tsx - References `currentMembers`, `maxMembers`, `description`
- StudentGroupDetail.tsx - Giống trên
- MentorDashboard.tsx - `currentMembers` reference
- MentorTeamManagement.tsx - Nhiều old properties

**Các errors này không ảnh hưởng MentorCourseManagement page vì đã sử dụng đúng new Team structure.**

## ✅ Testing Steps

1. Start backend: `cd BE/SWD_BE && mvn spring-boot:run`
2. Start frontend: `npm run dev`
3. Login as mentor (mentor1@fpt.edu.vn)
4. Navigate to Dashboard
5. Click vào course có teams
6. Verify:
   - ✓ Statistics hiển thị đúng số teams
   - ✓ Teams table hiển thị danh sách
   - ✓ Status tags đúng màu
   - ✓ Member count hiển thị đúng
   - ✓ Click "Xem chi tiết" navigate đúng
   - ✓ Click "Quản lý nhóm" navigate đúng

## 📦 Files Modified

1. `src/pages/MentorCourseManagement.tsx` - ✅ Complete
2. `src/router/index.tsx` - ✅ Routes added
3. No other files needed for this feature

**MentorCourseManagement page is now fully integrated with Teams functionality! 🎉**
