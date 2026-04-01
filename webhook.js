// ─────────────────────────────────────────────────────────
// routes/webhook.js
// Handles:
//   GET  /webhook — Meta webhook verification (one-time setup)
//   POST /webhook — Incoming WhatsApp messages
// ─────────────────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const { routeMessage } = require('../handlers/messageRouter');

// ── Step 1: Meta Webhook Verification ─────────────────────
// Meta sends a GET request to verify your webhook URL.
// You set VERIFY_TOKEN in your .env AND in Meta Console → Webhook config.
router.get('/', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('Webhook verified by Meta');
    res.status(200).send(challenge);
  } else {
    console.error('Webhook verification failed — token mismatch');
    res.sendStatus(403);
  }
});

// ── Step 2: Receive Incoming Messages ─────────────────────
// Meta sends a POST for every message your WhatsApp number receives.
// We MUST respond with 200 immediately, then process async.
router.post('/', async (req, res) => {
  res.sendStatus(200); // Acknowledge receipt immediately — Meta retries if delayed

  try {
    const body = req.body;

    // Validate it's a WhatsApp message event
    if (body.object !== 'whatsapp_business_account') return;

    const entry   = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value   = changes?.value;

    // Ignore delivery receipts, read receipts, etc.
    if (!value?.messages) return;

    const message  = value.messages[0];
    const from     = message.from;          // Customer's phone number
    const msgType  = message.type;          // 'text', 'interactive', 'image', etc.

    // Only handle text messages and interactive button replies for now
    if (msgType === 'text') {
      const text = message.text.body.trim();
      console.log(`[MSG] From: ${from} | Text: ${text}`);
      await routeMessage(from, text);
    } else if (msgType === 'interactive') {
      // Handle quick-reply button taps
      const reply = message.interactive?.button_reply?.title
                 || message.interactive?.list_reply?.title;
      if (reply) {
        console.log(`[BUTTON] From: ${from} | Reply: ${reply}`);
        await routeMessage(from, reply);
      }
    }
  } catch (err) {
    console.error('Error processing webhook:', err.message);
  }
});

module.exports = router;
