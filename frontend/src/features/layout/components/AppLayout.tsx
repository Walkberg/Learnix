import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Card } from '@/components/ui/card';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="ml-50 bg-gray-100">
          <Card className="container m-4 p-6">{children}</Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
