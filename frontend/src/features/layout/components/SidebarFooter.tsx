import { User, LogOut, Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { cn } from '@/lib/utils';

interface SidebarFooterProps {
  collapsed: boolean;
}

/**
 * Sidebar footer with user profile
 */
export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  return (
    <div className="border-t p-4">
      {collapsed ? (
        <UserProfileButton collapsed={collapsed} />
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">User</span>
              <span className="text-xs text-muted-foreground">Free Plan</span>
            </div>
          </div>
          <UserProfileButton collapsed={collapsed} />
        </div>
      )}
    </div>
  );
}

interface UserProfileButtonProps {
  collapsed: boolean;
}

/**
 * User profile button with popover menu
 */
export function UserProfileButton({ collapsed }: UserProfileButtonProps) {
  return (
    <UserProfilePopover collapsed={collapsed}>
      <Button
        variant="ghost"
        size={collapsed ? 'icon' : 'sm'}
        className={cn('h-8', collapsed ? 'w-8' : 'w-8')}
      >
        {collapsed ? <User className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
      </Button>
    </UserProfilePopover>
  );
}

interface UserProfilePopoverProps {
  children: React.ReactNode;
  collapsed: boolean;
}

/**
 * Popover menu for user profile actions
 */
export function UserProfilePopover({ children, collapsed }: UserProfilePopoverProps) {
  const handleLogout = () => {
    // TODO: Implement logout in T914 with AuthProvider
    console.log('Logout clicked');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-56" align={collapsed ? 'end' : 'start'} side="top">
        <div className="space-y-1">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">User Account</p>
            <p className="text-xs text-muted-foreground">user@example.com</p>
          </div>

          <Separator />

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => console.log('Settings clicked')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
