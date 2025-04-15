
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
  AlertTriangle,
  UserCircle,
  Building
} from 'lucide-react';
import { UserRole } from '@/types';

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
          ? "bg-primary text-primary-foreground shadow-md" 
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
        !open && "justify-center px-2",
        "group transform transition-transform duration-200 hover:translate-x-1"
      )}
    >
      <Icon className={cn("h-5 w-5", !open && "h-6 w-6")} />
      {open && <span>{label}</span>}
      {!open && (
        <span className="absolute left-full rounded-md bg-primary text-primary-foreground px-2 py-1 ml-2 text-xs invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50">
          {label}
        </span>
      )}
    </NavLink>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const { user, logout } = useAuth();

  const links = [
    { to: '/', icon: Home, label: 'Dashboard', showFor: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN] },
    { to: '/trains', icon: Train, label: 'Trains', showFor: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN] },
    { to: '/tasks', icon: ClipboardList, label: 'Tasks', showFor: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN] },
    { to: '/maintenance', icon: Calendar, label: 'Maintenance', showFor: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER] },
    { to: '/staff', icon: Users, label: 'Staff', showFor: [UserRole.DEPOT_INCHARGE] },
    { to: '/activities', icon: Activity, label: 'Activities', showFor: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER] },
    { to: '/issues', icon: AlertTriangle, label: 'Issues', showFor: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN] },
    { to: '/projects', icon: Building, label: 'Projects', showFor: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER] },
    { to: '/analytics', icon: BarChart, label: 'Analytics', showFor: [UserRole.DEPOT_INCHARGE] },
    { to: '/profile', icon: UserCircle, label: 'Profile', showFor: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN] },
    { to: '/settings', icon: Settings, label: 'Settings', showFor: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN] }
  ];

  const filteredLinks = links.filter(link => 
    link.showFor.includes(user?.role as UserRole)
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
            <Train className="h-6 w-6 text-primary animate-pulse" />
            <span className="ml-2 text-lg font-semibold text-sidebar-foreground">Metro Project Review</span>
          </div>
        ) : (
          <Train className="h-6 w-6 mx-auto text-primary animate-pulse" />
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
            "w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:translate-x-1 transform transition-transform duration-200",
            !open && "justify-center"
          )}
          onClick={logout}
        >
          <LogOut className={cn("h-5 w-5", !open && "h-6 w-6")} />
          {open && <span className="ml-2">Logout</span>}
          {!open && (
            <span className="absolute left-full rounded-md bg-red-500 text-white px-2 py-1 ml-2 text-xs invisible opacity-0 -translate-x-3 transition-all hover:visible hover:opacity-100 hover:translate-x-0 z-50">
              Logout
            </span>
          )}
        </Button>
      </div>
    </aside>
  );
};
