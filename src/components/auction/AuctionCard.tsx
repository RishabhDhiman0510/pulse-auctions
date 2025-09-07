import { useState } from "react";
import { Clock, Users, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Auction } from "@/hooks/useAuctions";

interface AuctionCardProps {
  auction: Auction;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [isToggling, setIsToggling] = useState(false);

  const formatTimeRemaining = (endTime: string, status: string) => {
    if (status === 'ended') return 'Auction ended';
    if (status === 'scheduled') return `Starts ${new Date(endTime).toLocaleDateString()}`;
    
    const now = new Date();
    const goLiveTime = new Date(auction.go_live_at);
    const endTimeDate = new Date(goLiveTime.getTime() + auction.duration_minutes * 60 * 1000);
    const diff = endTimeDate.getTime() - now.getTime();
    
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

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsToggling(true);
    await toggleWatchlist(auction.id);
    setIsToggling(false);
  };

  const currentBid = auction.current_highest_bid > 0 ? auction.current_highest_bid : auction.starting_price;
  const imageUrl = auction.item_images && auction.item_images.length > 0 
    ? auction.item_images[0] 
    : "/placeholder.svg";

  return (
    <Card className="card-elegant hover:card-glow transition-all duration-300 group cursor-pointer">
      <div onClick={() => navigate(`/auction/${auction.id}`)}>
        <div className="relative">
          <img
            src={imageUrl}
            alt={auction.item_name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Badge className={`absolute top-2 left-2 ${getStatusColor(auction.status)}`}>
            {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleWatchlistToggle}
            disabled={isToggling}
          >
            <Heart 
              className={`h-4 w-4 ${isInWatchlist(auction.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {auction.item_name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {auction.item_description}
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current bid:</span>
              <span className="font-semibold text-primary">
                ${currentBid.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{auction.bid_count} bids</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimeRemaining(auction.go_live_at, auction.status)}</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Category: {auction.category}
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
  );
}