import { cn } from '@/lib/utils';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarFooter } from './SidebarFooter';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Main sidebar component containing header, navigation, and footer
 */
export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        'border-r bg-card transition-all duration-300 flex flex-col h-full',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <SidebarHeader collapsed={collapsed} onToggle={onToggle} />
      <SidebarNavigation collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}

/**
 * Sidebar header with logo and collapse toggle
 */
interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-4">
      {!collapsed && <h1 className="text-xl font-bold text-primary">Learnix</h1>}
      <button
        onClick={onToggle}
        className="rounded-md p-2 hover:bg-accent transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '→' : '←'}
      </button>
    </div>
  );
}
