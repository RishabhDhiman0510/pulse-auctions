import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  const isAuthenticated = !!user;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Don't show sidebar on auth page or home page
  const showSidebar = isAuthenticated && location.pathname !== "/" && location.pathname !== "/auth";
  const showSearch = isAuthenticated && location.pathname !== "/" && location.pathname !== "/auth";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        isAuthenticated={isAuthenticated}
        onToggleSidebar={toggleSidebar}
        showSearch={showSearch}
      />
      
      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={closeSidebar}
          />
        )}
        
        <main 
          className={`flex-1 ${showSidebar ? 'md:ml-80' : ''} transition-all duration-300`}
          onClick={closeSidebar}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}