const express = require('express');
const router = express.Router();
const { routeMessage } = require('./messageRouter');

router.get('/', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('Webhook verified by Meta');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

router.post('/', async (req, res) => {
  res.sendStatus(200);
  try {
    const body = req.body;
    if (body.object !== 'whatsapp_business_account') return;
    const value = body.entry?.[0]?.changes?.[0]?.value;
    if (!value?.messages) return;
    const message = value.messages[0];
    const from    = message.from;
    const msgType = message.type;
    if (msgType === 'text') {
      const text = message.text.body.trim();
      console.log(`[MSG] From: ${from} | Text: ${text}`);
      await routeMessage(from, text);
    } else if (msgType === 'interactive') {
      const reply = message.interactive?.button_reply?.title
                 || message.interactive?.list_reply?.title;
      if (reply) {
        console.log(`[BUTTON] From: ${from} | Reply: ${reply}`);
        await routeMessage(from, reply);
      }
    }
  } catch (err) {
    console.error('Webhook error:', err.message);
  }
});

module.exports = router;
