import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './app/router.tsx';
import { AuthProvider } from './features/auth/providers/auth-provider';
import { CoursesProvider } from './features/courses/providers/courses-provider';
import { CourseApiProvider } from './features/courses/providers/course-api-provider';
import { QuizzesProvider } from './features/quizzes/providers/quizzes-provider';
import { QuizApiProvider } from './features/quizzes/providers/quiz-api-provider';
import { FlashcardApiProvider } from './features/flashcards/providers/flashcard-api-provider';
import { CourseCreateProvider } from './features/courses/providers/course-create-provider';
import { QuizzCreateProvider } from './features/quizzes/providers/quiz-create-provider';
import { CourseCreationDialog } from './features/courses/components/CourseCreationDialog';
import { QuizzCreationDialog } from './features/quizzes/components/QuizzCreationDialog';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CourseApiProvider>
        <CoursesProvider>
          <QuizApiProvider>
            <QuizzesProvider>
              <FlashcardApiProvider>
                <CourseCreateProvider>
                  <QuizzCreateProvider>
                    <RouterProvider router={router} />
                    <CourseCreationDialog />
                    <QuizzCreationDialog />
                  </QuizzCreateProvider>
                </CourseCreateProvider>
              </FlashcardApiProvider>
            </QuizzesProvider>
          </QuizApiProvider>
        </CoursesProvider>
      </CourseApiProvider>
    </AuthProvider>
  </StrictMode>
);
