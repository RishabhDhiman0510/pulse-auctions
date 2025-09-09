import { Gavel, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchBar } from "@/components/ui/search-bar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

interface HeaderProps {
  isAuthenticated?: boolean;
  onToggleSidebar?: () => void;
  showSearch?: boolean;
}

export function Header({ isAuthenticated = false, onToggleSidebar, showSearch = false }: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality
    console.log("Searching for:", query);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Gavel className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">AuctionHub</span>
          </Link>
        </div>

        {showSearch && isAuthenticated && (
          <SearchBar placeholder="Search auctions..." onSearch={handleSearch} />
        )}

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                className="relative"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                className="btn-hero"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}