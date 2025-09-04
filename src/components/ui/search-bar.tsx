import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ placeholder = "Search auctions...", onSearch }: SearchBarProps) {
  return (
    <div className="relative flex-1 max-w-lg mx-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder={placeholder}
        className="pl-10 pr-4 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-300"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  );
}