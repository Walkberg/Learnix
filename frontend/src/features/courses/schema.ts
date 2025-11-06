import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(3).max(100),
  sourceText: z.string().min(10),
  emoji: z.string().emoji().optional(),
});
