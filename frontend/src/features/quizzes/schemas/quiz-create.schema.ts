import { z } from 'zod';

export const quizCreateSchema = z.object({
  courseId: z.string().uuid(),
  exerciseType: z.enum(['MCQ', 'OPEN', 'FILL_BLANK']),
  answerCount: z.enum(['duo', 'trio', 'square']),
});
