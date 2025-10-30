import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import viVN from 'antd/locale/vi_VN';
import 'antd/dist/reset.css';
import './App.css';

// Auth feature
import { LoginPage, RegisterPage } from './features/auth';

// Courses feature
import { CoursesListPage, CoursesFormPage } from './features/courses';

// Enrollment feature
import { EnrollmentsListPage, EnrollmentFormPage } from './features/enrollment';

// Users feature
import { UsersListPage, UsersFormPage } from './features/users';

// Mentors feature
import { MentorsListPage, MentorsFormPage } from './features/mentors';

// Semesters feature
import { SemestersListPage, SemestersFormPage } from './features/semesters';

// Old pages (tạm giữ để migration dần)
import { HomePage, AdminDashboard, StudentDashboard, WelcomePage } from './pages';
import { MainLayout } from './layouts';

// Shared components & pages
import { ProtectedRoute, Navbar } from './shared/components';
import { UnauthorizedPage, NotFoundPage } from './shared/pages';
import { DashboardLayout } from './shared/layouts';
import { useAuthStore } from './shared/store/authStore';

/**
 * App Component - Root component với React Router setup
 */
function App() {
  const { restoreAuth, isLoading } = useAuthStore();

  // Restore auth state from localStorage on app mount
  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  // Loading state khi khôi phục auth
  if (isLoading) {
    return (
      <ConfigProvider locale={viVN}>
        <div className="App" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh' 
        }}>
          <Spin />
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <div className="App">
          {/* Show Navbar for authenticated routes only */}
          <Routes>
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Error pages */}
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    <Route path="/not-found" element={<NotFoundPage />} />

                    {/* Protected routes - TEMPORARILY DISABLED FOR TESTING */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <AdminDashboard />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/student-dashboard"
                      element={
                        <ProtectedRoute requiredRole="STUDENT">
                          <DashboardLayout>
                            <StudentDashboard />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Courses Management Routes */}
                    <Route
                      path="/courses"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <CoursesListPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/courses/create"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <CoursesFormPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/courses/:id/edit"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <CoursesFormPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Enrollments Management Routes */}
                    <Route
                      path="/enrollments"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <EnrollmentsListPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/enrollments/create"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <EnrollmentFormPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/enrollments/:id/edit"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <EnrollmentFormPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Users Management Routes */}
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <UsersListPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/users/create"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <UsersFormPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/users/:id/edit"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <UsersFormPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Mentors Management Routes */}
                    <Route
                      path="/mentors"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <MentorsListPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/mentors/create"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <MentorsFormPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/mentors/:id/edit"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <MentorsFormPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Semesters Management Routes */}
                    <Route
                      path="/semesters"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <SemestersListPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/semesters/create"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <SemestersFormPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/semesters/:id/edit"
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <DashboardLayout>
                            <SemestersFormPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Home page */}
                    <Route
                      path="/"
                      element={
                        <MainLayout>
                          <HomePage />
                        </MainLayout>
                      }
                    />

                    {/* Welcome page - after login */}
                    <Route
                      path="/welcome"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout>
                            <WelcomePage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Fallback route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
