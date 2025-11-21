// no default React import required with new JSX runtime
import { useQuizAttempt } from '../providers/quiz-attempt-provider';
import OptionSquare from './OptionSquare';
import type { QuizQuestionMCQ } from '../types';

export default function AnswerGrid() {
  const { questions, current, answers, handleSelectOption } = useQuizAttempt();
  const currentQuestion = questions[current];

  if (!currentQuestion) return null;

  if (currentQuestion.type === 'MCQ') {
    const mcq = currentQuestion as QuizQuestionMCQ;
    const answered = answers[current];
    const isAnswered = answered?.selected != null;

    return (
      <div className="grid grid-cols-2 gap-3">
        {mcq.options.map((option, i) => (
          <OptionSquare
            key={i}
            text={`${getQuestionLetter(i)}${option}`}
            isAnswered={!!isAnswered}
            isSelected={answered?.selected === i}
            isCorrect={i === mcq.correctAnswer}
            onClick={() => handleSelectOption(i)}
            disabled={!!isAnswered}
          />
        ))}
      </div>
    );
  }

  // OPEN question
  return (
    <div className="col-span-2">
      <textarea className="w-full p-3 border rounded" rows={4} />
    </div>
  );
}

const getQuestionLetter = (index: number) => {
  return `${String.fromCharCode(65 + index).toUpperCase()}. `;
};
