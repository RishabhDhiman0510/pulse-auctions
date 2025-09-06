-- Create enum types for auction status
CREATE TYPE auction_status AS ENUM ('draft', 'scheduled', 'live', 'ended', 'completed', 'cancelled');

-- Create enum types for bid types  
CREATE TYPE bid_type AS ENUM ('manual', 'auto');

-- Create enum types for bid sources
CREATE TYPE bid_source AS ENUM ('web', 'mobile', 'api');

-- Create enum types for notification types
CREATE TYPE notification_type AS ENUM ('new_bid', 'outbid', 'auction_ended', 'bid_accepted', 'bid_rejected', 'counter_offer');

-- Create enum types for notification priority
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create enum types for seller decision
CREATE TYPE seller_decision AS ENUM ('pending', 'accepted', 'rejected', 'counter_offered');

-- Update users table to add more fields for auction platform
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);

-- Update auctions table structure for the assignment requirements
ALTER TABLE auctions DROP CONSTRAINT IF EXISTS auctions_status_check;
ALTER TABLE auctions ALTER COLUMN status TYPE auction_status USING status::text::auction_status;
ALTER TABLE auctions ALTER COLUMN status SET DEFAULT 'draft'::auction_status;

ALTER TABLE auctions DROP CONSTRAINT IF EXISTS auctions_seller_decision_check;
ALTER TABLE auctions ALTER COLUMN seller_decision TYPE seller_decision USING 
  CASE 
    WHEN seller_decision IS NULL THEN NULL
    ELSE seller_decision::text::seller_decision
  END;

-- Add missing columns to auctions table
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS winner_id UUID REFERENCES users(id);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS final_price NUMERIC;
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS ended_at TIMESTAMP WITH TIME ZONE;

-- Update bids table structure  
ALTER TABLE bids DROP CONSTRAINT IF EXISTS bids_bid_type_check;
ALTER TABLE bids ALTER COLUMN bid_type TYPE bid_type USING 
  CASE 
    WHEN bid_type IS NULL THEN 'manual'::bid_type
    ELSE bid_type::text::bid_type
  END;
ALTER TABLE bids ALTER COLUMN bid_type SET DEFAULT 'manual'::bid_type;

ALTER TABLE bids DROP CONSTRAINT IF EXISTS bids_bid_source_check;
ALTER TABLE bids ALTER COLUMN bid_source TYPE bid_source USING 
  CASE 
    WHEN bid_source IS NULL THEN 'web'::bid_source
    ELSE bid_source::text::bid_source
  END;
ALTER TABLE bids ALTER COLUMN bid_source SET DEFAULT 'web'::bid_source;

-- Update notifications table structure
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ALTER COLUMN type TYPE notification_type USING type::text::notification_type;

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_priority_check;
ALTER TABLE notifications ALTER COLUMN priority TYPE notification_priority USING 
  CASE 
    WHEN priority IS NULL THEN 'medium'::notification_priority
    ELSE priority::text::notification_priority
  END;
ALTER TABLE notifications ALTER COLUMN priority SET DEFAULT 'medium'::notification_priority;

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, auction_id)
);

-- Create counter offers table
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

-- Create invoices table for PDF generation
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

-- Create RLS policies for auctions (update existing)
DROP POLICY IF EXISTS "Users can view all auctions" ON auctions;
CREATE POLICY "Users can view all auctions" ON auctions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create their own auctions" ON auctions;
CREATE POLICY "Users can create their own auctions" ON auctions FOR INSERT WITH CHECK (seller_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own auctions" ON auctions;
CREATE POLICY "Users can update their own auctions" ON auctions FOR UPDATE USING (seller_id = auth.uid());

-- Create RLS policies for bids (update existing)
DROP POLICY IF EXISTS "Users can view all bids" ON bids;
CREATE POLICY "Users can view all bids" ON bids FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create bids" ON bids;
CREATE POLICY "Users can create bids" ON bids FOR INSERT WITH CHECK (bidder_id = auth.uid());

-- Create RLS policies for notifications (update existing)
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Create RLS policies for watchlist
CREATE POLICY "Users can view their own watchlist" ON watchlist FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own watchlist" ON watchlist FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for counter_offers
CREATE POLICY "Sellers and bidders can view their counter offers" ON counter_offers 
FOR SELECT USING (seller_id = auth.uid() OR bidder_id = auth.uid());

CREATE POLICY "Sellers can create counter offers" ON counter_offers 
FOR INSERT WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Bidders can update counter offers" ON counter_offers 
FOR UPDATE USING (bidder_id = auth.uid());

-- Create RLS policies for invoices
CREATE POLICY "Buyers and sellers can view their invoices" ON invoices 
FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_go_live_at ON auctions(go_live_at);
CREATE INDEX IF NOT EXISTS idx_auctions_seller_id ON auctions(seller_id);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_bids_bid_time ON bids(bid_time);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_counter_offers_auction_id ON counter_offers(auction_id);

-- Create functions for auction management
CREATE OR REPLACE FUNCTION update_auction_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-update auction status based on time
  IF NEW.go_live_at <= NOW() AND NEW.go_live_at + (NEW.duration_minutes || ' minutes')::INTERVAL > NOW() THEN
    NEW.status = 'live'::auction_status;
  ELSIF NEW.go_live_at + (NEW.duration_minutes || ' minutes')::INTERVAL <= NOW() THEN
    NEW.status = 'ended'::auction_status;
    NEW.ended_at = NEW.go_live_at + (NEW.duration_minutes || ' minutes')::INTERVAL;
  ELSIF NEW.go_live_at > NOW() THEN
    NEW.status = 'scheduled'::auction_status;
  END IF;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auction status updates
DROP TRIGGER IF EXISTS update_auction_status_trigger ON auctions;
CREATE TRIGGER update_auction_status_trigger
  BEFORE UPDATE ON auctions
  FOR EACH ROW
  EXECUTE FUNCTION update_auction_status();

-- Create function to update highest bid
CREATE OR REPLACE FUNCTION update_highest_bid()
RETURNS TRIGGER AS $$
BEGIN
  -- Update auction with new highest bid
  UPDATE auctions 
  SET 
    current_highest_bid = NEW.bid_amount,
    highest_bidder_id = NEW.bidder_id,
    bid_count = bid_count + 1,
    updated_at = NOW()
  WHERE id = NEW.auction_id;
  
  -- Mark previous winning bids as not winning
  UPDATE bids 
  SET is_winning_bid = false 
  WHERE auction_id = NEW.auction_id AND id != NEW.id;
  
  -- Mark new bid as winning
  NEW.is_winning_bid = true;
  NEW.bid_time = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for bid updates
DROP TRIGGER IF EXISTS update_highest_bid_trigger ON bids;
CREATE TRIGGER update_highest_bid_trigger
  BEFORE INSERT ON bids
  FOR EACH ROW
  EXECUTE FUNCTION update_highest_bid();

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_number = 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0');
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for invoice number generation
DROP TRIGGER IF EXISTS generate_invoice_number_trigger ON invoices;
CREATE TRIGGER generate_invoice_number_trigger
  BEFORE INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION generate_invoice_number();

-- Enable realtime for all tables
ALTER TABLE auctions REPLICA IDENTITY FULL;
ALTER TABLE bids REPLICA IDENTITY FULL;
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER TABLE watchlist REPLICA IDENTITY FULL;
ALTER TABLE counter_offers REPLICA IDENTITY FULL;
ALTER TABLE invoices REPLICA IDENTITY FULL;