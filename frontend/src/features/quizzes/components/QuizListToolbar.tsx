import { SearchBar } from '@/components/SearchBar';
import { AddQuizButton } from './AddQuizButton';

interface QuizListToolbarProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onAddQuiz: () => void;
}

export const QuizListToolbar = ({ searchValue, onSearch, onAddQuiz }: QuizListToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <SearchBar placeholder="Rechercher un quiz..." value={searchValue} onChange={onSearch} />
      <AddQuizButton onClick={onAddQuiz} />
    </div>
  );
};

export default QuizListToolbar;
