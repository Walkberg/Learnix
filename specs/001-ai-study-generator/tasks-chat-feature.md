# Feature: Course Chat — tasks

This document lists concrete implementation tasks to add an in-course chat feature (provider-driven, mock API, message list, course picker and input). All tasks follow the required checklist format.

Phase 1: Setup & Provider

- [X] T024 Create `frontend/src/features/chat/providers/ChatProvider.tsx` to manage messages, selected course, and sendMessage (mock API). Expose `useChat()` hook.

Phase 2: UI Components (parallelizable)

- [X] T025 [P] Create `frontend/src/features/chat/components/ChatCard.tsx` — top-level card with chat icon + label "Chat" and layout container for picker, messages and input.
- [X] T026 [P] Create `frontend/src/features/chat/components/CoursePicker.tsx` — course selector dropdown wired to `useChat().selectedCourse`.
- [X] T027 [P] Create `frontend/src/features/chat/components/ChatBubble.tsx` — message bubble component (left = AI, right = user) with text and optional timestamp. Ensure consistent spacing and colors.
- [X] T028 [P] Create `frontend/src/features/chat/components/ChatInput.tsx` — input area with placeholder `pose moi une question sur ton cours`, a green send button on the right with an up-arrow icon (no text). On focus/click the input border becomes green.

Phase 3: Page composition & flow

- [X] T029 Implement `frontend/src/features/chat/pages/ChatPage.tsx` — compose `ChatCard`, `CoursePicker`, message list (maps messages -> `ChatBubble`) and `ChatInput`. Wrap the page with `ChatProvider`.
- [X] T030 [US?] Implement initial AI greeting in `ChatProvider` when the provider initializes: "Ravi de t'aider à éclaircir les mystères de ton cours. Je suis entraîné et spécialisé sur celui-ci, pose-moi tes questions !\n\nPar quoi veux-tu commencer ?"
- [X] T031 Implement `ChatProvider.sendMessage` flow: when user sends a message, append user message to state; call a mock responder that picks a random prewritten answer and append the AI response after a short delay to simulate network latency. File: `frontend/src/features/chat/providers/ChatProvider.tsx`.

Phase 4: Interactions & polish

- [X] T032 Ensure the send button is disabled when the input is empty, and becomes enabled when the user types. On send, input clears and refocuses.
- [X] T033 Style the input container: rounded border, placeholder text, send button with green background and an arrow icon; when input is focused or clicked the border color becomes green.
- [X] T034 Make the message list accessible: role="log" and `aria-live="polite"` for new AI messages.

Phase 5: Optional testing & docs

- [X] T035 [P] Add unit tests for `ChatProvider` and `ChatInput` in `frontend/src/features/chat/__tests__` to assert message flow, mock responder, and UI disabled/enabled states.
- [X] T036 Add documentation `specs/001-ai-study-generator/tasks-chat-feature.md` (this file) and usage notes: how to run locally and how to mock responses.

Dependencies

- `T024` (provider) must be completed before `T029`, `T030` and `T031`.
- Components `T025`-`T028` are parallelizable and can be implemented concurrently.
- `T031` (send flow) depends on `T028` (ChatInput) and `T027` (ChatBubble) being functionally available.

Counts & summary

- Total new tasks: 13 (T024..T036)
- Parallel opportunities: `T025`, `T026`, `T027`, `T028`, and `T035` are marked [P] as they can be implemented independently.
- Suggested MVP scope: Implement `T024`, `T025`, `T027`, `T028`, `T029`, `T031`, and `T030` so users can open the chat, see the initial AI message, type a question, and receive a mocked reply.


Implementation notes & examples

- Mock responder example (to put in `ChatProvider`):

  const MOCK_RESPONSES = [
    "Bonne question — voici une explication courte...",
    "Tu pourrais commencer par réviser le chapitre 2, la partie sur les bases.",
    "Voici une idée: applique cet exemple sur un cas concret...",
  ];

  function pickMockResponse(){
    return MOCK_RESPONSES[Math.floor(Math.random()*MOCK_RESPONSES.length)];
  }

- Input send button: use an icon from `lucide-react` such as `ArrowUp` and style: green background `bg-emerald-500`, white icon, rounded.

If you want, I can start implementing these tasks in the codebase now — which task should I pick first? (Recommended: I start with `T024` provider and `T028` input so the message flow can be wired quickly.)
