import { useState, useEffect } from "react";
import { TrendingUp, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuctions } from "@/hooks/useAuctions";
import { AuctionCard } from "@/components/auction/AuctionCard";


export default function BrowseAuctions() {
  const { auctions, loading, fetchAuctions } = useAuctions();
  const [filteredAuctions, setFilteredAuctions] = useState(auctions);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("ending-soon");

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

  // Filter and sort auctions
  useEffect(() => {
    fetchAuctions(statusFilter, categoryFilter, searchQuery);
  }, [statusFilter, categoryFilter, searchQuery]);

  useEffect(() => {
    let filtered = [...auctions];

    // Sort auctions
    filtered.sort((a, b) => {
      const aCurrentBid = a.current_highest_bid > 0 ? a.current_highest_bid : a.starting_price;
      const bCurrentBid = b.current_highest_bid > 0 ? b.current_highest_bid : b.starting_price;
      
      switch (sortBy) {
        case 'ending-soon':
          const aEndTime = new Date(a.go_live_at).getTime() + a.duration_minutes * 60 * 1000;
          const bEndTime = new Date(b.go_live_at).getTime() + b.duration_minutes * 60 * 1000;
          return aEndTime - bEndTime;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'price-low':
          return aCurrentBid - bCurrentBid;
        case 'price-high':
          return bCurrentBid - aCurrentBid;
        case 'most-bids':
          return b.bid_count - a.bid_count;
        default:
          return 0;
      }
    });

    setFilteredAuctions(filtered);
  }, [auctions, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse Auctions</h1>
        <p className="text-muted-foreground">
          Discover amazing items and place your bids on {auctions.length} active auctions
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="most-bids">Most Bids</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Auction Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-secondary/30 h-48 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-secondary/30 rounded w-3/4"></div>
                <div className="h-3 bg-secondary/30 rounded w-full"></div>
                <div className="h-3 bg-secondary/30 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}

      {filteredAuctions.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No auctions found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
}