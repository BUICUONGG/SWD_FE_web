# Backend TODO: Implement /team/my-teams Endpoint

## Problem
Frontend is calling `GET /team/my-teams` but backend returns 500 error "No static resource team/my-teams."

## Required Endpoint

### GET /team/my-teams
Returns all teams that the current authenticated user is a member of.

#### Authentication
- Requires: JWT Bearer token in Authorization header
- Extracts userId from token to find user's teams

#### Response Format
```json
{
  "success": true,
  "message": "Retrieved user teams successfully",
  "data": [
    {
      "id": 1,
      "name": "Team Innovation",
      "courseId": 101,
      "courseName": "SWD392 - Software Architecture",
      "courseCode": "SWD392",
      "semesterId": 1,
      "semesterName": "Spring 2025",
      "mentorId": 5,
      "mentorName": "Dr. Nguyen Van A",
      "memberCount": 4,
      "mainIdeaId": 10,
      "mainIdeaName": "AI-powered Learning Platform",
      "members": [
        {
          "enrollmentId": 201,
          "userId": 100,
          "userFullName": "Tran Van An",
          "userEmail": "student1@fpt.edu.vn",
          "isLeader": true,
          "majorName": "Software Engineering"
        },
        {
          "enrollmentId": 202,
          "userId": 101,
          "userFullName": "Le Thi Binh",
          "userEmail": "student2@fpt.edu.vn",
          "isLeader": false,
          "majorName": "Software Engineering"
        }
      ],
      "ideas": [
        {
          "ideaId": 10,
          "name": "AI-powered Learning Platform",
          "description": "Platform using AI for personalized learning",
          "ownerId": 100,
          "ownerName": "Tran Van An",
          "isMainIdea": true
        }
      ]
    }
  ]
}
```

## Implementation Steps (Backend)

### 1. Add Controller Method in TeamController.java

```java
@GetMapping("/my-teams")
@PreAuthorize("hasAnyRole('STUDENT', 'MENTOR')")
public ApiResponse<List<TeamResponse>> getMyTeams(Authentication authentication) {
    String userId = authentication.getName(); // Get userId from JWT token
    List<TeamResponse> teams = teamService.getTeamsByUserId(Long.parseLong(userId));
    return ApiResponse.<List<TeamResponse>>builder()
        .success(true)
        .message("Retrieved user teams successfully")
        .data(teams)
        .build();
}
```

### 2. Add Service Method in TeamService.java

```java
public List<TeamResponse> getTeamsByUserId(Long userId) {
    // Find all enrollments for this user
    List<EnrollmentEntity> enrollments = enrollmentRepository.findByUserId(userId);
    
    List<TeamResponse> teams = new ArrayList<>();
    
    for (EnrollmentEntity enrollment : enrollments) {
        // Find team where this enrollment is a member
        Optional<TeamMemberEntity> teamMember = teamMemberRepository
            .findByEnrollmentId(enrollment.getId());
            
        if (teamMember.isPresent()) {
            TeamEntity team = teamMember.get().getTeam();
            TeamResponse teamResponse = teamMapper.toTeamResponse(team);
            teams.add(teamResponse);
        }
    }
    
    return teams;
}
```

### 3. Add Repository Method (if needed)

```java
// In TeamMemberRepository.java
Optional<TeamMemberEntity> findByEnrollmentId(Long enrollmentId);

// Or in TeamRepository.java
@Query("SELECT t FROM TeamEntity t JOIN t.teamMembers tm WHERE tm.enrollment.user.id = :userId")
List<TeamEntity> findTeamsByUserId(@Param("userId") Long userId);
```

## Testing

### Manual Test with Postman/curl
```bash
curl -X GET "http://localhost:8080/team/my-teams" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Expected Behavior
- Returns 200 OK with list of teams
- Each team includes full member information
- Works for both STUDENT and MENTOR roles
- Returns empty array `[]` if user has no teams

## Frontend Usage

Once implemented, frontend will automatically fetch teams when user logs in:
- StudentDashboard shows "Nhóm của tôi" section
- StudentGroups page can filter user's teams
- No code changes needed in frontend (already implemented)

## Current Workaround

Frontend is currently showing empty state with message "Bạn chưa tham gia nhóm nào" until this endpoint is implemented.

To enable the feature, uncomment the API call in `src/pages/StudentDashboard.tsx` line 42-61.

---
**Priority**: HIGH - This blocks student team management features
**Estimated Time**: 1-2 hours
**Related Files**: 
- `TeamController.java`
- `TeamService.java`
- `TeamRepository.java` or `TeamMemberRepository.java`
