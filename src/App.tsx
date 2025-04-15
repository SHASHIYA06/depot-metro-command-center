
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import NotFound from "./pages/NotFound";
import Issues from "./pages/Issues";
import Profile from "./pages/Profile";
import Staff from "./pages/Staff";
import Tasks from "./pages/Tasks";
import Maintenance from "./pages/Maintenance";
import Activities from "./pages/Activities";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/trains" element={<Dashboard />} /> {/* Still using Dashboard as placeholder */}
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/issues" element={<Issues />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Dashboard />} /> {/* Still using Dashboard as placeholder */}
            </Route>
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
