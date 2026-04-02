require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const token = (process.env.WHATSAPP_TOKEN || '').replace(/[\r\n\t\s]/g, '').trim();
console.log('TOKEN CHECK — Length:', token.length);
console.log('TOKEN CHECK — First 10 chars:', token.substring(0, 10));
if (!token) {
  console.error('FATAL: WHATSAPP_TOKEN is missing or empty!');
}
// ───────────────────

app.get('/', (req, res) => {
  res.json({ status: 'FoodPost Bot is running', timestamp: new Date().toISOString() });
});
app.use('/webhook', require('./webhook'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FoodPost Bot listening on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.json({ status: 'FoodPost Bot is running', timestamp: new Date().toISOString() });
});

app.use('/webhook', require('./webhook'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FoodPost Bot listening on port ${PORT}`);
});
