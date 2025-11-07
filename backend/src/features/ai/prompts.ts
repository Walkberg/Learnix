export const summaryPrompt = (
  content: string,
  pointCount = 5,
) => `You are a study helper assistant.
Given the following content, produce a JSON object with the following keys:
- "title": a short title (max 6 words) summarizing the topic
- "emoji": a single emoji that represents the topic
- "summary": a string containing exactly ${pointCount} key points separated by "\\n". Each point must start with "* ".
All the text MUST be in the french language.
Requirements:
- Return ONLY valid JSON (no explanations, no extra text).
- Keep values concise. The "summary" field should be human-readable bullet points.
- All the text MUST be in the french language.
- Create several sections, each with an important keyword and by theme.

Content:
${content}`;

export const flashcardsPrompt = (
  content: string,
  count = 10,
) => `You are a study helper assistant.
From the following content, generate exactly ${count} flashcards.
Return a JSON array of objects. Each object must have these keys: "question" (string) and "answer" (string). All the text MUST be in the french language.

Requirements:
- Return ONLY valid JSON (no surrounding text).
- The questions should test understanding of important concepts from the content.
- All the text MUST be in the french language.
- The questions should be clear and concise (max 9 words).
- The responses should be short, accurate and relevant.

Content:
${content}`;

export const quizPrompt = (
  content: string,
  count = 5,
  type: 'mcq' | 'open' = 'mcq',
) =>
  type === 'mcq'
    ? `You are a study helper assistant. Create a JSON array of exactly ${count} multiple-choice questions from the content.
Each question object must contain: "question" (string), "options" (array of 4 strings), "correctAnswer" (integer index 0-3), and "explanation" (a short, concise explanation of why this is the correct answer, max 10 words).

Requirements:
- Return ONLY valid JSON (no extra text).
- All the text MUST be in the french language.
- The explanation should be clear and help the learner understand the concept.

Content:
${content}`
    : `You are a study helper assistant. Create a JSON array of exactly ${count} open-ended questions from the content.
Each question object must contain: "question" (string), "answer" (string a brief answer mostly one word and max 3 words), and "explanation" (a short, concise explanation helping understand the answer, max 10 words).

Requirements:
- Return ONLY valid JSON (no extra text).
- All the text MUST be in the french language.
- The explanation should provide additional context or reasoning.

Content:
${content}`;

export default {
  summaryPrompt,
  flashcardsPrompt,
  quizPrompt,
};
