# FoodPost WhatsApp AI Bot

AI-powered WhatsApp assistant for FoodPost — built with Node.js, Meta Cloud API, and Claude.

---

## Project Structure

```
foodpost-bot/
├── server.js                ← Entry point — Express server
├── .env.example             ← Copy to .env and fill in your keys
├── package.json
├── routes/
│   └── webhook.js           ← WhatsApp webhook (GET verify + POST messages)
├── handlers/
│   ├── messageRouter.js     ← Core logic: routes every message
│   ├── menuHandler.js       ← Sends formatted menu & service info
│   └── handoffHandler.js    ← Hot lead detection + sales team alert
├── ai/
│   └── claude.js            ← Anthropic API + FoodPost knowledge base
├── data/
│   └── products.js          ← All products, prices, contact info
└── utils/
    └── whatsapp.js          ← Send text, buttons, lists via Meta API
```

---

## Step-by-Step Setup

### 1. Get your Meta credentials

1. Go to https://developers.facebook.com and create an app (Business type)
2. Add the **WhatsApp** product to your app
3. Go to WhatsApp → API Setup
4. Copy your **Phone Number ID** and **WhatsApp Business Account ID**
5. Generate a **permanent access token** (System User in Business Manager)
6. Note your **test phone number** for development

### 2. Install and configure

```bash
# Clone / copy this project
cd foodpost-bot

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your real values
```

Your `.env` file needs:
```
WHATSAPP_TOKEN=your_token
PHONE_NUMBER_ID=your_phone_id
VERIFY_TOKEN=foodpost_secret_2024    # you choose this
ANTHROPIC_API_KEY=sk-ant-...
SALES_TEAM_WHATSAPP=919867236115     # your sales WhatsApp (no +)
PORT=3000
```

### 3. Deploy to Railway (recommended — free tier)

1. Push code to a GitHub repo
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variables in Railway dashboard (copy from .env)
4. Railway gives you a public HTTPS URL automatically

### 4. Register the webhook with Meta

1. In Meta Developer Console → WhatsApp → Configuration → Webhook
2. Set **Callback URL** to: `https://your-railway-url.railway.app/webhook`
3. Set **Verify Token** to: `foodpost_secret_2024` (same as your .env)
4. Click **Verify and Save**
5. Subscribe to the **messages** field

### 5. Start the server (local development)

```bash
npm run dev       # uses nodemon for auto-restart
# or
npm start         # production
```

For local dev, use ngrok to expose your local server:
```bash
npx ngrok http 3000
# Copy the https URL and use it as your webhook URL in Meta Console
```

---

## How the Bot Works

```
Customer WhatsApp message
        ↓
Meta Cloud API → POST /webhook
        ↓
messageRouter.js
  ├── Greeting?        → Welcome message + buttons
  ├── Menu keyword?    → menuHandler.sendMainMenu()
  ├── Service keyword? → menuHandler.sendServiceInfo()
  ├── Contact keyword? → Send phone/Instagram details
  ├── Hot lead?        → handoffHandler.triggerHandoff()
  │     ├── Message customer: "Team will contact you in 2 hours"
  │     └── Alert sales team WhatsApp with full lead details
  └── Anything else?   → askClaude() with conversation history
```

## Hot Lead Scoring

The bot automatically scores each message:

| Signal | Score |
|--------|-------|
| Mentions restaurant/hotel/franchise/catering | +3 |
| Mentions kg quantity | +2 |
| Mentions bulk/wholesale/monthly | +2 |
| Asks for quote/sample | +2 |
| Mentions urgency | +1 |

When score reaches **6/10**, the handoff triggers automatically.

---

## Updating the Knowledge Base

To add new dishes or change prices:
1. Edit `data/products.js` — update prices, add new dishes
2. Edit the `SYSTEM_PROMPT` in `ai/claude.js` — update the pricing section
3. No redeployment needed if using Railway — just push to GitHub

---

## Customisation

- **Add more scenarios**: extend `messageRouter.js` with new keyword arrays
- **Add image messages**: use `sendImage()` from `utils/whatsapp.js`
- **Persist sessions**: replace the in-memory `Map` in `messageRouter.js` with Redis or Firestore
- **Analytics**: log sessions to a database to track popular dishes and conversion rates
- **Multi-language**: the Claude system prompt already handles Hindi/Hinglish automatically
