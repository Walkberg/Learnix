import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Brain, MessageSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavigationProps {
  collapsed: boolean;
}

const navigationItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/quizzes', icon: Brain, label: 'Quizzes' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

/**
 * Sidebar navigation menu
 */
export function SidebarNavigation({ collapsed }: SidebarNavigationProps) {
  return (
    <nav className="flex-1 space-y-1 p-2">
      {navigationItems.map((item) => (
        <SidebarNavItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          collapsed={collapsed}
        />
      ))}
    </nav>
  );
}

interface SidebarNavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  collapsed: boolean;
}

/**
 * Individual navigation item
 */
export function SidebarNavItem({ to, icon: Icon, label, collapsed }: SidebarNavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isActive && 'bg-accent text-accent-foreground',
          collapsed && 'justify-center'
        )
      }
      title={collapsed ? label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}
