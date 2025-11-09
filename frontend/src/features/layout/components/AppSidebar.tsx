import {
  Sidebar,
  SidebarContent,
  SidebarFooter as ShadcnSidebarFooter,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarFooter } from './SidebarFooter';

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <ShadcnSidebarFooter>
        <SidebarFooter />
      </ShadcnSidebarFooter>
    </Sidebar>
  );
}

/**
 * Sidebar header with logo and collapse toggle
 */
export function SidebarHeader() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <ShadcnSidebarHeader className="flex flex-row items-center justify-between border-b p-4">
      {!isCollapsed && <h1 className="text-xl font-bold text-primary">Learnix</h1>}
      <SidebarTrigger />
    </ShadcnSidebarHeader>
  );
}
