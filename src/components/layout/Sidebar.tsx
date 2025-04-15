import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ListTodo, 
  AlertCircle, 
  Settings, 
  Users, 
  History, 
  BarChart2, 
  Building,
  Train 
} from 'lucide-react';
import { UserRole } from '@/types';
import { useMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  label: string;
  icon: React.ComponentType<any>;
  to: string;
  activeOn: string[];
  roles: UserRole[];
}

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useMobile();
  
  // Define navigation items
  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      to: '/dashboard',
      activeOn: ['/dashboard'],
      roles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN],
    },
    {
      label: 'Tasks',
      icon: ListTodo,
      to: '/tasks',
      activeOn: ['/tasks'],
      roles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN],
    },
    {
      label: 'Issues',
      icon: AlertCircle,
      to: '/issues',
      activeOn: ['/issues'],
      roles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN],
    },
    {
      label: 'Maintenance',
      icon: Settings,
      to: '/maintenance',
      activeOn: ['/maintenance'],
      roles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN],
    },
    {
      label: 'Staff',
      icon: Users,
      to: '/staff',
      activeOn: ['/staff'],
      roles: [UserRole.DEPOT_INCHARGE],
    },
    {
      label: 'Activities',
      icon: History,
      to: '/activities',
      activeOn: ['/activities'],
      roles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER],
    },
    {
      label: 'Analytics',
      icon: BarChart2,
      to: '/analytics',
      activeOn: ['/analytics'],
      roles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER],
    },
    {
      label: 'Projects',
      icon: Building,
      to: '/projects',
      activeOn: ['/projects'],
      roles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER],
    },
    {
      label: 'Train Commissioning',
      icon: Train,
      to: '/train-commissioning',
      activeOn: ['/train-commissioning'],
      roles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER],
    },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role as UserRole));

  return (
    <div className={cn(
      "flex flex-col space-y-4 py-4",
      isMobile ? "border-r-0" : "border-r"
    )}>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Metro Depot
        </h2>
        <div className="space-y-1">
          {filteredNavItems.map((item) => (
            <NavItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              to={item.to}
              active={item.activeOn.some(path => location.pathname.startsWith(path))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  label: string;
  icon: React.ComponentType<any>;
  to: string;
  active: boolean;
}

const NavItem = ({ label, icon: Icon, to, active }: NavItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button
      className={cn(
        "group flex w-full items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-secondary hover:text-foreground",
        active ? "bg-secondary text-foreground" : "text-muted-foreground"
      )}
      onClick={handleClick}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
};
