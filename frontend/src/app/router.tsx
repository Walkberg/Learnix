import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AppLayout } from '../features/layout/components/AppLayout';
import { requireAuth, requireGuest } from '../features/auth/utils/auth-guards';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import { HomePage } from '@/features/home/pages/HomePage';
import { CoursesListPage } from '@/features/courses/pages/CoursesListPage';

const CourseDetailPage = () => <div>Course Detail Page</div>;
const QuizzesPage = () => <div>All Quizzes Page</div>;
const QuizPlayerPage = () => <div>Quiz Player Page</div>;
const QuizResultsPage = () => <div>Quiz Results Page</div>;
const ChatPage = () => <div>Chat Page</div>;
const SettingsPage = () => <div>Settings Page</div>;

function ErrorBoundary() {
  return (
    <div>
      <h1>Oops! Something went wrong</h1>
      <p>Please try again or contact support if the problem persists.</p>
    </div>
  );
}

function ProtectedLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    loader: requireGuest,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    loader: requireGuest,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    loader: requireAuth,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'courses',
        children: [
          {
            index: true,
            element: <CoursesListPage />,
          },
          {
            path: ':courseId',
            element: <CourseDetailPage />,
          },
        ],
      },
      {
        path: 'quizzes',
        children: [
          {
            index: true,
            element: <QuizzesPage />,
          },
          {
            path: ':quizId/play',
            element: <QuizPlayerPage />,
          },
          {
            path: ':quizId/results',
            element: <QuizResultsPage />,
          },
        ],
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'settings/*',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
]);
