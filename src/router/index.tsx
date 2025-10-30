import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { HomePage, LoginPage, RegisterPage, AdminDashboard, StudentDashboard } from '../pages';
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