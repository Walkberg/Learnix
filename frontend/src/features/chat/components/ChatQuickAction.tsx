import QuickActionCard from '@/features/home/components/QuickActionCard';

import { useNavigate } from 'react-router-dom';

export function ChatQuickAction() {
  const navigate = useNavigate();
  return (
    <QuickActionCard
      title="Réviser avec Learnix"
      description="Discute avec ton coach IA pour clarifier tes notions et consolider tes apprentissages."
      icon="💬"
      onClick={() => navigate('/chat')}
    />
  );
}
