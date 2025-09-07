import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Auction {
  id: string;
  seller_id: string;
  item_name: string;
  item_description: string;
  category: string;
  condition?: string;
  starting_price: number;
  current_highest_bid: number;
  reserve_price?: number;
  bid_increment: number;
  highest_bidder_id?: string;
  bid_count: number;
  go_live_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  item_images: string[];
  dimensions?: string;
  weight?: string;
  location?: string;
  shipping_cost: number;
  shipping_included: boolean;
  payment_methods: string[];
  seller_decision?: 'pending' | 'accepted' | 'rejected' | 'counter_offered';
  counter_offer_amount?: number;
  counter_offer_expires_at?: string;
  views_count: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  bid_amount: number;
  max_bid_amount?: number;
  is_auto_bid: boolean;
  is_winning_bid: boolean;
  bid_time: string;
  bid_source: string;
  bid_type: 'manual' | 'auto';
  created_at: string;
}

export function useAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAuctions = async (status?: string, category?: string, search?: string) => {
    try {
      setLoading(true);
      let query = supabase.from('auctions').select('*');

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`item_name.ilike.%${search}%,item_description.ilike.%${search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching auctions",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setAuctions((data || []) as Auction[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAuction = async (auctionData: Partial<Auction>) => {
    try {
      const { data, error } = await supabase.functions.invoke('auction-manager', {
        body: {
          action: 'create',
          auctionData
        }
      });

      if (error) throw error;

      toast({
        title: "Auction created successfully!",
        description: "Your auction is now live",
      });

      return data.auction;
    } catch (error: any) {
      toast({
        title: "Error creating auction",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const placeBid = async (auctionId: string, bidAmount: number, maxBidAmount?: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('bid-handler', {
        body: {
          auctionId,
          bidAmount,
          maxBidAmount,
          isAutoBid: !!maxBidAmount
        }
      });

      if (error) throw error;

      toast({
        title: "Bid placed successfully!",
        description: `Your bid of $${bidAmount.toLocaleString()} has been placed`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error placing bid",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getAuctionById = async (id: string): Promise<Auction | null> => {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Auction;
    } catch (error: any) {
      toast({
        title: "Error fetching auction",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const getBidsForAuction = async (auctionId: string): Promise<Bid[]> => {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('auction_id', auctionId)
        .order('bid_amount', { ascending: false });

      if (error) throw error;
      return (data || []) as Bid[];
    } catch (error: any) {
      toast({
        title: "Error fetching bids",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return {
    auctions,
    loading,
    fetchAuctions,
    createAuction,
    placeBid,
    getAuctionById,
    getBidsForAuction,
  };
}