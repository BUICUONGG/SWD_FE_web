# Test Backend API Script
Write-Host "=== Testing Backend API ===" -ForegroundColor Cyan

# Get token from browser's localStorage (you need to provide this)
Write-Host "`nPaste your token from browser localStorage:" -ForegroundColor Yellow
Write-Host "(Press F12 in browser -> Console -> type: localStorage.getItem('accessToken'))" -ForegroundColor Gray
$token = Read-Host "Token"

if ([string]::IsNullOrEmpty($token)) {
    Write-Host "No token provided. Testing without authentication..." -ForegroundColor Red
    $headers = @{ "Accept" = "application/json" }
} else {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
    }
}

$baseUrl = "http://localhost:8080"

# Test 1: My Teams
Write-Host "`n`n=== Test 1: GET /api/teams/my-teams ===" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/teams/my-teams" -Headers $headers -Method Get -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Cyan
    Write-Host "Response:" -ForegroundColor Yellow
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:" -ForegroundColor Red
        Write-Host $responseBody
    }
}

# Test 2: Teams by Course
Write-Host "`n`n=== Test 2: GET /api/teams?CourseId=1&mentorId=1 ===" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/teams?CourseId=1&mentorId=1" -Headers $headers -Method Get -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Cyan
    Write-Host "Response:" -ForegroundColor Yellow
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:" -ForegroundColor Red
        Write-Host $responseBody
    }
}

# Test 3: Check if backend is running
Write-Host "`n`n=== Test 3: Check Backend Health ===" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/actuator/health" -Method Get -ErrorAction Stop
    Write-Host "Backend is running!" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    try {
        # Try root endpoint
        $response = Invoke-WebRequest -Uri $baseUrl -Method Get -ErrorAction Stop
        Write-Host "Backend is responding at root" -ForegroundColor Green
    } catch {
        Write-Host "Backend is NOT running or not accessible" -ForegroundColor Red
        Write-Host "Please start your Spring Boot backend first" -ForegroundColor Yellow
    }
}

Write-Host "`n`n=== Test Complete ===" -ForegroundColor Cyan
Read-Host "Press Enter to exit"
