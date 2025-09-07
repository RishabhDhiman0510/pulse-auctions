import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Heart, 
  Share2, 
  User,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuctions, Auction, Bid } from "@/hooks/useAuctions";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/hooks/useAuth";
import { BidPlacementForm } from "@/components/auction/BidPlacementForm";
import { AuctionCountdown } from "@/components/auction/AuctionCountdown";
import { useAuctionRealtime } from "@/hooks/useRealtime";


export default function AuctionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getAuctionById, getBidsForAuction } = useAuctions();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Real-time updates for this auction
  const { 
    currentBid, 
    bidCount, 
    isConnected,
    setCurrentBid,
    setBidCount 
  } = useAuctionRealtime(id);

  // Load auction data
  useEffect(() => {
    const loadAuction = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const [auctionData, bidsData] = await Promise.all([
          getAuctionById(id),
          getBidsForAuction(id)
        ]);
        
        if (auctionData) {
          setAuction(auctionData);
          setCurrentBid(auctionData.current_highest_bid);
          setBidCount(auctionData.bid_count);
        }
        
        setBids(bidsData);
      } catch (error) {
        toast({
          title: "Error loading auction",
          description: "Could not load auction details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAuction();
  }, [id]);

  // Update local state when real-time data changes
  useEffect(() => {
    if (auction && currentBid !== null) {
      setAuction(prev => prev ? { ...prev, current_highest_bid: currentBid, bid_count: bidCount } : null);
    }
  }, [currentBid, bidCount]);

  const handleBidPlaced = async () => {
    // Refresh bids after a successful bid
    if (id) {
      const updatedBids = await getBidsForAuction(id);
      setBids(updatedBids);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!id) return;
    await toggleWatchlist(id);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary/30 rounded w-48"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-secondary/30 rounded"></div>
              <div className="h-32 bg-secondary/30 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-secondary/30 rounded"></div>
              <div className="h-48 bg-secondary/30 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Auction not found</h1>
          <Button onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'status-live';
      case 'scheduled': return 'status-scheduled';
      case 'ended': return 'status-ended';
      default: return '';
    }
  };

  const currentBidDisplay = auction.current_highest_bid > 0 ? auction.current_highest_bid : auction.starting_price;
  const imageUrl = auction.item_images && auction.item_images.length > 0 
    ? auction.item_images[selectedImage] 
    : "/placeholder.svg";

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
                    src={imageUrl}
                    alt={auction.item_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {auction.item_images && auction.item_images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {auction.item_images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 bg-secondary/30 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <img src={image} alt={`${auction.item_name} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
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
                {auction.item_description}
              </p>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Condition</p>
                  <p className="text-sm text-muted-foreground">{auction.condition || 'Not specified'}</p>
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
                {auction.location && (
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{auction.location}</p>
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
                {bids.map((bid, index) => (
                  <div key={bid.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <p className="font-medium">${bid.bid_amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          by Bidder #{bid.bidder_id.slice(-4)} • {new Date(bid.bid_time).toLocaleTimeString()}
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
                {bids.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No bids placed yet</p>
                )}
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
                  <CardTitle className="text-xl mb-2">{auction.item_name}</CardTitle>
                  <Badge className={getStatusColor(auction.status)}>
                    {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                  </Badge>
                  {!isConnected && (
                    <div className="text-xs text-yellow-600 mt-1">Real-time updates disconnected</div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWatchlistToggle}
                  >
                    <Heart className={`h-5 w-5 ${isInWatchlist(auction.id) ? 'fill-red-500 text-red-500' : ''}`} />
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
                  ${currentBidDisplay.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Starting Price</p>
                  <p className="font-medium">${auction.starting_price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bids</p>
                  <p className="font-medium">{auction.bid_count}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <AuctionCountdown auction={auction} />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Seller</span>
                  <span className="font-medium">Seller #{auction.seller_id.slice(-6)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bidding */}
          <BidPlacementForm auction={auction} onBidPlaced={handleBidPlaced} />

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
                  <p className="font-medium">Seller #{auction.seller_id.slice(-6)}</p>
                  <p className="text-sm text-muted-foreground">Verified Seller</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Rating</p>
                  <p className="font-medium">New Seller</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Member Since</p>
                  <p className="font-medium">{new Date(auction.created_at).getFullYear()}</p>
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