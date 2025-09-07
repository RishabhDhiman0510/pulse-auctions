import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface WatchlistItem {
  id: string;
  user_id: string;
  auction_id: string;
  added_at: string;
  auction?: {
    id: string;
    item_name: string;
    current_highest_bid: number;
    status: string;
    go_live_at: string;
    duration_minutes: number;
    item_images: string[];
  };
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchWatchlist = async () => {
    if (!user) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('watchlist')
        .select(`
          *,
          auction:auctions(
            id,
            item_name,
            current_highest_bid,
            status,
            go_live_at,
            duration_minutes,
            item_images
          )
        `)
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;
      setWatchlist(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching watchlist",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (auctionId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your watchlist",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          auction_id: auctionId
        });

      if (error) throw error;

      toast({
        title: "Added to watchlist",
        description: "Item has been added to your watchlist",
      });

      await fetchWatchlist();
      return true;
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: "Already in watchlist",
          description: "This item is already in your watchlist",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error adding to watchlist",
          description: error.message,
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const removeFromWatchlist = async (auctionId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('auction_id', auctionId);

      if (error) throw error;

      toast({
        title: "Removed from watchlist",
        description: "Item has been removed from your watchlist",
      });

      await fetchWatchlist();
      return true;
    } catch (error: any) {
      toast({
        title: "Error removing from watchlist",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const isInWatchlist = (auctionId: string): boolean => {
    return watchlist.some(item => item.auction_id === auctionId);
  };

  const toggleWatchlist = async (auctionId: string) => {
    if (isInWatchlist(auctionId)) {
      return await removeFromWatchlist(auctionId);
    } else {
      return await addToWatchlist(auctionId);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user]);

  return {
    watchlist,
    loading,
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
  };
}