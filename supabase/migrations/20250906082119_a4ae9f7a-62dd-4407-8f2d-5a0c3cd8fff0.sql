-- First drop the existing status column and recreate it with proper enum type
ALTER TABLE auctions DROP COLUMN status;
ALTER TABLE auctions ADD COLUMN status auction_status DEFAULT 'draft'::auction_status;

-- Drop and recreate seller_decision column properly
ALTER TABLE auctions DROP COLUMN seller_decision;
ALTER TABLE auctions ADD COLUMN seller_decision seller_decision;

-- Drop and recreate bid_type column properly  
ALTER TABLE bids DROP COLUMN bid_type;
ALTER TABLE bids ADD COLUMN bid_type bid_type DEFAULT 'manual'::bid_type;

-- Drop and recreate bid_source column properly
ALTER TABLE bids DROP COLUMN bid_source;
ALTER TABLE bids ADD COLUMN bid_source bid_source DEFAULT 'web'::bid_source;

-- Drop and recreate notification type column properly
ALTER TABLE notifications DROP COLUMN type;
ALTER TABLE notifications ADD COLUMN type notification_type NOT NULL;

-- Drop and recreate notification priority column properly
ALTER TABLE notifications DROP COLUMN priority;
ALTER TABLE notifications ADD COLUMN priority notification_priority DEFAULT 'medium'::notification_priority;