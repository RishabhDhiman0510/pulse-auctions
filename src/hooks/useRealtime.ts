import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RealtimeConfig {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

export function useRealtime({ table, event = '*', filter, onInsert, onUpdate, onDelete }: RealtimeConfig) {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes' as any,
        {
          event: event,
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload: any) => {
          console.log(`Realtime event: ${payload.eventType} on ${table}`, payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload);
              break;
            case 'UPDATE':
              onUpdate?.(payload);
              break;
            case 'DELETE':
              onDelete?.(payload);
              break;
          }
        }
      )
      .subscribe((status: string) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          console.log(`Connected to realtime for table: ${table}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Failed to connect to realtime for table: ${table}`);
          toast({
            title: "Connection Error",
            description: "Failed to connect to real-time updates",
            variant: "destructive",
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, filter, onInsert, onUpdate, onDelete, toast]);

  return { isConnected };
}

export function useAuctionRealtime(auctionId?: string) {
  const [currentBid, setCurrentBid] = useState<number | null>(null);
  const [bidCount, setBidCount] = useState<number>(0);
  const { toast } = useToast();

  const { isConnected: bidsConnected } = useRealtime({
    table: 'bids',
    event: 'INSERT',
    filter: auctionId ? `auction_id=eq.${auctionId}` : undefined,
    onInsert: (payload) => {
      const newBid = payload.new;
      setCurrentBid(newBid.bid_amount);
      setBidCount(prev => prev + 1);
      
      toast({
        title: "New Bid Placed!",
        description: `$${newBid.bid_amount.toLocaleString()} by ${newBid.bidder_id}`,
      });
    }
  });

  const { isConnected: auctionsConnected } = useRealtime({
    table: 'auctions',
    event: 'UPDATE',
    filter: auctionId ? `id=eq.${auctionId}` : undefined,
    onUpdate: (payload) => {
      const updatedAuction = payload.new;
      setCurrentBid(updatedAuction.current_highest_bid);
      setBidCount(updatedAuction.bid_count);
      
      if (updatedAuction.status === 'ended') {
        toast({
          title: "Auction Ended",
          description: `Final bid: $${updatedAuction.current_highest_bid?.toLocaleString() || 'No bids'}`,
        });
      }
    }
  });

  return {
    currentBid,
    bidCount,
    isConnected: bidsConnected && auctionsConnected,
    setCurrentBid,
    setBidCount
  };
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  const { isConnected } = useRealtime({
    table: 'notifications',
    event: 'INSERT',
    filter: userId ? `user_id=eq.${userId}` : undefined,
    onInsert: (payload) => {
      const newNotification = payload.new;
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast for high priority notifications
      if (newNotification.priority === 'high') {
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    }
  });

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);
    
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    setNotifications,
    setUnreadCount
  };
}