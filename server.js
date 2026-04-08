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

// ── Token check on startup ──
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
