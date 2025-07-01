import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { NotificationContainer, useNotifications } from "@/components/ui/notification";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
import NotFound from "@/pages/not-found";

function AppContent() {
  const { user, loading } = useAuth();
  const { notifications } = useNotifications();

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
      
      <Switch>
        {/* Public routes */}
        <Route path="/" component={user ? (user.role === 'admin' ? AdminDashboard : user.role === 'staff' ? StaffDashboard : Home) : Landing} />
        <Route path="/login" component={Login} />
        <Route path="/terms" component={TermsOfService} />
        
        {/* Protected routes - only show if user is logged in */}
        {user && (
          <>
            <Navigation />
            <Route path="/home" component={Home} />
            <Route path="/menu" component={Menu} />
            <Route path="/cart" component={Cart} />
            <Route path="/orders" component={Orders} />
            <Route path="/orders/:id" component={Orders} />
            
            {/* Staff routes */}
            {(user.role === 'staff' || user.role === 'admin') && (
              <Route path="/staff" component={StaffDashboard} />
            )}
            
            {/* Admin routes */}
            {user.role === 'admin' && (
              <Route path="/admin" component={AdminDashboard} />
            )}
          </>
        )}
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
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
