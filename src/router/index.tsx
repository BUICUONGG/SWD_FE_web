import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { HomePage, LoginPage, RegisterPage, AdminDashboard, StudentDashboard, StudentCourses, StudentCourseExplorer, StudentClasses, StudentSchedule, StudentGrades, StudentGroups, MentorDashboard, MentorCourseManagement } from '../pages';
import UserProfile from '../pages/UserProfile';
import AdminProfile from '../pages/AdminProfile';
import { AdminProtectedRoute, StudentProtectedRoute, MentorProtectedRoute, PublicRoute } from '../components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: "admin",
        children: [
          {
            path: "dashboard",
            element: (
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <AdminProtectedRoute>
                <AdminProfile />
              </AdminProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "student",
        children: [
          {
            path: "dashboard",
            element: (
              <StudentProtectedRoute>
                <StudentDashboard />
              </StudentProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <StudentProtectedRoute>
                <UserProfile />
              </StudentProtectedRoute>
            ),
          },
          {
            path: "courses",
            element: (
              <StudentProtectedRoute>
                <StudentCourses />
              </StudentProtectedRoute>
            ),
          },
          {
            path: "discover",
            element: (
              <StudentProtectedRoute>
                <StudentCourseExplorer />
              </StudentProtectedRoute>
            ),
          },
          {
            path: "classes",
            element: (
              <StudentProtectedRoute>
                <StudentClasses />
              </StudentProtectedRoute>
            ),
          },
          {
            path: "schedule",
            element: (
              <StudentProtectedRoute>
                <StudentSchedule />
              </StudentProtectedRoute>
            ),
          },
          {
            path: "grades",
            element: (
              <StudentProtectedRoute>
                <StudentGrades />
              </StudentProtectedRoute>
            ),
          },
          {
            path: "groups",
            element: (
              <StudentProtectedRoute>
                <StudentGroups />
              </StudentProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "mentor",
        children: [
          {
            path: "dashboard",
            element: (
              <MentorProtectedRoute>
                <MentorDashboard />
              </MentorProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <MentorProtectedRoute>
                <UserProfile />
              </MentorProtectedRoute>
            ),
          },
          {
            path: "course/:courseId",
            element: (
              <MentorProtectedRoute>
                <MentorCourseManagement />
              </MentorProtectedRoute>
            ),
          },
          {
            path: "course/:courseId/students",
            element: (
              <MentorProtectedRoute>
                <MentorCourseManagement />
              </MentorProtectedRoute>
            ),
          },
        ],
      },
      // Catch all route - redirect to home
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);