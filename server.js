require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'FoodPost Bot is running', timestamp: new Date().toISOString() });
});

app.use('/webhook', require('./webhook'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FoodPost Bot listening on port ${PORT}`);
});
