import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BidRequest {
  auctionId: string;
  bidAmount: number;
  maxBidAmount?: number;
  isAutoBid?: boolean;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

// Redis client for fast bid updates
const redisUrl = Deno.env.get('UPSTASH_REDIS_REST_URL') ?? '';
const redisToken = Deno.env.get('UPSTASH_REDIS_REST_TOKEN') ?? '';

async function redisRequest(command: string[], data?: any) {
  const response = await fetch(`${redisUrl}/${command.join('/')}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${redisToken}`,
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    // Set auth header for supabase client
    supabase.auth.setSession({
      access_token: authHeader.replace('Bearer ', ''),
      refresh_token: '',
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { auctionId, bidAmount, maxBidAmount, isAutoBid }: BidRequest = await req.json();

    console.log(`Processing bid: User ${user.id}, Auction ${auctionId}, Amount ${bidAmount}`);

    // Check Redis for current highest bid (faster than DB)
    const redisKey = `auction:${auctionId}:highest_bid`;
    const currentHighestRedis = await redisRequest(['GET', redisKey]);
    
    // Get auction details from database
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single();

    if (auctionError || !auction) {
      throw new Error('Auction not found');
    }

    // Validate auction status and timing
    if (auction.status !== 'live') {
      throw new Error('Auction is not live');
    }

    const now = new Date();
    const endTime = new Date(auction.go_live_at);
    endTime.setMinutes(endTime.getMinutes() + auction.duration_minutes);
    
    if (now > endTime) {
      throw new Error('Auction has ended');
    }

    // Get current highest from Redis or DB
    const currentHighest = currentHighestRedis?.result || auction.current_highest_bid || auction.starting_price;

    // Validate bid amount
    if (bidAmount <= currentHighest) {
      throw new Error(`Bid must be higher than current highest bid of $${currentHighest}`);
    }

    if (bidAmount < (currentHighest + auction.bid_increment)) {
      throw new Error(`Bid must be at least $${currentHighest + auction.bid_increment} (current bid + minimum increment)`);
    }

    // Insert bid into database (this will trigger the validation function)
    const { data: newBid, error: bidError } = await supabase
      .from('bids')
      .insert({
        auction_id: auctionId,
        bidder_id: user.id,
        bid_amount: bidAmount,
        max_bid_amount: maxBidAmount,
        is_auto_bid: isAutoBid || false,
        bid_time: new Date().toISOString(),
        bid_source: 'web',
        bid_type: isAutoBid ? 'auto' : 'manual',
        client_ip: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      })
      .select()
      .single();

    if (bidError) {
      console.error('Bid insertion error:', bidError);
      throw new Error(bidError.message);
    }

    // Update Redis with new highest bid for fast access
    await redisRequest(['SET', redisKey, bidAmount.toString()]);
    await redisRequest(['EXPIRE', redisKey, '7200']); // 2 hours expiry

    // Get updated auction data
    const { data: updatedAuction } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single();

    // Create notifications for seller and outbid users
    if (updatedAuction) {
      // Notify seller
      await supabase.rpc('create_notification', {
        p_user_id: updatedAuction.seller_id,
        p_type: 'bid_placed',
        p_title: 'New Bid Placed',
        p_message: `A new bid of $${bidAmount} was placed on your auction "${updatedAuction.item_name}"`,
        p_auction_id: auctionId,
        p_priority: 'high',
        p_data: { bid_amount: bidAmount, bidder_id: user.id }
      });

      // Get previous highest bidder to notify them they've been outbid
      const { data: previousBids } = await supabase
        .from('bids')
        .select('bidder_id')
        .eq('auction_id', auctionId)
        .eq('is_winning_bid', false)
        .order('bid_amount', { ascending: false })
        .limit(1);

      if (previousBids && previousBids.length > 0 && previousBids[0].bidder_id !== user.id) {
        await supabase.rpc('create_notification', {
          p_user_id: previousBids[0].bidder_id,
          p_type: 'outbid',
          p_title: 'You\'ve Been Outbid',
          p_message: `Your bid on "${updatedAuction.item_name}" has been outbid. Current highest bid: $${bidAmount}`,
          p_auction_id: auctionId,
          p_priority: 'high',
          p_data: { new_bid_amount: bidAmount, your_bid_amount: currentHighest }
        });
      }
    }

    console.log(`Bid processed successfully: ${newBid.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        bid: newBid,
        auction: updatedAuction
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in bid-handler:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);