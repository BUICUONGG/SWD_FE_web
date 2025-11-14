# Backend Synchronization Changes

## Những gì đã thay đổi

Đã đồng bộ hoá frontend với backend TeamEntity structure.

### 1. Team Type Changes (src/types/team.ts)

**CŨ:**
```typescript
interface Team {
  teamId: number;
  courseId: number;
  courseName: string;
  leaderId: number;
  leaderName: string;
  maxMembers: number;
  currentMembers: number;
  members?: TeamMember[];
  status: 'FORMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  description?: string;
}
```

**MỚI (Match với Backend TeamEntity):**
```typescript
interface Team {
  id: number;              // Backend dùng 'id', không phải 'teamId'
  name: string;
  status: 'OPENING' | 'CLOSED' | 'COMPLETED';  // Backend enum
  courseId?: number;        // Populated from course.id
  courseName?: string;      // Populated from course.name
  leaderId?: number;        // Calculated from teamMembers
  leaderName?: string;      // Calculated from teamMembers
  teamMembers?: TeamMember[]; // Direct from backend
  members?: TeamMember[];   // Alias for compatibility
  // Removed: maxMembers, currentMembers, description (không có trong backend)
}
```

### 2. TeamService Changes (src/services/teamService.ts)

Thêm transformation layer `transformTeam()` để convert backend TeamEntity sang frontend-friendly format:

```typescript
private transformTeam(backendTeam: any): Team {
  const teamMembers = backendTeam.teamMembers?.map(tm => ({
    id: tm.id,
    userId: tm.enrollment?.user?.id,
    fullName: tm.enrollment?.user?.fullName,
    email: tm.enrollment?.user?.email,
    role: tm.isLeader ? 'LEADER' : 'MEMBER',
    joinedAt: tm.joinedAt
  })) || [];

  const leader = teamMembers.find(m => m.isLeader);

  return {
    id: backendTeam.id,
    name: backendTeam.name,
    status: backendTeam.status,
    courseId: backendTeam.course?.id,
    courseName: backendTeam.course?.name,
    leaderId: leader?.userId,
    leaderName: leader?.fullName,
    teamMembers: teamMembers,
    members: teamMembers
  };
}
```

### 3. Component Changes

**Properties không còn tồn tại:**
- ❌ `team.teamId` → ✅ `team.id`
- ❌ `team.maxMembers` → ✅ Use `team.members?.length`
- ❌ `team.currentMembers` → ✅ Use `team.members?.length`
- ❌ `team.description` → ❌ Không có trong backend
- ❌ `team.status === 'ACTIVE'` → ✅ `team.status === 'OPENING'`

**Đã sửa:**
- ✅ StudentDashboard.tsx - Dùng `team.id`, `team.courseName` direct
- ✅ StudentGroups.tsx - Sample data match với backend structure  
- ✅ StudentGroupDetail.tsx - Dùng `team.id` trong service calls
- ✅ MentorDashboard.tsx - Dùng `team.members.length`

**CẦN SỬA THÊM:**
- ⚠️ StudentGroups.tsx - UI còn reference `currentMembers/maxMembers`
- ⚠️ StudentGroupDetail.tsx - Sample data còn dùng old structure
- ⚠️ MentorTeamManagement.tsx - Nhiều chỗ dùng old properties

### 4. Backend Structure Reference

```java
// TeamEntity.java
public class TeamEntity {
    private Long id;
    private String name;
    private TeamStatus status;  // Enum: OPENING, CLOSED, COMPLETED
    
    @ManyToOne
    private CourseEntity course;
    
    @OneToMany
    private List<TeamMemberEntity> teamMembers;
    
    @ManyToOne
    private IdeaEntity idea;
    
    // NO: description, maxMembers, currentMembers
}

// TeamMemberEntity.java  
public class TeamMemberEntity {
    private Long id;
    
    @ManyToOne
    private EnrollmentEntity enrollment;  // Contains user info
    
    private Boolean isLeader;
    private LocalDateTime joinedAt;
}
```

### 5. Next Steps

1. **Fix UI Components:**
   - Replace `team.currentMembers` with `team.members?.length || 0`
   - Remove `team.maxMembers` - Backend doesn't limit team size
   - Remove `team.description` displays
   - Fix status checks: 'ACTIVE' → 'OPENING'

2. **Update Sample Data:**
   - All sample teams should match new Team interface
   - Include proper `id` field
   - Remove `teamId`, `maxMembers`, `currentMembers`, `description`

3. **Test with Real Backend:**
   - Start backend: `cd BE/SWD_BE && mvn spring-boot:run`
   - Login and create teams
   - Verify transformation works correctly
   - Check nested objects (course, teamMembers) populate correctly

## Migration Guide

Nếu bạn có custom code sử dụng Team type:

```typescript
// OLD CODE
if (team.teamId === 123) { ... }
if (team.currentMembers >= team.maxMembers) { ... }

// NEW CODE  
if (team.id === 123) { ... }
if ((team.members?.length || 0) >= 6) { ... }  // Assume max = 6
```

## Testing

1. Compile errors fixed: ✓ Kiểm tra `npm run build`
2. Runtime testing: ⚠️ Cần test với backend running
3. API responses: ⚠️ Verify backend returns expected structure

## Known Issues

1. **Incomplete migration** - Một số components còn dùng old properties
2. **Sample data** - Fallback data cần match với backend structure  
3. **Type safety** - Một số fields optional, cần null checks

Chạy `npm run build` để kiểm tra còn compile errors nào.
