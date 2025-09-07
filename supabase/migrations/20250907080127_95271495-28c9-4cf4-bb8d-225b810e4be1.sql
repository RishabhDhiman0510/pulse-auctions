-- Clean up duplicate functions and fix security issues

-- Drop all versions of create_notification function
DROP FUNCTION IF EXISTS public.create_notification(uuid, text, character varying, text, uuid, text, jsonb);
DROP FUNCTION IF EXISTS public.create_notification(uuid, enum_notifications_type, character varying, text, uuid, enum_notifications_priority, jsonb);

-- Create the corrected version of create_notification function
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id uuid, 
    p_type text, 
    p_title text, 
    p_message text, 
    p_auction_id uuid DEFAULT NULL, 
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
        p_user_id, p_type, p_title, p_message, p_auction_id, p_priority, p_data, NOW(), NOW()
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$function$;