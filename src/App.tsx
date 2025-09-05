import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import BrowseAuctions from "./pages/BrowseAuctions";
import Dashboard from "./pages/Dashboard";
import AuctionDetails from "./pages/AuctionDetails";
import CreateAuction from "./pages/CreateAuction";
import MyAuctions from "./pages/MyAuctions";
import Watchlist from "./pages/Watchlist";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="auctions" element={<BrowseAuctions />} />
              <Route path="auction/:id" element={<AuctionDetails />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="create-auction" element={<CreateAuction />} />
              <Route path="my-auctions" element={<MyAuctions />} />
              <Route path="watchlist" element={<Watchlist />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
