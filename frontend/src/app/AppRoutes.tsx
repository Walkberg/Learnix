import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../features/layout/components/AppLayout';

// Placeholder components - will be implemented in later tasks
const LoginPage = () => <div>Login Page</div>;
const RegisterPage = () => <div>Register Page</div>;
const HomePage = () => <div>Home Page</div>;
const CoursesPage = () => <div>Courses Page</div>;
const CourseDetailPage = () => <div>Course Detail Page</div>;
const QuizzesPage = () => <div>All Quizzes Page</div>;
const QuizPlayerPage = () => <div>Quiz Player Page</div>;
const QuizResultsPage = () => <div>Quiz Results Page</div>;
const ChatPage = () => <div>Chat Page</div>;
const SettingsPage = () => <div>Settings Page</div>;

// ProtectedRoute guard - basic implementation
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO: integrate with AuthProvider in T914
  const isAuthenticated = true; // placeholder

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes wrapped in AppLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CoursesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:courseId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CourseDetailPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quizzes"
        element={
          <ProtectedRoute>
            <AppLayout>
              <QuizzesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quizzes/:quizId/play"
        element={
          <ProtectedRoute>
            <AppLayout>
              <QuizPlayerPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quizzes/:quizId/results"
        element={
          <ProtectedRoute>
            <AppLayout>
              <QuizResultsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ChatPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
