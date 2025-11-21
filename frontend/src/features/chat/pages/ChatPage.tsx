import ChatProvider, { useChat } from '../providers/ChatProvider';
import ChatCard from '../components/ChatCard';
import CoursePicker from '../components/CoursePicker';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';

function Inner() {
  const { messages } = useChat();
  return (
    <div>
      <CoursePicker />
      <div role="log" aria-live="polite" className="max-h-[60vh] overflow-auto space-y-2">
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
      </div>
      <ChatInput />
    </div>
  );
}

export function ChatPage() {
  return (
    <ChatProvider>
      <ChatCard>
        <Inner />
      </ChatCard>
    </ChatProvider>
  );
}
