import QuickActionCard from './QuickActionCard';

type Action = {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
};

const QuickActionsSection = ({ actions }: { actions: Action[] }) => {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>
    </section>
  );
};

export default QuickActionsSection;
