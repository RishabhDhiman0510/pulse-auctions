import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("auth-token");
    setIsAuthenticated(!!token);
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Don't show sidebar on login page or home page
  const showSidebar = isAuthenticated && location.pathname !== "/" && location.pathname !== "/login";
  const showSearch = isAuthenticated && location.pathname !== "/" && location.pathname !== "/login";

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
        
        <main className={`flex-1 ${showSidebar ? 'md:ml-80' : ''} transition-all duration-300`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}