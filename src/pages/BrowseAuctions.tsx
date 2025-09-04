import { useState, useEffect } from "react";
import { Clock, Users, TrendingUp, Eye, Heart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentBid: number;
  endTime: Date;
  startTime: Date;
  duration: number; // in hours
  seller: string;
  status: 'live' | 'scheduled' | 'ended';
  category: string;
  bidCount: number;
  image: string;
  isWatchlisted?: boolean;
}

// Mock data
const mockAuctions: Auction[] = [
  {
    id: "1",
    title: "Vintage Rolex Submariner",
    description: "Rare 1960s Rolex Submariner in excellent condition with original box and papers.",
    startingPrice: 5000,
    currentBid: 8500,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // started 24 hours ago
    duration: 48,
    seller: "TimeCollector",
    status: 'live',
    category: "Jewelry & Watches",
    bidCount: 23,
    image: "/placeholder.svg",
    isWatchlisted: false
  },
  {
    id: "2", 
    title: "Original Picasso Sketch",
    description: "Authentic Pablo Picasso pencil sketch from his Blue Period, authenticated.",
    startingPrice: 15000,
    currentBid: 0,
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // starts in 2 days
    duration: 120,
    seller: "ArtGalleryNYC",
    status: 'scheduled',
    category: "Art & Collectibles",
    bidCount: 0,
    image: "/placeholder.svg",
    isWatchlisted: true
  },
  {
    id: "3",
    title: "1965 Ford Mustang Convertible",
    description: "Classic 1965 Ford Mustang convertible, fully restored with original V8 engine.",
    startingPrice: 25000,
    currentBid: 32000,
    endTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // ended 2 hours ago
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // started 7 days ago
    duration: 168,
    seller: "ClassicCars",
    status: 'ended',
    category: "Vehicles",
    bidCount: 45,
    image: "/placeholder.svg",
    isWatchlisted: false
  }
];

export default function BrowseAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>(mockAuctions);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>(mockAuctions);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("ending-soon");
  const navigate = useNavigate();

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

  const formatTimeRemaining = (endTime: Date, status: string) => {
    if (status === 'ended') return 'Auction ended';
    if (status === 'scheduled') return `Starts ${new Date(endTime).toLocaleDateString()}`;
    
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Auction ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }
    
    return `${hours}h ${minutes}m remaining`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'status-live';
      case 'scheduled': return 'status-scheduled';
      case 'ended': return 'status-ended';
      default: return '';
    }
  };

  const toggleWatchlist = (auctionId: string) => {
    setAuctions(prev => 
      prev.map(auction => 
        auction.id === auctionId 
          ? { ...auction, isWatchlisted: !auction.isWatchlisted }
          : auction
      )
    );
  };

  // Filter and sort auctions
  useEffect(() => {
    let filtered = auctions;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(auction => auction.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(auction => auction.category === categoryFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(auction =>
        auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.seller.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort auctions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ending-soon':
          return a.endTime.getTime() - b.endTime.getTime();
        case 'newest':
          return b.startTime.getTime() - a.startTime.getTime();
        case 'price-low':
          return (a.currentBid || a.startingPrice) - (b.currentBid || b.startingPrice);
        case 'price-high':
          return (b.currentBid || b.startingPrice) - (a.currentBid || a.startingPrice);
        case 'most-bids':
          return b.bidCount - a.bidCount;
        default:
          return 0;
      }
    });

    setFilteredAuctions(filtered);
  }, [auctions, statusFilter, categoryFilter, searchQuery, sortBy]);

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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAuctions.map((auction) => (
          <Card key={auction.id} className="card-elegant hover:card-glow transition-all duration-300 group cursor-pointer">
            <div onClick={() => navigate(`/auction/${auction.id}`)}>
              <div className="relative">
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className={`absolute top-2 left-2 ${getStatusColor(auction.status)}`}>
                  {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWatchlist(auction.id);
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 ${auction.isWatchlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </Button>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {auction.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {auction.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current bid:</span>
                    <span className="font-semibold text-primary">
                      ${auction.currentBid > 0 ? auction.currentBid.toLocaleString() : auction.startingPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{auction.bidCount} bids</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeRemaining(auction.endTime, auction.status)}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Seller: {auction.seller}
                  </p>
                </div>
              </CardContent>
            </div>

            <CardFooter className="p-4 pt-0">
              <div className="flex gap-2 w-full">
                <Button 
                  size="sm" 
                  className="flex-1 btn-hero"
                  onClick={() => navigate(`/auction/${auction.id}`)}
                  disabled={auction.status === 'ended'}
                >
                  {auction.status === 'live' ? 'Bid Now' : 
                   auction.status === 'scheduled' ? 'View Details' : 
                   'View Results'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/auction/${auction.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

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