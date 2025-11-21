import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function ChatCard({ children }: { children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto p-4 ">
      <div className="flex justify-center rounded-full items-center gap-3 mb-4 bg-primary/10">
        <div className="w-10 h-10   flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>
      <div className="bg-card rounded-lg shadow-sm p-4">{children}</div>
    </div>
  );
}
