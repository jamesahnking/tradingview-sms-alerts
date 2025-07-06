# TradingView Alert SMS System

A simple, reliable system that converts TradingView alerts into SMS notifications using Node.js, TypeScript, and Vercel serverless functions.

## Features

- **Real-time SMS alerts** from TradingView indicators
- **Serverless architecture** with zero maintenance
- **Simple webhook integration** with TradingView
- **Reliable SMS delivery** via Twilio
- **TypeScript** for better code quality
- **One-click deployment** to Vercel

## How It Works

1. TradingView indicator triggers an alert
2. Alert sends webhook to your Vercel endpoint
3. System validates the alert data
4. SMS is sent via Twilio to your phone
5. You get notified instantly about trading opportunities

## Prerequisites

- Node.js 18+ installed
- Twilio account (free tier available)
- Vercel account (free tier available)
- TradingView account with alert capabilities

## Quick Start

### 1. Clone and Setup

```bash
# Create project directory
mkdir tradingview-sms-alerts
cd tradingview-sms-alerts

# Initialize and install dependencies
npm init -y
npm install twilio
npm install -D typescript @types/node @vercel/node
npm install -g vercel
```

### 2. Get Twilio Credentials

1. Sign up at [Twilio Console](https://console.twilio.com/)
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number (or use the free trial number)

### 3. Configure Environment Variables

Create `.env.local` file:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TO_PHONE_NUMBER=+1234567890
```

### 4. Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Copy the deployment URL - you'll need it for TradingView webhook configuration.

### 5. Configure TradingView Alert

1. Open your TradingView chart
2. Create an alert condition in your indicator
3. In the alert settings:
   - Set webhook URL to: `https://your-app.vercel.app/api/webhook`
   - Set message format to JSON:
   ```json
   {
     "symbol": "{{ticker}}",
     "action": "BUY",
     "price": {{close}},
     "timestamp": "{{time}}"
   }
   ```

## API Reference

### Webhook Endpoint

**POST** `/api/webhook`

Receives trading alerts from TradingView and sends SMS notifications.

#### Request Body

```json
{
  "symbol": "AAPL",
  "action": "BUY",
  "price": 150.25,
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### Response

```json
{
  "success": true,
  "message": "SMS sent"
}
```

#### Error Responses

- `400` - Missing required fields
- `405` - Method not allowed (only POST accepted)
- `500` - Failed to send SMS

## Development

### Local Development

```bash
# Start development server
npm run dev

# Use ngrok to expose local server
npx ngrok http 3000
```

Use the ngrok URL in TradingView webhook settings for testing.

### Project Structure

```
tradingview-sms-alerts/
├── api/
│   └── webhook.ts          # Main webhook endpoint
├── .env.local              # Environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Customization

### Message Format

Modify the SMS message format in `api/webhook.ts`:

```typescript
const message = `🚨 ${alert.symbol} ${alert.action} at $${alert.price}`;
```

### Add Filtering

Add basic filtering logic to prevent spam:

```typescript
// Simple duplicate prevention
const recentAlerts = new Map();
const alertKey = `${alert.symbol}-${alert.action}`;

if (recentAlerts.has(alertKey)) {
  return res.status(200).json({ message: 'Duplicate alert ignored' });
}

recentAlerts.set(alertKey, Date.now());
```

### Multiple Recipients

Send to multiple phone numbers:

```typescript
const phoneNumbers = [
  process.env.TO_PHONE_NUMBER,
  process.env.BACKUP_PHONE_NUMBER
];

for (const phoneNumber of phoneNumbers) {
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID | Yes |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token | Yes |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number | Yes |
| `TO_PHONE_NUMBER` | Phone number to receive SMS | Yes |
| `WEBHOOK_SECRET` | Optional webhook validation secret | No |

## Troubleshooting

### Common Issues

**SMS not sending:**
- Check Twilio credentials are correct
- Verify phone numbers are in E.164 format (+1234567890)
- Check Twilio console for error messages

**Webhook not receiving alerts:**
- Verify webhook URL is correct in TradingView
- Check Vercel function logs for errors
- Ensure TradingView alert message format is valid JSON

**Local development issues:**
- Make sure `.env.local` file exists and has correct variables
- Use `vercel dev` instead of `npm start` for local testing
- Check that ngrok is properly exposing your local server

### Debugging

Check Vercel function logs:
```bash
vercel logs
```

Test webhook locally:
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","action":"BUY","price":150.25,"timestamp":"2025-01-15T10:30:00Z"}'
```

## Costs

- **Vercel**: Free tier includes 100GB bandwidth and 100 serverless function invocations
- **Twilio**: $0.0075 per SMS in the US, free trial includes $15 credit
- **Estimated monthly cost**: $1-5 for typical usage (depends on alert frequency)

## Security

- Environment variables are encrypted in Vercel
- Webhook endpoint validates request format
- Optional webhook secret for additional security
- No sensitive data is logged or stored

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this for personal or commercial projects.

## Support

- [Twilio Documentation](https://www.twilio.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [TradingView Pine Script Documentation](https://www.tradingview.com/pine-script-docs/)

For issues with this project, please create an issue on GitHub.