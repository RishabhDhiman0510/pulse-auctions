-- Fix function search path security warnings

-- Update validate_bid_increment function with secure search path
CREATE OR REPLACE FUNCTION public.validate_bid_increment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Update update_auction_status function with secure search path
CREATE OR REPLACE FUNCTION public.update_auction_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Update auctions that should be live
    UPDATE auctions 
    SET status = 'live'
    WHERE status = 'scheduled' 
    AND go_live_at <= NOW();
    
    -- Update auctions that should be ended
    UPDATE auctions 
    SET status = 'ended'
    WHERE status = 'live' 
    AND (go_live_at + INTERVAL '1 minute' * duration_minutes) <= NOW();
END;
$function$;

-- Update create_notification function with secure search path
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id uuid, 
    p_type text, 
    p_title character varying, 
    p_message text, 
    p_auction_id uuid DEFAULT NULL::uuid, 
    p_priority text DEFAULT 'medium', 
    p_data jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (
        user_id, type, title, message, auction_id, priority, data, created_at, updated_at
    ) VALUES (
        p_user_id, p_type::text, p_title, p_message, p_auction_id, p_priority::text, p_data, NOW(), NOW()
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$function$;

-- Create trigger for bid validation
DROP TRIGGER IF EXISTS validate_bid_trigger ON public.bids;
CREATE TRIGGER validate_bid_trigger
    BEFORE INSERT ON public.bids
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_bid_increment();

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$function$;

-- Create trigger for user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();