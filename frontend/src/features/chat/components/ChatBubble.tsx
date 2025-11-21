import React from 'react';
import type { ChatMessage } from '../providers/ChatProvider';

export default function ChatBubble({ message }: { message: ChatMessage }) {
  const isAI = message.role === 'ai';
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg my-1 border ${
          isAI ? 'bg-slate-50 border-slate-100' : 'bg-emerald-50 border-emerald-200'
        }`}
      >
        <div className="whitespace-pre-wrap text-sm">{message.text}</div>
        <div className="text-xs text-muted-foreground mt-1 text-right">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
