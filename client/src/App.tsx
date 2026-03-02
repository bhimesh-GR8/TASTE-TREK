import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";

import Home from "@/pages/Home";
import Countries from "@/pages/Countries";
import CountryDetail from "@/pages/CountryDetail";
import DestinationDetail from "@/pages/DestinationDetail";
import Favorites from "@/pages/Favorites";
import { SignIn } from "@/pages/SignIn";

function Router() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {isAuthenticated ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/countries" component={Countries} />
          <Route path="/country/:id" component={CountryDetail} />
          <Route path="/destination/:id" component={DestinationDetail} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/sign-in" component={SignIn} />
        </>
      ) : (
        <>
          <Route path="/sign-in" component={SignIn} />
          <Route component={SignIn} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
