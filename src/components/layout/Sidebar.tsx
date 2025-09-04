import { useState } from "react";
import { 
  Home, 
  Gavel, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  Star,
  Grid,
  User,
  X
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Browse Auctions", href: "/auctions", icon: Gavel },
  { name: "My Auctions", href: "/my-auctions", icon: User },
  { name: "Watchlist", href: "/watchlist", icon: Star },
];

const categoryItems = [
  { name: "Live Auctions", href: "/auctions?status=live", icon: TrendingUp, color: "text-auction-live" },
  { name: "Scheduled", href: "/auctions?status=scheduled", icon: Clock, color: "text-auction-scheduled" },
  { name: "Ended", href: "/auctions?status=ended", icon: CheckCircle, color: "text-auction-ended" },
];

const categories = [
  "Art & Collectibles",
  "Electronics",
  "Jewelry & Watches",
  "Vehicles",
  "Real Estate",
  "Antiques",
  "Fashion",
  "Books & Manuscripts"
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic
    localStorage.removeItem("auth-token");
    navigate("/");
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-80 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <h2 className="text-lg font-semibold text-sidebar-foreground">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Main Navigation */}
            <div>
              <h3 className="text-sm font-medium text-sidebar-foreground/70 mb-3">Navigation</h3>
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <Separator className="bg-sidebar-border" />

            {/* Auction Status */}
            <div>
              <h3 className="text-sm font-medium text-sidebar-foreground/70 mb-3">Auction Status</h3>
              <nav className="space-y-1">
                {categoryItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )
                    }
                  >
                    <item.icon className={cn("h-5 w-5", item.color)} />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <Separator className="bg-sidebar-border" />

            {/* Categories */}
            <div>
              <button
                onClick={() => setExpandedCategories(!expandedCategories)}
                className="flex items-center justify-between w-full text-sm font-medium text-sidebar-foreground/70 mb-3 hover:text-sidebar-foreground transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", expandedCategories && "rotate-180")} />
              </button>
              
              {expandedCategories && (
                <nav className="space-y-1">
                  {categories.map((category) => (
                    <NavLink
                      key={category}
                      to={`/auctions?category=${encodeURIComponent(category.toLowerCase())}`}
                      onClick={onClose}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                    >
                      <Grid className="h-4 w-4" />
                      <span className="text-sm">{category}</span>
                    </NavLink>
                  ))}
                </nav>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <NavLink
              to="/settings"
              onClick={onClose}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </NavLink>
            
            <NavLink
              to="/help"
              onClick={onClose}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
              <span>Help</span>
            </NavLink>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}