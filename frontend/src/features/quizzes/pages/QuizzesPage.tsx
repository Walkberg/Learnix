import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import QuizListToolbar from '../components/QuizListToolbar';
import QuizGrid from '../components/QuizGrid';
import { useQuizzes } from '../providers/quizzes-provider';
import { useQuizCreate } from '../providers/quiz-create-provider';

export function QuizzesPage() {
  const { quizzes, deleteQuiz } = useQuizzes();
  const { openDialog } = useQuizCreate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuizzes = searchQuery
    ? quizzes.filter((quiz) => {
        const title = quiz.params
          ? `Quiz ${quiz.params.types?.[0] === 'OPEN' ? 'Ouvert' : 'QCM'} (${
              quiz.params.count
            } questions)`
          : `Quiz - ${quiz.id.substring(0, 8)}`;
        return title.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : quizzes;

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader title="Mes quiz" count={quizzes.length} />
      <QuizListToolbar searchValue={searchQuery} onSearch={setSearchQuery} onAddQuiz={openDialog} />
      <QuizGrid quizzes={filteredQuizzes} onDeleteQuiz={deleteQuiz} />
    </div>
  );
}

export default QuizzesPage;
