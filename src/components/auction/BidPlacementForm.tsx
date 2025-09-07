import { useState } from "react";
import { DollarSign, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useAuctions, Auction } from "@/hooks/useAuctions";
import { useToast } from "@/hooks/use-toast";

interface BidPlacementFormProps {
  auction: Auction;
  onBidPlaced?: () => void;
}

export function BidPlacementForm({ auction, onBidPlaced }: BidPlacementFormProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [maxBidAmount, setMaxBidAmount] = useState("");
  const [isAutoBid, setIsAutoBid] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  
  const { user } = useAuth();
  const { placeBid } = useAuctions();
  const { toast } = useToast();

  const minimumBid = auction.current_highest_bid > 0 
    ? auction.current_highest_bid + auction.bid_increment
    : auction.starting_price + auction.bid_increment;

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to place a bid",
        variant: "destructive",
      });
      return;
    }

    const bid = parseFloat(bidAmount);
    const maxBid = isAutoBid ? parseFloat(maxBidAmount) : undefined;

    if (!bid || bid < minimumBid) {
      toast({
        title: "Invalid bid amount",
        description: `Bid must be at least $${minimumBid.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    if (isAutoBid && (!maxBid || maxBid < bid)) {
      toast({
        title: "Invalid maximum bid",
        description: "Maximum bid must be higher than your current bid",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPlacing(true);
      await placeBid(auction.id, bid, maxBid);
      setBidAmount("");
      setMaxBidAmount("");
      setIsAutoBid(false);
      onBidPlaced?.();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsPlacing(false);
    }
  };

  if (auction.status !== 'live') {
    return null;
  }

  return (
    <Card className="card-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5" />
          Place Bid
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBidSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">
              Your bid (minimum: ${minimumBid.toLocaleString()})
            </label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="number"
                step="0.01"
                min={minimumBid}
                placeholder={minimumBid.toString()}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoBid"
              checked={isAutoBid}
              onCheckedChange={(checked) => setIsAutoBid(!!checked)}
            />
            <label htmlFor="autoBid" className="text-sm font-medium">
              Enable automatic bidding
            </label>
          </div>

          {isAutoBid && (
            <div>
              <label className="text-sm text-muted-foreground">
                Maximum bid amount
              </label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="number"
                  step="0.01"
                  min={bidAmount || minimumBid}
                  placeholder={(parseFloat(bidAmount) || minimumBid + 100).toString()}
                  value={maxBidAmount}
                  onChange={(e) => setMaxBidAmount(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                We'll automatically bid up to this amount to keep you as the highest bidder
              </p>
            </div>
          )}

          <Button 
            type="submit"
            className="w-full btn-hero"
            disabled={isPlacing || !bidAmount || parseFloat(bidAmount) < minimumBid}
          >
            {isPlacing ? "Placing Bid..." : "Place Bid"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By bidding, you agree to our terms and conditions
          </p>
        </form>
      </CardContent>
    </Card>
  );
}