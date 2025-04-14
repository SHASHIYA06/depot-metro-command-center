
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Calendar, 
  ClipboardList, 
  Settings, 
  Train, 
  Users, 
  Home,
  BarChart,
  LogOut,
  Menu,
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  open: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, open }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
        !open && "justify-center px-2"
      )}
    >
      <Icon className={cn("h-5 w-5", !open && "h-6 w-6")} />
      {open && <span>{label}</span>}
    </NavLink>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const { user, logout } = useAuth();

  const links = [
    { to: '/', icon: Home, label: 'Dashboard', showFor: ['depot_incharge', 'engineer', 'technician'] },
    { to: '/trains', icon: Train, label: 'Trains', showFor: ['depot_incharge', 'engineer', 'technician'] },
    { to: '/tasks', icon: ClipboardList, label: 'Tasks', showFor: ['depot_incharge', 'engineer', 'technician'] },
    { to: '/maintenance', icon: Calendar, label: 'Maintenance', showFor: ['depot_incharge', 'engineer'] },
    { to: '/staff', icon: Users, label: 'Staff', showFor: ['depot_incharge'] },
    { to: '/activities', icon: Activity, label: 'Activities', showFor: ['depot_incharge', 'engineer'] },
    { to: '/issues', icon: AlertTriangle, label: 'Issues', showFor: ['depot_incharge', 'engineer', 'technician'] },
    { to: '/analytics', icon: BarChart, label: 'Analytics', showFor: ['depot_incharge'] },
    { to: '/settings', icon: Settings, label: 'Settings', showFor: ['depot_incharge', 'engineer', 'technician'] }
  ];

  const filteredLinks = links.filter(link => 
    link.showFor.includes(user?.role as any)
  );

  return (
    <aside
      className={cn(
        "bg-sidebar flex-shrink-0 border-r border-sidebar-border transition-all duration-300 ease-in-out z-30",
        open ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {open ? (
          <div className="flex items-center">
            <Train className="h-6 w-6 text-sidebar-foreground" />
            <span className="ml-2 text-lg font-semibold text-sidebar-foreground">Metro Depot</span>
          </div>
        ) : (
          <Train className="h-6 w-6 mx-auto text-sidebar-foreground" />
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col gap-1 p-2">
        {filteredLinks.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            open={open}
          />
        ))}
      </div>

      <div className="mt-auto p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            !open && "justify-center"
          )}
          onClick={logout}
        >
          <LogOut className={cn("h-5 w-5", !open && "h-6 w-6")} />
          {open && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};
