
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import {
  Activity,
  CalendarDays,
  ClipboardCheck,
  Users,
  BarChart2,
  Building,
  FileText,
  Settings,
  User,
  Clock,
  Layers,
  Train,
  AlertTriangle,
  Wrench,
  MapPin,
  Download,
  Archive,
  Clipboard,
  LineChart,
} from "lucide-react";
import { useMobileMenuContext } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles?: UserRole[];
  submenu?: NavItem[];
  isActive?: boolean;
  isClosed?: boolean;
}

export function Sidebar({ className }: SidebarProps) {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenuContext();
  const location = useLocation();
  const { user } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location, setIsMobileMenuOpen]);

  // Determine if a nav item is active
  const isActive = (href: string, submenu?: NavItem[]) => {
    if (href === location.pathname) return true;
    
    // Check if any submenu items are active
    if (submenu) {
      return submenu.some(item => isActive(item.href));
    }
    
    return false;
  };

  // Sidebar nav items with roles
  const sidebarNav: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: BarChart2,
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: ClipboardCheck,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN],
    },
    {
      title: "Issues",
      href: "/issues",
      icon: AlertTriangle,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN],
    },
    {
      title: "Job Cards",
      href: "/job-cards",
      icon: Clipboard,
      submenu: [
        {
          title: "All Job Cards",
          href: "/job-cards",
          icon: Clipboard,
        },
        {
          title: "FRACAS Report",
          href: "/fracas-report",
          icon: LineChart,
        }
      ]
    },
    {
      title: "Maintenance",
      href: "/maintenance",
      icon: Wrench,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.TECHNICIAN],
      submenu: [
        {
          title: "Daily Schedule",
          href: "/maintenance-schedule",
          icon: CalendarDays,
        },
        {
          title: "Train Maintenance",
          href: "/train-maintenance",
          icon: Train,
        },
      ],
    },
    {
      title: "Train Tracking",
      href: "/train-location",
      icon: MapPin,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER],
    },
    {
      title: "Activities",
      href: "/activities",
      icon: Activity,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.DATA_ENTRY_OPERATOR],
      submenu: [
        {
          title: "Activity Log",
          href: "/activities",
          icon: Activity,
        },
        {
          title: "Daily Activities",
          href: "/daily-activities",
          icon: Clock,
        },
      ],
    },
    {
      title: "Staff",
      href: "/staff",
      icon: Users,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER],
      submenu: [
        {
          title: "Staff List",
          href: "/staff",
          icon: Users,
        },
        {
          title: "Attendance",
          href: "/staff-attendance",
          icon: ClipboardCheck,
        },
      ],
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart2,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER, UserRole.DATA_ENTRY_OPERATOR],
    },
    {
      title: "Projects",
      href: "/projects",
      icon: Building,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER],
    },
    {
      title: "Reports",
      href: "/reports",
      icon: FileText,
    },
    {
      title: "Data Export",
      href: "/exports",
      icon: Download,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.DATA_ENTRY_OPERATOR],
    },
    {
      title: "Materials",
      href: "/pending-materials",
      icon: Layers,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.STORE_PERSON],
    },
    {
      title: "Tools",
      href: "/mp-tools",
      icon: Wrench,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.STORE_PERSON],
    },
    {
      title: "Backup",
      href: "/backup",
      icon: Archive,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.DATA_ENTRY_OPERATOR],
    },
    {
      title: "Commissioning",
      href: "/train-commissioning",
      icon: Train,
      allowedRoles: [UserRole.DEPOT_INCHARGE, UserRole.ENGINEER],
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  // Filter nav items based on user role
  const filteredNav = sidebarNav.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(user?.role || UserRole.TECHNICIAN)
  );

  // Toggle submenu
  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(title);
    }
  };

  // Component for rendering nav items
  const SidebarNavItems = ({ navItems }: { navItems: NavItem[] }) => (
    <div className="flex flex-col gap-1">
      {navItems.map((item, index) => {
        const active = isActive(item.href, item.submenu);
        
        // If the item has a submenu
        if (item.submenu && item.submenu.length > 0) {
          const isExpanded = openSubmenu === item.title || 
            item.submenu.some(subItem => isActive(subItem.href));

          return (
            <div key={index}>
              <button
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 w-full text-sm transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50 hover:text-accent-foreground"
                )}
                onClick={() => toggleSubmenu(item.title)}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.title}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className={cn(
                  "ml-4 pl-2 border-l border-border mt-1 mb-1 overflow-hidden transition-all",
                  isExpanded ? "max-h-96" : "max-h-0"
                )}
              >
                <SidebarNavItems navItems={item.submenu} />
              </div>
            </div>
          );
        }

        // Regular nav item without submenu
        return (
          <Link
            key={index}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50 hover:text-accent-foreground"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </div>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div
      className={cn(
        "hidden md:block pb-12 w-[240px] sticky top-14 shrink-0 border-r overflow-y-auto h-[calc(100vh-56px)]", 
        className
      )}
    >
      <div className="py-4 px-4">
        <SidebarNavItems navItems={filteredNav} />
      </div>
    </div>
  );

  // Mobile sidebar (sheet)
  const MobileSidebar = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetContent side="left" className="w-[240px] sm:w-[240px] p-0">
        <ScrollArea className="h-full py-4 px-4">
          <SidebarNavItems navItems={filteredNav} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}

export default Sidebar;
