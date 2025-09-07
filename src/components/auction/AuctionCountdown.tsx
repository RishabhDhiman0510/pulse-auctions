import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Auction } from "@/hooks/useAuctions";

interface AuctionCountdownProps {
  auction: Auction;
  className?: string;
}

export function AuctionCountdown({ auction, className = "" }: AuctionCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      if (auction.status === 'ended') {
        setTimeRemaining("Auction ended");
        setIsEnded(true);
        return;
      }

      if (auction.status === 'scheduled') {
        const startTime = new Date(auction.go_live_at);
        const now = new Date();
        
        if (now < startTime) {
          const diff = startTime.getTime() - now.getTime();
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          if (days > 0) {
            setTimeRemaining(`Starts in ${days}d ${hours}h ${minutes}m`);
          } else {
            setTimeRemaining(`Starts in ${hours}h ${minutes}m`);
          }
          return;
        }
      }

      if (auction.status === 'live') {
        const startTime = new Date(auction.go_live_at);
        const endTime = new Date(startTime.getTime() + auction.duration_minutes * 60 * 1000);
        const now = new Date();
        const diff = endTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeRemaining("Auction ended");
          setIsEnded(true);
          return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining(`${minutes}m ${seconds}s`);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  const getStatusColor = () => {
    if (isEnded || auction.status === 'ended') return 'status-ended';
    if (auction.status === 'live') return 'status-live';
    if (auction.status === 'scheduled') return 'status-scheduled';
    return '';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="h-4 w-4" />
      <Badge className={getStatusColor()}>
        {timeRemaining}
      </Badge>
    </div>
  );
}