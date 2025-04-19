
import React, { useState, ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleCheckOut = () => {
    // In a real app this would record checkout time to DB
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeDecimal = hour + (minute / 60);
    
    // Show notification about checkout time
    // Between 17:40 (17.67) and 20:00 (20.0)
    if (timeDecimal >= 17.67 && timeDecimal <= 20.0) {
      alert('Checkout recorded for attendance tracking.');
    } else {
      alert(`Checkout time recorded: ${now.toLocaleTimeString()}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-metro-primary" />
        <span className="ml-2 text-xl">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block fixed inset-y-0 left-0 z-50 md:z-0 w-64 md:w-64`}
      >
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className={`flex flex-1 flex-col overflow-hidden ${sidebarOpen && !isMobile ? 'md:ml-64' : 'ml-0'}`}>
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

        {/* Mobile checkout button - fixed at bottom */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-2 flex justify-center">
            <Button onClick={handleCheckOut} className="w-full">
              Check Out / End Shift
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
