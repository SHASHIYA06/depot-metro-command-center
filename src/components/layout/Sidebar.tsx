
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  LayoutDashboard,
  ClipboardCheck,
  AlertCircle,
  Wrench,
  CalendarDays,
  Users,
  BarChart3,
  FolderKanban,
  Train,
  UserCheck,
  FileSpreadsheet,
  Cloud,
  FileText,
  Activity,
  Download,
  Tool,
  MapPin,
  LucideIcon
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  exact?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon: Icon,
  label,
  exact = false,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        cn(
          'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
          'hover:bg-accent hover:text-accent-foreground',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground'
        )
      }
    >
      <Icon className="h-5 w-5" />
      {!isMobile && <span>{label}</span>}
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Check user role for conditional rendering
  const canAccessStaff = user?.role === UserRole.DEPOT_INCHARGE;
  const canAccessAnalytics = user?.role === UserRole.DEPOT_INCHARGE || user?.role === UserRole.ENGINEER;
  
  return (
    <div className={cn(
      "border-r bg-background h-screen hidden md:block fixed",
      isMobile ? "w-14" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className={cn(
          "flex h-14 items-center border-b px-4",
          isMobile ? "justify-center" : "justify-between"
        )}>
          {!isMobile && (
            <NavLink to="/" className="flex items-center space-x-2">
              <Train className="h-6 w-6 text-metro-primary" />
              <span className="font-bold">Metro Depot</span>
            </NavLink>
          )}
          {isMobile && <Train className="h-6 w-6 text-metro-primary" />}
        </div>
        
        <ScrollArea className="flex-1 px-2 py-2">
          <div className="space-y-1">
            <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" exact />
            <SidebarLink to="/tasks" icon={ClipboardCheck} label="Tasks" />
            <SidebarLink to="/issues" icon={AlertCircle} label="Issues" />

            {/* Group maintenance items */}
            <div className="pt-2 pb-1">
              <p className="px-2 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                Maintenance
              </p>
            </div>
            <SidebarLink to="/maintenance" icon={Wrench} label="Maintenance" />
            <SidebarLink to="/maintenance-schedule" icon={CalendarDays} label="Maint. Schedule" />
            <SidebarLink to="/train-maintenance" icon={Wrench} label="Train Maintenance" />
            <SidebarLink to="/mp-tools" icon={Tool} label="M&P Tools" />

            {/* Group train items */}
            <div className="pt-2 pb-1">
              <p className="px-2 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                Train Management
              </p>
            </div>
            <SidebarLink to="/train-location" icon={MapPin} label="Train Location" />
            <SidebarLink to="/train-commissioning" icon={Train} label="Commissioning" />

            {/* Group activities */}
            <div className="pt-2 pb-1">
              <p className="px-2 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                Activities
              </p>
            </div>
            <SidebarLink to="/daily-activities" icon={FileSpreadsheet} label="Daily Activities" />
            <SidebarLink to="/activities" icon={Activity} label="Activity Logs" />
            
            {/* Group staff items */}
            {canAccessStaff && (
              <>
                <div className="pt-2 pb-1">
                  <p className="px-2 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                    Staff Management
                  </p>
                </div>
                <SidebarLink to="/staff" icon={Users} label="Staff" />
                <SidebarLink to="/staff-attendance" icon={UserCheck} label="Staff Attendance" />
              </>
            )}
            
            {/* Group reporting */}
            <div className="pt-2 pb-1">
              <p className="px-2 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                Reporting
              </p>
            </div>
            {canAccessAnalytics && (
              <SidebarLink to="/analytics" icon={BarChart3} label="Analytics" />
            )}
            <SidebarLink to="/projects" icon={FolderKanban} label="Projects" />
            <SidebarLink to="/reports" icon={FileText} label="Reports" />
            <SidebarLink to="/exports" icon={Download} label="Data Exports" />
            <SidebarLink to="/backup" icon={Cloud} label="Backup" />
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <NavLink to="/profile">
            <Button variant="ghost" className="w-full justify-start">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  {user?.name.charAt(0)}
                </div>
                {!isMobile && (
                  <div className="ml-2 text-left">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.role.replace('_', ' ')}
                    </p>
                  </div>
                )}
              </div>
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
