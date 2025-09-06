-- Create comprehensive RLS policies for auctions
CREATE POLICY "Auctions are viewable by everyone" ON auctions FOR SELECT USING (true);
CREATE POLICY "Users can create their own auctions" ON auctions FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update their own auctions" ON auctions FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Users can delete their own auctions" ON auctions FOR DELETE USING (auth.uid() = seller_id);

-- Create comprehensive RLS policies for bids
CREATE POLICY "Bids are viewable by everyone" ON bids FOR SELECT USING (true);
CREATE POLICY "Users can create bids" ON bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Create comprehensive RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Create comprehensive RLS policies for users
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Add bid increment validation function
CREATE OR REPLACE FUNCTION validate_bid_increment()
RETURNS TRIGGER AS $$
DECLARE
    auction_record RECORD;
    current_highest NUMERIC := 0;
BEGIN
    -- Get auction details
    SELECT * INTO auction_record FROM auctions WHERE id = NEW.auction_id;
    
    -- Check if auction exists and is active
    IF auction_record IS NULL THEN
        RAISE EXCEPTION 'Auction not found';
    END IF;
    
    IF auction_record.status != 'live' THEN
        RAISE EXCEPTION 'Auction is not live';
    END IF;
    
    -- Check if auction has ended
    IF NOW() > (auction_record.go_live_at + INTERVAL '1 minute' * auction_record.duration_minutes) THEN
        RAISE EXCEPTION 'Auction has ended';
    END IF;
    
    -- Get current highest bid
    SELECT COALESCE(MAX(bid_amount), auction_record.starting_price) INTO current_highest
    FROM bids WHERE auction_id = NEW.auction_id;
    
    -- Validate bid amount
    IF NEW.bid_amount <= current_highest THEN
        RAISE EXCEPTION 'Bid must be higher than current highest bid of %', current_highest;
    END IF;
    
    IF NEW.bid_amount < (current_highest + auction_record.bid_increment) THEN
        RAISE EXCEPTION 'Bid must be at least % (current bid + minimum increment)', (current_highest + auction_record.bid_increment);
    END IF;
    
    -- Update auction with new highest bid
    UPDATE auctions 
    SET current_highest_bid = NEW.bid_amount,
        highest_bidder_id = NEW.bidder_id,
        bid_count = bid_count + 1,
        updated_at = NOW()
    WHERE id = NEW.auction_id;
    
    -- Set winning bid flag
    NEW.is_winning_bid = true;
    
    -- Mark previous highest bid as not winning
    UPDATE bids 
    SET is_winning_bid = false 
    WHERE auction_id = NEW.auction_id AND id != NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for bid validation
CREATE TRIGGER validate_bid_trigger
    BEFORE INSERT ON bids
    FOR EACH ROW
    EXECUTE FUNCTION validate_bid_increment();

-- Function to automatically end auctions and update status
CREATE OR REPLACE FUNCTION update_auction_status()
RETURNS void AS $$
BEGIN
    -- Update auctions that should be live
    UPDATE auctions 
    SET status = 'live'::enum_auctions_status
    WHERE status = 'scheduled'::enum_auctions_status 
    AND go_live_at <= NOW();
    
    -- Update auctions that should be ended
    UPDATE auctions 
    SET status = 'ended'::enum_auctions_status
    WHERE status = 'live'::enum_auctions_status 
    AND (go_live_at + INTERVAL '1 minute' * duration_minutes) <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type enum_notifications_type,
    p_title VARCHAR,
    p_message TEXT,
    p_auction_id UUID DEFAULT NULL,
    p_priority enum_notifications_priority DEFAULT 'medium'::enum_notifications_priority,
    p_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (
        user_id, type, title, message, auction_id, priority, data, created_at, updated_at
    ) VALUES (
        p_user_id, p_type, p_title, p_message, p_auction_id, p_priority, p_data, NOW(), NOW()
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;