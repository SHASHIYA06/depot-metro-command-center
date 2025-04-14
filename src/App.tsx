
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
              <Route path="/trains" element={<Dashboard />} /> {/* Placeholder */}
              <Route path="/tasks" element={<Dashboard />} /> {/* Placeholder */}
              <Route path="/maintenance" element={<Dashboard />} /> {/* Placeholder */}
              <Route path="/staff" element={<Dashboard />} /> {/* Placeholder */}
              <Route path="/activities" element={<Dashboard />} /> {/* Placeholder */}
              <Route path="/issues" element={<Dashboard />} /> {/* Placeholder */}
              <Route path="/analytics" element={<Dashboard />} /> {/* Placeholder */}
              <Route path="/profile" element={<Dashboard />} /> {/* Placeholder */}
              <Route path="/settings" element={<Dashboard />} /> {/* Placeholder */}
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
