import { z } from 'zod';

// Keep ids stable for backend / API usage
const languageIds = ['fr', 'en', 'es', 'de', 'it'] as const;

export const languageSchema = z.object({
  id: z.enum(languageIds),
  label: z.string().min(2).max(40),
});

export const courseCreateSchema = z.object({
  sourceType: z.enum(['text', 'photo', 'document']),
  language: languageSchema,
  sourceText: z.string().min(100).max(50000),
});
