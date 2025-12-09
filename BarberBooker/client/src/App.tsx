import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { UserProvider } from "@/lib/user-context";
import { BookingProvider } from "@/lib/booking-context";

// Pages
import Home from "@/pages/home";
import ShopDetails from "@/pages/shop-details";
import BarberDashboard from "@/pages/barber-dashboard";
import BarberOnboarding from "@/pages/barber-onboarding";
import BarberServices from "@/pages/barber-services";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminLogin from "@/pages/admin-login";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import CustomerProfile from "@/pages/customer-profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop/:id" component={ShopDetails} />
      <Route path="/barber" component={BarberDashboard} />
      <Route path="/barber-onboarding" component={BarberOnboarding} />
      <Route path="/barber-services" component={BarberServices} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/profile" component={CustomerProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BookingProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </BookingProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
