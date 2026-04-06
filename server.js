require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'FoodPost Bot is running', timestamp: new Date().toISOString() });
});

app.use('/webhook', require('./webhook'));

app.listen(process.env.PORT || 3000, () => {
  console.log(`FoodPost Bot listening on port ${process.env.PORT || 3000}`);
});
