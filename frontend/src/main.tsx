import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './app/router.tsx';
import { AuthProvider } from './features/auth/providers/auth-provider';
import { CoursesProvider } from './features/courses/providers/courses-provider';
import { QuizzesProvider } from './features/quizzes/providers/quizzes-provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CoursesProvider>
        <QuizzesProvider>
          <RouterProvider router={router} />
        </QuizzesProvider>
      </CoursesProvider>
    </AuthProvider>
  </StrictMode>
);
