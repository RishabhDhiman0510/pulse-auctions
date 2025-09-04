import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Clock, 
  Users, 
  TrendingUp, 
  Heart, 
  Share2, 
  ArrowLeft,
  Gavel,
  User,
  Calendar,
  DollarSign,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Bid {
  id: string;
  amount: number;
  bidder: string;
  timestamp: Date;
}

interface AuctionDetail {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentBid: number;
  endTime: Date;
  startTime: Date;
  seller: string;
  status: 'live' | 'scheduled' | 'ended';
  category: string;
  bidCount: number;
  images: string[];
  condition: string;
  dimensions?: string;
  weight?: string;
  bids: Bid[];
  isWatchlisted: boolean;
}

// Mock auction data
const mockAuction: AuctionDetail = {
  id: "1",
  title: "Vintage Rolex Submariner",
  description: "Rare 1960s Rolex Submariner in excellent condition with original box and papers. This timepiece represents the pinnacle of Swiss watchmaking from the golden era of diving watches. The watch has been carefully maintained and shows minimal signs of wear consistent with its age. All original components are present and functioning perfectly. This is a true collector's piece that will only appreciate in value over time.",
  startingPrice: 5000,
  currentBid: 8500,
  endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // started 24 hours ago
  seller: "TimeCollector",
  status: 'live',
  category: "Jewelry & Watches",
  bidCount: 23,
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  condition: "Excellent",
  dimensions: "40mm case diameter",
  weight: "150g",
  isWatchlisted: false,
  bids: [
    { id: "1", amount: 8500, bidder: "WatchEnthusiast", timestamp: new Date(Date.now() - 30 * 60 * 1000) },
    { id: "2", amount: 8200, bidder: "CollectorPro", timestamp: new Date(Date.now() - 45 * 60 * 1000) },
    { id: "3", amount: 8000, bidder: "TimePiece", timestamp: new Date(Date.now() - 60 * 60 * 1000) },
    { id: "4", amount: 7800, bidder: "VintageSeeker", timestamp: new Date(Date.now() - 75 * 60 * 1000) },
    { id: "5", amount: 7500, bidder: "RolexFan", timestamp: new Date(Date.now() - 90 * 60 * 1000) },
  ]
};

export default function AuctionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [auction, setAuction] = useState<AuctionDetail>(mockAuction);
  const [bidAmount, setBidAmount] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState("");

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = auction.endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining("Auction ended");
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeRemaining(`${days}d ${hours % 24}h ${minutes}m`);
      } else {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auction.endTime]);

  const handleBid = () => {
    const amount = parseFloat(bidAmount);
    
    if (!amount || amount <= auction.currentBid) {
      toast({
        title: "Invalid bid",
        description: `Bid must be higher than current bid of $${auction.currentBid.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    // Simulate bid placement
    const newBid: Bid = {
      id: Date.now().toString(),
      amount: amount,
      bidder: "You",
      timestamp: new Date()
    };

    setAuction(prev => ({
      ...prev,
      currentBid: amount,
      bidCount: prev.bidCount + 1,
      bids: [newBid, ...prev.bids]
    }));

    setBidAmount("");
    
    toast({
      title: "Bid placed successfully!",
      description: `Your bid of $${amount.toLocaleString()} has been placed.`,
    });
  };

  const toggleWatchlist = () => {
    setAuction(prev => ({ ...prev, isWatchlisted: !prev.isWatchlisted }));
    toast({
      title: auction.isWatchlisted ? "Removed from watchlist" : "Added to watchlist",
      description: auction.isWatchlisted ? "Item removed from your watchlist" : "Item added to your watchlist",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'status-live';
      case 'scheduled': return 'status-scheduled';
      case 'ended': return 'status-ended';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Auctions
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card className="card-elegant">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="aspect-square bg-secondary/30 rounded-lg overflow-hidden">
                  <img
                    src={auction.images[selectedImage]}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex space-x-2 overflow-x-auto">
                  {auction.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 bg-secondary/30 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt={`${auction.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {auction.description}
              </p>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Condition</p>
                  <p className="text-sm text-muted-foreground">{auction.condition}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{auction.category}</p>
                </div>
                {auction.dimensions && (
                  <div>
                    <p className="text-sm font-medium">Dimensions</p>
                    <p className="text-sm text-muted-foreground">{auction.dimensions}</p>
                  </div>
                )}
                {auction.weight && (
                  <div>
                    <p className="text-sm font-medium">Weight</p>
                    <p className="text-sm text-muted-foreground">{auction.weight}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bid History */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Bid History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auction.bids.map((bid, index) => (
                  <div key={bid.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <p className="font-medium">${bid.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          by {bid.bidder} • {bid.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {index === 0 && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Highest Bid
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Auction Info */}
          <Card className="card-elegant">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{auction.title}</CardTitle>
                  <Badge className={getStatusColor(auction.status)}>
                    {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleWatchlist}
                  >
                    <Heart className={`h-5 w-5 ${auction.isWatchlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Bid</p>
                <p className="text-2xl font-bold text-primary">
                  ${auction.currentBid.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Starting Price</p>
                  <p className="font-medium">${auction.startingPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bids</p>
                  <p className="font-medium">{auction.bidCount}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time Remaining</span>
                  <span className="font-medium text-auction-live">{timeRemaining}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Seller</span>
                  <span className="font-medium">{auction.seller}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bidding */}
          {auction.status === 'live' && (
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  Place Bid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Your bid (minimum: ${(auction.currentBid + 100).toLocaleString()})
                  </label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="number"
                      placeholder={(auction.currentBid + 100).toString()}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleBid}
                  className="w-full btn-hero"
                  disabled={!bidAmount || parseFloat(bidAmount) <= auction.currentBid}
                >
                  Place Bid
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By bidding, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          )}

          {/* Seller Info */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Seller Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{auction.seller}</p>
                  <p className="text-sm text-muted-foreground">Verified Seller</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Rating</p>
                  <p className="font-medium">98.5% (247 reviews)</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Member Since</p>
                  <p className="font-medium">2019</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Seller Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}