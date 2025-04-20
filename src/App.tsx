
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { AppLayout } from '@/components/layout/AppLayout';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Tasks from '@/pages/Tasks';
import Issues from '@/pages/Issues';
import Maintenance from '@/pages/Maintenance';
import MaintenanceSchedule from '@/pages/MaintenanceSchedule';
import Activities from '@/pages/Activities';
import DailyActivities from '@/pages/DailyActivities';
import Staff from '@/pages/Staff';
import StaffAttendance from '@/pages/StaffAttendance';
import Analytics from '@/pages/Analytics';
import Projects from '@/pages/Projects';
import Backup from '@/pages/Backup';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import TrainCommissioning from '@/pages/TrainCommissioning';
import Reports from '@/pages/Reports';
import TrainMaintenanceSchedule from '@/pages/TrainMaintenanceSchedule';
import MPTools from '@/pages/MPTools';
import TrainLocation from '@/pages/TrainLocation';
import Exports from '@/pages/Exports';
import PendingMaterials from '@/pages/PendingMaterials';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

// Root redirect component that checks auth state
const RootRedirect = () => {
  const { user } = useAuth();
  
  // If user is logged in, redirect to dashboard, otherwise to login
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

// App routes with layout
const AppRoutes = () => {
  const { user } = useAuth();

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/maintenance-schedule" element={<MaintenanceSchedule />} />
        <Route path="/train-maintenance" element={<TrainMaintenanceSchedule />} />
        <Route path="/train-location" element={<TrainLocation />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/daily-activities" element={<DailyActivities />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/staff-attendance" element={<StaffAttendance />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/exports" element={<Exports />} />
        <Route path="/pending-materials" element={<PendingMaterials />} />
        <Route path="/backup" element={<Backup />} />
        <Route path="/mp-tools" element={<MPTools />} />
        <Route path="/train-commissioning" element={<TrainCommissioning />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
