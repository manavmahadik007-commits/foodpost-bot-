// ─────────────────────────────────────────────────────────
// server.js — FoodPost WhatsApp Bot Entry Point
// ─────────────────────────────────────────────────────────
require('dotenv').config();
const express = require('express');
const webhookRouter = require('./routes/webhook');

const app = express();
app.use(express.json());

// Health check — Railway/Render ping this to verify the server is alive
app.get('/', (req, res) => {
  res.json({ status: 'FoodPost Bot is running', timestamp: new Date().toISOString() });
});

// All WhatsApp traffic goes through /webhook
app.use('/webhook', webhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FoodPost Bot listening on port ${PORT}`);
  console.log(`Webhook URL: https://your-domain.com/webhook`);
});
