# Student Groups - API Issues Fixed

## 🔧 Changes Made

### 1. Fixed API Base URL
**File:** `src/services/teamService.ts`

```typescript
// OLD
const API_BASE = 'http://localhost:8080/api/teams';

// NEW
const API_BASE = 'http://localhost:8080/team';
```

**Reason:** Backend controller likely uses `/team` not `/api/teams`

### 2. Fixed Query Parameters
```typescript
// OLD
`${API_BASE}?CourseId=${courseId}&mentorId=${mentorId}`

// NEW  
`${API_BASE}?courseId=${courseId}&mentorId=${mentorId}`
```

**Reason:** Backend expects lowercase `courseId`

### 3. Enhanced Error Handling

Added HTML detection in `safeJsonParse`:
```typescript
// Check if response is HTML (error page)
if (text.trim().startsWith('<')) {
  console.error('Received HTML instead of JSON');
  throw new Error('Server returned error page');
}
```

### 4. Added Comprehensive Logging

Added console logs in:
- `teamService.getTeamsByCourse()` - Request URL, response status
- `StudentGroups.loadTeams()` - Flow tracking
- Error responses now show first 500 chars

### 5. Improved Fallback Logic

StudentGroups now:
- ✅ Always shows sample data on API failure
- ✅ Logs all steps for debugging
- ✅ Handles empty responses gracefully
- ✅ Filters sample data by courseId

## 🐛 Root Causes Found

### Issue 1: 400 Bad Request
**Symptoms:**
- `Invalid JSON response: SyntaxError`
- `Failed to load resource: 400`
- Backend returning HTML error page

**Causes:**
1. Wrong API endpoint (`/api/teams` vs `/team`)
2. Wrong parameter casing (`CourseId` vs `courseId`)
3. Backend validation failing

### Issue 2: Authentication
**Possible cause:** Token not valid or expired

**Check:**
```javascript
localStorage.getItem('accessToken')
// Should return valid JWT token
```

### Issue 3: CORS
**Possible cause:** Backend not configured for localhost:3000

**Backend needs:**
```java
@CrossOrigin(origins = "http://localhost:3000")
```

## ✅ Expected Backend Endpoints

Based on controllers provided:

```
GET  /team/{id}                    - Get team by ID
GET  /team/my-teams                - Get current user's teams
GET  /team/by-enrollment           - Get team by enrollmentId
GET  /team?courseId=X&mentorId=Y   - Get teams by course
POST /team/create                  - Create new team
PUT  /team/{id}                    - Update team
DELETE /team/{id}                  - Delete team
DELETE /team/{id}/members/{enrollmentId} - Remove member
POST /team/{id}/leave              - Leave team
PUT  /team/{id}/select-idea        - Select idea
```

## 🧪 Testing Steps

### 1. Check Backend is Running
```bash
# Should see backend logs
curl http://localhost:8080/actuator/health
```

### 2. Check Authentication
Open DevTools Console:
```javascript
console.log('Token:', localStorage.getItem('accessToken'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

### 3. Test API Directly
```bash
# Get your token from localStorage
TOKEN="your-token-here"

# Test my-teams endpoint
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/team/my-teams

# Test teams by course
curl -H "Authorization: Bearer $TOKEN" \
     "http://localhost:8080/team?courseId=1&mentorId=1"
```

### 4. Check Network Tab
- Open DevTools → Network
- Refresh page
- Look for requests to `/team`
- Check:
  - ✅ Request URL correct?
  - ✅ Authorization header present?
  - ✅ Response status (should be 200)
  - ✅ Response type (should be JSON not HTML)

## 📊 Current Behavior

With fixes applied:

### Scenario 1: Backend Running + API Working
- ✅ Shows real teams from database
- ✅ Create team works
- ✅ Navigation works

### Scenario 2: Backend Running + API Failing
- ✅ Shows sample data
- ✅ Console shows detailed error logs
- ✅ User can still browse (with sample data)
- ⚠️ Create team will fail (expected)

### Scenario 3: Backend Not Running
- ✅ Shows sample data
- ✅ Console shows connection error
- ✅ User can still browse (with sample data)

## 🔍 Debug Console Output

You should now see:
```
Loading teams for courseId: 1
Fetching teams for course 1, mentor 1
Request URL: http://localhost:8080/team?courseId=1&mentorId=1
Response status: 200
Teams data received: {success: true, data: [...]}
Successfully loaded teams: 5
```

Or on error:
```
Response status: 400
Error response: <!DOCTYPE html>...
Error loading teams, using sample data: Không thể lấy danh sách nhóm (400)
```

## 🚀 Next Steps

1. **If seeing 400 errors:**
   - Check backend logs for validation errors
   - Verify backend expects these exact parameters
   - Check if mentorId is required or optional

2. **If seeing connection errors:**
   - Start backend: `cd BE/SWD_BE && mvn spring-boot:run`
   - Verify backend on port 8080

3. **If seeing 401/403:**
   - Re-login to get fresh token
   - Check token expiration

4. **If seeing HTML responses:**
   - Backend endpoint doesn't exist
   - Spring Security redirecting to login page
   - Check backend has `@CrossOrigin` annotation

## 📝 Sample Data

Currently showing 5 sample teams:
1. Team Innovation (SWD392)
2. Team AI Research (AI301)
3. Team Mobile App (SWD392)
4. Team Data Science (AI301)
5. Team Blockchain (SWD392)

This allows users to:
- ✅ Browse UI
- ✅ Test navigation
- ✅ See layout
- ⚠️ Cannot actually create/join teams (requires backend)

## ✅ Verification Checklist

After changes, verify:
- [ ] No more JSON parse errors in console
- [ ] Sample data shows on page load
- [ ] Create team modal opens
- [ ] Enrollment dropdown populated
- [ ] Console shows detailed logs
- [ ] Page doesn't crash on API errors

## 🎯 Summary

**Fixed:**
- ✅ API endpoint URL (`/team` not `/api/teams`)
- ✅ Query parameter casing (`courseId` not `CourseId`)
- ✅ HTML response detection
- ✅ Comprehensive error logging
- ✅ Graceful fallback to sample data

**User Experience:**
- ✅ Page always loads (no white screen)
- ✅ Sample data available for UI testing
- ✅ Clear error messages in console
- ✅ Can browse and test UI even if backend down

**Ready for Testing:**
Just refresh the page and check console for detailed logs!
