import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Heart, Clock, DollarSign, Users, Trash2, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WatchlistItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  endDate: string;
  status: "live" | "scheduled" | "ended";
  bidCount: number;
  image: string;
  seller: string;
  timeLeft: string;
}

const mockWatchlist: WatchlistItem[] = [
  {
    id: "1",
    title: "Vintage Gibson Les Paul Guitar",
    description: "1959 Gibson Les Paul Standard in pristine condition",
    currentBid: 25000,
    endDate: "2024-12-26T14:00:00",
    status: "live",
    bidCount: 42,
    image: "/placeholder.svg",
    seller: "VintageInstruments",
    timeLeft: "2d 5h"
  },
  {
    id: "2",
    title: "Rare Baseball Card Collection",
    description: "Complete set of 1952 Topps baseball cards",
    currentBid: 8500,
    endDate: "2024-12-28T20:00:00",
    status: "live",
    bidCount: 28,
    image: "/placeholder.svg",
    seller: "SportsCollector",
    timeLeft: "4d 11h"
  },
  {
    id: "3",
    title: "Contemporary Sculpture",
    description: "Modern bronze sculpture by acclaimed artist",
    currentBid: 0,
    endDate: "2024-12-30T16:00:00",
    status: "scheduled",
    bidCount: 0,
    image: "/placeholder.svg",
    seller: "ArtGalleryNYC",
    timeLeft: "Starting in 2d"
  },
  {
    id: "4",
    title: "Antique Pocket Watch",
    description: "18th century Swiss pocket watch with complications",
    currentBid: 1800,
    endDate: "2024-12-22T18:00:00",
    status: "ended",
    bidCount: 15,
    image: "/placeholder.svg",
    seller: "TimeKeepers",
    timeLeft: "Ended"
  }
];

export default function Watchlist() {
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlist, setWatchlist] = useState(mockWatchlist);
  const { toast } = useToast();

  const filteredWatchlist = watchlist.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFromWatchlist = (id: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Removed from watchlist",
      description: "The item has been removed from your watchlist.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="status-live">Live</Badge>;
      case "scheduled":
        return <Badge className="status-scheduled">Scheduled</Badge>;
      case "ended":
        return <Badge className="status-ended">Ended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const liveAuctions = watchlist.filter(item => item.status === "live").length;
  const scheduledAuctions = watchlist.filter(item => item.status === "scheduled").length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
        <p className="text-muted-foreground">Keep track of auctions you're interested in and never miss a bidding opportunity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-elegant">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{watchlist.length}</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elegant">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-auction-live" />
              <div>
                <p className="text-2xl font-bold">{liveAuctions}</p>
                <p className="text-sm text-muted-foreground">Live Auctions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elegant">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-auction-scheduled" />
              <div>
                <p className="text-2xl font-bold">{scheduledAuctions}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search watchlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Watchlist Items */}
      {filteredWatchlist.length === 0 ? (
        <Card className="card-elegant">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your watchlist is empty</h3>
            <p className="text-muted-foreground mb-4 text-center">
              {searchQuery 
                ? "No items match your search criteria."
                : "Start browsing auctions and add items to your watchlist to keep track of them."
              }
            </p>
            <Link to="/auctions">
              <Button className="btn-hero">Browse Auctions</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredWatchlist.map((item) => (
            <Card key={item.id} className="card-elegant hover:card-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(item.status)}
                          <span className="text-sm text-muted-foreground">by {item.seller}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromWatchlist(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">${item.currentBid.toLocaleString()}</p>
                          <p className="text-muted-foreground">Current bid</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.bidCount}</p>
                          <p className="text-muted-foreground">Bids</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.timeLeft}</p>
                          <p className="text-muted-foreground">
                            {item.status === "ended" ? "Auction ended" : 
                             item.status === "scheduled" ? "Starts" : "Time left"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link to={`/auction/${item.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Auction
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}