require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

// ── Crash protection ──
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message, err.stack);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

// ── Token check ──
const token = (process.env.WHATSAPP_TOKEN || '').replace(/[\r\n\t\s]/g, '').trim();
console.log('TOKEN LENGTH:', token.length);
if (!token) console.error('FATAL: WHATSAPP_TOKEN is missing!');

app.get('/', (req, res) => {
  res.json({ status: 'FoodPost Bot is running', timestamp: new Date().toISOString() });
});

app.use('/webhook', require('./webhook'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`FoodPost Bot listening on port ${PORT}`);
});

// ── Keep-alive ping (prevents Render free tier sleep) ──
const https = require('https');
setInterval(() => {
  https.get('https://foodpost-bot.onrender.com/', (res) => {
    console.log(`[KEEP-ALIVE] Ping status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error('[KEEP-ALIVE] Ping failed:', err.message);
  });
}, 14 * 60 * 1000); // every 14 minutes
