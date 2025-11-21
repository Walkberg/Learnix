import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type ChatRole = 'ai' | 'user';
export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string;
}

type ShortenedCourse = {
  id: string;
  title: string;
  emoji: string;
};

interface ChatContextValue {
  messages: ChatMessage[];
  selectedCourse?: ShortenedCourse | null;
  setSelectedCourse: (c: ShortenedCourse | null) => void;
  sendMessage: (text: string) => Promise<void>;
  clear: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const MOCK_RESPONSES = [
  'Bonne question — voici une explication courte et utile.',
  'Tu pourrais commencer par réviser le chapitre 2, la partie sur les bases.',
  'Voici une idée: applique cet exemple sur un cas concret et reviens me dire ce que ça donne.',
  "Intéressant ! Pense à relier cette notion avec l'exemple précédent du module.",
];

function pickMockResponse() {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
}

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    title: string;
    emoji: string;
  } | null>(null);

  useEffect(() => {
    const greeting = `Ravi de t'aider à éclaircir les mystères de ton cours. Je suis entraîné et spécialisé sur celui-ci, pose-moi tes questions !\n\nPar quoi veux-tu commencer ?`;
    const msg: ChatMessage = {
      id: uuidv4(),
      role: 'ai',
      text: greeting,
      timestamp: new Date().toISOString(),
    };
    setMessages([msg]);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text || !text.trim()) return;
    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);

    // simulate network delay and mock response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: uuidv4(),
        role: 'ai',
        text: pickMockResponse(),
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, aiMsg]);
    }, 700 + Math.random() * 800);
  };

  const clear = () => setMessages([]);

  const value = useMemo(
    () => ({ messages, selectedCourse, setSelectedCourse, sendMessage, clear }),
    [messages, selectedCourse]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};

export default ChatProvider;
