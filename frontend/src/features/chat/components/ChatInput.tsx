import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useChat } from '../providers/ChatProvider';

export default function ChatInput() {
  const { sendMessage } = useChat();
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    const t = text;
    setText('');
    await sendMessage(t);
    inputRef.current?.focus();
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 rounded-full  border-3 px-6 py-2 focus-within:border-emerald-400">
        <input
          ref={inputRef}
          className="flex-1 outline-none"
          placeholder="pose moi une question sur ton cours"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
        />
        <button
          onClick={() => void handleSend()}
          disabled={!text.trim()}
          className={`p-2 rounded-full bg-emerald-500 text-white`}
          aria-label="Envoyer"
        >
          <ArrowUp color="white" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
