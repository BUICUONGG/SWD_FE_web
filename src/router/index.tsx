import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { HomePage, LoginPage, RegisterPage, AdminDashboard, StudentDashboard, StudentCourses, StudentClasses, StudentSchedule, StudentGrades } from '../pages';
import UserProfile from '../pages/UserProfile';
import AdminProfile from '../pages/AdminProfile';
import { AdminProtectedRoute, StudentProtectedRoute, PublicRoute } from '../components/ProtectedRoute';

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