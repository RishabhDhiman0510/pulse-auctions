import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuctionRequest {
  action: 'create' | 'update_status' | 'seller_decision' | 'counter_offer';
  auctionData?: any;
  auctionId?: string;
  decision?: 'accept' | 'reject';
  counterOfferAmount?: number;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

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

    const { action, auctionData, auctionId, decision, counterOfferAmount }: AuctionRequest = await req.json();

    console.log(`Processing auction action: ${action} by user ${user.id}`);

    switch (action) {
      case 'create':
        return await createAuction(user.id, auctionData);
      
      case 'seller_decision':
        return await handleSellerDecision(user.id, auctionId!, decision!, counterOfferAmount);
      
      case 'update_status':
        return await updateAuctionStatus();
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error: any) {
    console.error('Error in auction-manager:', error);
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

async function createAuction(userId: string, auctionData: any) {
  const {
    item_name,
    item_description,
    starting_price,
    bid_increment,
    go_live_at,
    duration_minutes,
    reserve_price,
    category,
    condition,
    location,
    item_images,
    shipping_cost,
    shipping_included,
    payment_methods
  } = auctionData;

  const { data: auction, error } = await supabase
    .from('auctions')
    .insert({
      seller_id: userId,
      item_name,
      item_description,
      starting_price,
      bid_increment,
      go_live_at,
      duration_minutes,
      reserve_price,
      category,
      condition,
      location,
      item_images: item_images || [],
      shipping_cost: shipping_cost || 0,
      shipping_included: shipping_included || false,
      payment_methods: payment_methods || ['paypal', 'bank_transfer'],
      status: new Date(go_live_at) <= new Date() ? 'live' : 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create auction: ${error.message}`);
  }

  console.log(`Auction created successfully: ${auction.id}`);

  return new Response(
    JSON.stringify({
      success: true,
      auction
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    }
  );
}

async function handleSellerDecision(userId: string, auctionId: string, decision: string, counterOfferAmount?: number) {
  // Get auction details
  const { data: auction, error: auctionError } = await supabase
    .from('auctions')
    .select('*')
    .eq('id', auctionId)
    .eq('seller_id', userId) // Ensure user owns the auction
    .single();

  if (auctionError || !auction) {
    throw new Error('Auction not found or access denied');
  }

  if (auction.status !== 'ended') {
    throw new Error('Auction must be ended to make a decision');
  }

  // Get highest bid
  const { data: highestBid } = await supabase
    .from('bids')
    .select('*')
    .eq('auction_id', auctionId)
    .eq('is_winning_bid', true)
    .single();

  if (!highestBid) {
    throw new Error('No bids found for this auction');
  }

  if (decision === 'accept') {
    // Accept the highest bid
    const { error: updateError } = await supabase
      .from('auctions')
      .update({
        seller_decision: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', auctionId);

    if (updateError) {
      throw new Error(`Failed to update auction: ${updateError.message}`);
    }

    // Notify highest bidder
    await supabase.rpc('create_notification', {
      p_user_id: highestBid.bidder_id,
      p_type: 'bid_accepted',
      p_title: 'Congratulations! Your Bid Was Accepted',
      p_message: `Your bid of $${highestBid.bid_amount} for "${auction.item_name}" has been accepted by the seller.`,
      p_auction_id: auctionId,
      p_priority: 'high',
      p_data: { bid_amount: highestBid.bid_amount, action: 'accepted' }
    });

    // Send confirmation email and generate invoice (will be handled by email service)
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-confirmation-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({
        auctionId,
        winnerId: highestBid.bidder_id,
        sellerId: userId,
        winningBid: highestBid.bid_amount
      })
    });

  } else if (decision === 'reject') {
    // Reject the highest bid
    const { error: updateError } = await supabase
      .from('auctions')
      .update({
        seller_decision: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', auctionId);

    if (updateError) {
      throw new Error(`Failed to update auction: ${updateError.message}`);
    }

    // Notify highest bidder
    await supabase.rpc('create_notification', {
      p_user_id: highestBid.bidder_id,
      p_type: 'bid_rejected',
      p_title: 'Bid Rejected',
      p_message: `Your bid of $${highestBid.bid_amount} for "${auction.item_name}" has been rejected by the seller.`,
      p_auction_id: auctionId,
      p_priority: 'medium',
      p_data: { bid_amount: highestBid.bid_amount, action: 'rejected' }
    });

  } else if (decision === 'counter_offer' && counterOfferAmount) {
    // Create counter offer
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    const { error: updateError } = await supabase
      .from('auctions')
      .update({
        seller_decision: 'counter_offered',
        counter_offer_amount: counterOfferAmount,
        counter_offer_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', auctionId);

    if (updateError) {
      throw new Error(`Failed to update auction: ${updateError.message}`);
    }

    // Notify highest bidder
    await supabase.rpc('create_notification', {
      p_user_id: highestBid.bidder_id,
      p_type: 'counter_offer',
      p_title: 'Counter Offer Received',
      p_message: `The seller has made a counter offer of $${counterOfferAmount} for "${auction.item_name}". You have 24 hours to respond.`,
      p_auction_id: auctionId,
      p_priority: 'high',
      p_data: { 
        original_bid: highestBid.bid_amount, 
        counter_offer: counterOfferAmount,
        expires_at: expiresAt.toISOString()
      }
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: `Auction decision processed: ${decision}`
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    }
  );
}

async function updateAuctionStatus() {
  // Call the database function to update auction statuses
  const { error } = await supabase.rpc('update_auction_status');
  
  if (error) {
    throw new Error(`Failed to update auction statuses: ${error.message}`);
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Auction statuses updated'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    }
  );
}

serve(handler);