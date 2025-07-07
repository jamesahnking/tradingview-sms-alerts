
import twilio from 'twilio';

interface WebhookRequest {
    method?: string;
    body?: TradingViewAlert;
}

interface WebhookResponse {
    status: (code: number) => WebhookResponse;
    json: (data: any) => void;
}

interface TradingViewAlert {
  symbol: string;
  action: string;
  price: number;
  timestamp: string;
}

// Initialize Twilio client with proper validation
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error('Missing required Twilio environment variables: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN');
}

const client = twilio(
  accountSid,
  authToken
);

// Ensure environment variables are loaded
export default async function handler(
  req: WebhookRequest,
  res: WebhookResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const alert = req.body as TradingViewAlert;
    
    if (!alert) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
        // const alert: TradingViewAlert = req.body;   
    // Basic validation
    if (!alert.symbol || !alert.action || !alert.price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format SMS message
    const message = `🚨 ${alert.symbol} ${alert.action} at $${alert.price}`;
    
    // Ensure environment variables are defined
    const from = process.env.TWILIO_PHONE_NUMBER;
    const to = process.env.TO_PHONE_NUMBER;

    // Check if phone numbers are set
    if (!from || !to) {
      return res.status(500).json({ error: 'Missing phone number environment variables' });
    }

    // Send SMS
    await client.messages.create({
      body: message,
      from,
      to,
    });

    res.status(200).json({ success: true, message: 'SMS sent' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
}