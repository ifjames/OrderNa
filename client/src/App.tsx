import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { NotificationContainer, useNotifications } from "@/components/ui/notification";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { initializeSampleData } from "@/lib/firebase";
import { useEffect } from "react";

// Pages
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Cart from "@/pages/Cart";
import Orders from "@/pages/Orders";
import StaffDashboard from "@/pages/StaffDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Login from "@/pages/Login";
import TermsOfService from "@/pages/TermsOfService";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { user, loading } = useAuth();
  const { notifications } = useNotifications();
  
  // Remove automatic sample data initialization to prevent permission errors

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <NotificationContainer notifications={notifications} />
      
      {user ? (
        // Authenticated user routes
        <>
          <Navigation />
          <Switch>
            {/* Root redirect based on role */}
            <Route path="/" component={user.role === 'admin' ? AdminDashboard : user.role === 'staff' ? StaffDashboard : Home} />
            
            {/* Common authenticated routes */}
            <Route path="/home" component={Home} />
            <Route path="/menu" component={Menu} />
            <Route path="/cart" component={Cart} />
            <Route path="/orders" component={Orders} />
            <Route path="/orders/:id" component={Orders} />
            <Route path="/profile" component={Profile} />
            
            {/* Staff routes */}
            {(user.role === 'staff' || user.role === 'admin') && (
              <Route path="/staff" component={StaffDashboard} />
            )}
            
            {/* Admin routes */}
            {user.role === 'admin' && (
              <Route path="/admin" component={AdminDashboard} />
            )}
            
            {/* Fallback to 404 for authenticated users */}
            <Route component={NotFound} />
          </Switch>
        </>
      ) : (
        // Public routes for non-authenticated users
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/terms" component={TermsOfService} />
          
          {/* Fallback to 404 for public users */}
          <Route component={NotFound} />
        </Switch>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
