import * as React from 'react';
import { AppSidebar } from './AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * AppLayout component wraps authenticated routes
 * Includes sidebar navigation and main content area
 * Supports sidebar collapse with localStorage persistence
 */
export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    const stored = localStorage.getItem('sidebar_collapsed');
    return stored === 'true';
  });

  React.useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
