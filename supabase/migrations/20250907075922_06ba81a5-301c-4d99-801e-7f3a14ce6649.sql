-- Create comprehensive auction system schema

-- Users table (for additional profile data)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  phone TEXT,
  verified BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_ratings INTEGER DEFAULT 0,
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auctions table
CREATE TABLE IF NOT EXISTS public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_description TEXT NOT NULL,
  category TEXT NOT NULL,
  condition TEXT,
  starting_price DECIMAL(10,2) NOT NULL CHECK (starting_price >= 0),
  current_highest_bid DECIMAL(10,2) DEFAULT 0,
  reserve_price DECIMAL(10,2),
  bid_increment DECIMAL(10,2) DEFAULT 1.00,
  highest_bidder_id UUID REFERENCES auth.users(id),
  bid_count INTEGER DEFAULT 0,
  go_live_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  item_images TEXT[] DEFAULT '{}',
  dimensions TEXT,
  weight TEXT,
  location TEXT,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  shipping_included BOOLEAN DEFAULT false,
  payment_methods TEXT[] DEFAULT '{"paypal", "bank_transfer"}',
  seller_decision TEXT CHECK (seller_decision IN ('pending', 'accepted', 'rejected', 'counter_offered')),
  counter_offer_amount DECIMAL(10,2),
  counter_offer_expires_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  watchers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bid_amount DECIMAL(10,2) NOT NULL CHECK (bid_amount > 0),
  max_bid_amount DECIMAL(10,2),
  is_auto_bid BOOLEAN DEFAULT false,
  is_winning_bid BOOLEAN DEFAULT false,
  bid_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bid_source TEXT DEFAULT 'web',
  bid_type TEXT DEFAULT 'manual' CHECK (bid_type IN ('manual', 'auto')),
  client_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('bid_placed', 'outbid', 'auction_ending', 'auction_ended', 'bid_accepted', 'bid_rejected', 'counter_offer', 'payment_due')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Watchlist table
CREATE TABLE IF NOT EXISTS public.watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  auction_id UUID NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, auction_id)
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, description) VALUES
  ('Electronics', 'Electronic devices and gadgets'),
  ('Jewelry & Watches', 'Fine jewelry, watches, and accessories'),
  ('Art & Collectibles', 'Artwork, antiques, and collectible items'),
  ('Fashion', 'Clothing, shoes, and fashion accessories'),
  ('Home & Garden', 'Home decor, furniture, and garden items'),
  ('Vehicles', 'Cars, motorcycles, boats, and vehicle parts'),
  ('Sports & Recreation', 'Sports equipment and recreational items'),
  ('Books & Manuscripts', 'Books, documents, and written materials')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for auctions
CREATE POLICY "Anyone can view auctions" ON public.auctions
  FOR SELECT USING (true);

CREATE POLICY "Users can create auctions" ON public.auctions
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own auctions" ON public.auctions
  FOR UPDATE USING (auth.uid() = seller_id);

-- RLS Policies for bids
CREATE POLICY "Anyone can view bids" ON public.bids
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can place bids" ON public.bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for watchlist
CREATE POLICY "Users can view their own watchlist" ON public.watchlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own watchlist" ON public.watchlist
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for categories
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_auctions_status ON public.auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_go_live_at ON public.auctions(go_live_at);
CREATE INDEX IF NOT EXISTS idx_auctions_seller_id ON public.auctions(seller_id);
CREATE INDEX IF NOT EXISTS idx_auctions_category ON public.auctions(category);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON public.bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON public.bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_bids_is_winning_bid ON public.bids(is_winning_bid);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON public.watchlist(user_id);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.watchlist;

-- Set replica identity for realtime
ALTER TABLE public.auctions REPLICA IDENTITY FULL;
ALTER TABLE public.bids REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.watchlist REPLICA IDENTITY FULL;