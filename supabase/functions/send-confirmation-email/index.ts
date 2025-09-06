import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

// SendGrid configuration
const sendGridApiKey = Deno.env.get('SENDGRID_API_KEY');

interface EmailRequest {
  auctionId: string;
  winnerId: string;
  sellerId: string;
  winningBid: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { auctionId, winnerId, sellerId, winningBid }: EmailRequest = await req.json();

    console.log(`Sending confirmation email for auction ${auctionId}`);

    // Get auction details
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single();

    if (auctionError || !auction) {
      throw new Error('Auction not found');
    }

    // Get winner and seller details
    const { data: winner, error: winnerError } = await supabase
      .from('users')
      .select('*')
      .eq('id', winnerId)
      .single();

    const { data: seller, error: sellerError } = await supabase
      .from('users')
      .select('*')
      .eq('id', sellerId)
      .single();

    if (winnerError || !winner || sellerError || !seller) {
      throw new Error('User details not found');
    }

    // Generate invoice
    const invoiceData = {
      auction_id: auctionId,
      buyer_id: winnerId,
      seller_id: sellerId,
      total_amount: winningBid,
      item_name: auction.item_name,
      item_description: auction.item_description,
      shipping_cost: auction.shipping_cost || 0,
      payment_methods: auction.payment_methods,
      created_at: new Date().toISOString()
    };

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert(invoiceData)
      .select()
      .single();

    if (invoiceError) {
      console.error('Failed to create invoice:', invoiceError);
    }

    // Send email to winner
    await sendEmail(
      winner.email,
      'Congratulations! Your Bid Was Accepted',
      `
      <h1>Congratulations, ${winner.full_name}!</h1>
      <p>Your bid of <strong>$${winningBid}</strong> for "${auction.item_name}" has been accepted by the seller.</p>
      
      <h2>Auction Details:</h2>
      <ul>
        <li><strong>Item:</strong> ${auction.item_name}</li>
        <li><strong>Winning Bid:</strong> $${winningBid}</li>
        <li><strong>Seller:</strong> ${seller.full_name}</li>
        <li><strong>Shipping Cost:</strong> $${auction.shipping_cost || 0}</li>
      </ul>
      
      <h2>Next Steps:</h2>
      <p>The seller will contact you soon to arrange payment and shipping details.</p>
      
      <p>Thank you for using our auction platform!</p>
      `
    );

    // Send email to seller
    await sendEmail(
      seller.email,
      'Auction Completed Successfully',
      `
      <h1>Auction Completed!</h1>
      <p>Your auction for "${auction.item_name}" has been completed successfully.</p>
      
      <h2>Sale Details:</h2>
      <ul>
        <li><strong>Item:</strong> ${auction.item_name}</li>
        <li><strong>Final Bid:</strong> $${winningBid}</li>
        <li><strong>Winner:</strong> ${winner.full_name}</li>
        <li><strong>Winner Email:</strong> ${winner.email}</li>
      </ul>
      
      <h2>Next Steps:</h2>
      <p>Please contact the winner to arrange payment and shipping details.</p>
      
      <p>Thank you for using our auction platform!</p>
      `
    );

    console.log(`Confirmation emails sent for auction ${auctionId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Confirmation emails sent',
        invoice: invoice
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
    console.error('Error in send-confirmation-email:', error);
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

async function sendEmail(to: string, subject: string, htmlContent: string) {
  if (!sendGridApiKey) {
    console.error('SendGrid API key not configured');
    return;
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
          },
        ],
        from: {
          email: 'noreply@auctionplatform.com',
          name: 'Auction Platform',
        },
        subject,
        content: [
          {
            type: 'text/html',
            value: htmlContent,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid error:', errorText);
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

serve(handler);