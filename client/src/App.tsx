import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Countries from "@/pages/Countries";
import CountryDetail from "@/pages/CountryDetail";
import DestinationDetail from "@/pages/DestinationDetail";
import Favorites from "@/pages/Favorites";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/countries" component={Countries} />
      <Route path="/country/:id" component={CountryDetail} />
      <Route path="/destination/:id" component={DestinationDetail} />
      <Route path="/favorites" component={Favorites} />
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
