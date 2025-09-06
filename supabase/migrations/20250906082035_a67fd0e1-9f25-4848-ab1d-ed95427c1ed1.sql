-- Create enum types for auction system
CREATE TYPE auction_status AS ENUM ('draft', 'scheduled', 'live', 'ended', 'completed', 'cancelled');
CREATE TYPE bid_type AS ENUM ('manual', 'auto');
CREATE TYPE bid_source AS ENUM ('web', 'mobile', 'api');
CREATE TYPE notification_type AS ENUM ('new_bid', 'outbid', 'auction_ended', 'bid_accepted', 'bid_rejected', 'counter_offer');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE seller_decision AS ENUM ('pending', 'accepted', 'rejected', 'counter_offered');

-- Update users table for auction platform
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);

-- Fix auctions table status column
ALTER TABLE auctions DROP CONSTRAINT IF EXISTS auctions_status_check;
ALTER TABLE auctions ALTER COLUMN status DROP DEFAULT;
ALTER TABLE auctions ALTER COLUMN status TYPE auction_status USING 
  CASE 
    WHEN status = 'draft' THEN 'draft'::auction_status
    WHEN status = 'scheduled' THEN 'scheduled'::auction_status
    WHEN status = 'live' THEN 'live'::auction_status
    WHEN status = 'ended' THEN 'ended'::auction_status
    WHEN status = 'completed' THEN 'completed'::auction_status
    WHEN status = 'cancelled' THEN 'cancelled'::auction_status
    ELSE 'draft'::auction_status
  END;
ALTER TABLE auctions ALTER COLUMN status SET DEFAULT 'draft'::auction_status;

-- Fix seller_decision column
ALTER TABLE auctions DROP CONSTRAINT IF EXISTS auctions_seller_decision_check;
ALTER TABLE auctions ALTER COLUMN seller_decision TYPE seller_decision USING 
  CASE 
    WHEN seller_decision IS NULL THEN NULL
    WHEN seller_decision = 'pending' THEN 'pending'::seller_decision
    WHEN seller_decision = 'accepted' THEN 'accepted'::seller_decision
    WHEN seller_decision = 'rejected' THEN 'rejected'::seller_decision
    WHEN seller_decision = 'counter_offered' THEN 'counter_offered'::seller_decision
    ELSE NULL
  END;

-- Add new columns to auctions
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS winner_id UUID REFERENCES users(id);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS final_price NUMERIC;
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS ended_at TIMESTAMP WITH TIME ZONE;

-- Fix bids table bid_type column
ALTER TABLE bids DROP CONSTRAINT IF EXISTS bids_bid_type_check;
ALTER TABLE bids ALTER COLUMN bid_type TYPE bid_type USING 
  CASE 
    WHEN bid_type = 'manual' THEN 'manual'::bid_type
    WHEN bid_type = 'auto' THEN 'auto'::bid_type
    ELSE 'manual'::bid_type
  END;
ALTER TABLE bids ALTER COLUMN bid_type SET DEFAULT 'manual'::bid_type;

-- Fix bids table bid_source column  
ALTER TABLE bids DROP CONSTRAINT IF EXISTS bids_bid_source_check;
ALTER TABLE bids ALTER COLUMN bid_source TYPE bid_source USING 
  CASE 
    WHEN bid_source = 'web' THEN 'web'::bid_source
    WHEN bid_source = 'mobile' THEN 'mobile'::bid_source
    WHEN bid_source = 'api' THEN 'api'::bid_source
    ELSE 'web'::bid_source
  END;
ALTER TABLE bids ALTER COLUMN bid_source SET DEFAULT 'web'::bid_source;

-- Fix notifications table type column
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ALTER COLUMN type TYPE notification_type USING 
  CASE 
    WHEN type = 'new_bid' THEN 'new_bid'::notification_type
    WHEN type = 'outbid' THEN 'outbid'::notification_type
    WHEN type = 'auction_ended' THEN 'auction_ended'::notification_type
    WHEN type = 'bid_accepted' THEN 'bid_accepted'::notification_type
    WHEN type = 'bid_rejected' THEN 'bid_rejected'::notification_type
    WHEN type = 'counter_offer' THEN 'counter_offer'::notification_type
    ELSE 'new_bid'::notification_type
  END;

-- Fix notifications table priority column
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_priority_check;
ALTER TABLE notifications ALTER COLUMN priority TYPE notification_priority USING 
  CASE 
    WHEN priority = 'low' THEN 'low'::notification_priority
    WHEN priority = 'medium' THEN 'medium'::notification_priority
    WHEN priority = 'high' THEN 'high'::notification_priority
    WHEN priority = 'urgent' THEN 'urgent'::notification_priority
    ELSE 'medium'::notification_priority
  END;
ALTER TABLE notifications ALTER COLUMN priority SET DEFAULT 'medium'::notification_priority;

-- Create new tables for auction system
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, auction_id)
);

CREATE TABLE IF NOT EXISTS counter_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_bid_amount NUMERIC NOT NULL,
  counter_offer_amount NUMERIC NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'generated' CHECK (status IN ('generated', 'sent', 'paid')),
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE counter_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;