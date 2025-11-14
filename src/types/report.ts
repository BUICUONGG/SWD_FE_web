// Report Types

export interface DashboardData {
  totalUsers: number;
  totalStudents: number;
  totalMentors: number;
  totalCourses: number;
  totalEnrollments: number;
  totalTeams: number;
  totalIdeas: number;
  activeCourses: number;
  completedCourses: number;
  currentSemesterStats: {
    semesterCode: string;
    semesterName: string;
    coursesCount: number;
    enrollmentsCount: number;
    teamsCount: number;
    averageTeamSize: number;
  };
}

export interface CourseDetail {
  courseId: number;
  courseCode: string;
  courseName: string;
  mentorName: string;
  enrolledCount: number;
  teamsCount: number;
  studentsInTeams: number;
  teamFormationRate: number;
}

export interface StudentReport {
  reportType: string;
  filterName: string;
  filterValue: number;
  totalStudents: number;
  enrolledStudents: number;
  studentsInTeams: number;
  studentsWithoutTeams: number;
  courseDetails: CourseDetail[];
}

export interface MentorCourseDetail {
  courseId: number;
  courseCode: string;
  courseName: string;
  semesterCode: string;
  studentsCount: number;
  teamsCount: number;
  ideasCount: number;
}

export interface MentorPerformance {
  mentorId: number;
  mentorName: string;
  shortName: string;
  totalCourses: number;
  totalStudents: number;
  totalTeams: number;
  averageStudentsPerCourse: number;
  averageTeamsPerCourse: number;
  teamFormationRate: number;
  courses: MentorCourseDetail[];
}

export interface CourseStatistics {
  totalCourses: number;
  activeCourses: number;
  completedCourses: number;
  averageStudentsPerCourse: number;
  coursesBySemester: {
    semesterCode: string;
    coursesCount: number;
  }[];
}

export interface TeamStatistics {
  totalTeams: number;
  averageTeamSize: number;
  teamsWithMainIdea: number;
  teamsWithoutMainIdea: number;
  teamSizeDistribution: {
    size: number;
    count: number;
  }[];
}

export interface EnrollmentStatistics {
  totalEnrollments: number;
  enrollmentsByMajor: {
    majorName: string;
    count: number;
  }[];
  enrollmentsBySemester: {
    semesterCode: string;
    count: number;
  }[];
  topCourses: {
    courseCode: string;
    courseName: string;
    enrollmentCount: number;
  }[];
}

// API Response Types
export interface ReportResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

// Type Guards
export function isApiError(response: any): response is ApiErrorResponse {
  return response && response.success === false;
}

export function isDashboardResponse(response: any): response is ReportResponse<DashboardData> {
  return response && response.success === true && response.data && 'totalUsers' in response.data;
}

export function isStudentReportResponse(response: any): response is ReportResponse<StudentReport> {
  return response && response.success === true && response.data && 'reportType' in response.data;
}

export function isMentorPerformanceResponse(response: any): response is ReportResponse<MentorPerformance[]> {
  return response && response.success === true && Array.isArray(response.data);
}

export function isCourseStatisticsResponse(response: any): response is ReportResponse<CourseStatistics> {
  return response && response.success === true && response.data && 'totalCourses' in response.data;
}

export function isTeamStatisticsResponse(response: any): response is ReportResponse<TeamStatistics> {
  return response && response.success === true && response.data && 'totalTeams' in response.data;
}

export function isEnrollmentStatisticsResponse(response: any): response is ReportResponse<EnrollmentStatistics> {
  return response && response.success === true && response.data && 'totalEnrollments' in response.data;
}
