// ─────────────────────────────────────────────────────────
// utils/whatsapp.js
// All functions for sending messages back to customers
// via the Meta WhatsApp Cloud API.
// ─────────────────────────────────────────────────────────
const axios = require('axios');

const BASE_URL = 'https://graph.facebook.com/v18.0';
const PHONE_ID = () => process.env.PHONE_NUMBER_ID;
const TOKEN = () => (process.env.WHATSAPP_TOKEN || '').replace(/[\r\n\t\s]/g, '').trim();

// ── Core send function ────────────────────────────────────
async function sendRequest(payload) {
  try {
    const res = await axios.post(
      `${BASE_URL}/${PHONE_ID()}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (err) {
    const errData = err.response?.data;
    console.error('WhatsApp send error:', JSON.stringify(errData || err.message));
    throw err;
  }
}

// ── Send plain text ───────────────────────────────────────
// Use for most replies. Supports WhatsApp markdown: *bold*, _italic_
async function sendText(to, text) {
  return sendRequest({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: {
      preview_url: false,
      body: text,
    },
  });
}

// ── Send message with up to 3 quick-reply buttons ─────────
// buttons: [{ id: 'btn_id', title: 'Button Label' }, ...]
// Max 3 buttons, title max 20 chars each
async function sendButtons(to, bodyText, buttons) {
  return sendRequest({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: bodyText },
      action: {
        buttons: buttons.map(b => ({
          type: 'reply',
          reply: { id: b.id, title: b.title.substring(0, 20) },
        })),
      },
    },
  });
}

// ── Send a list menu (up to 10 items) ─────────────────────
// sections: [{ title: 'Section', rows: [{ id, title, description }] }]
// Good for sending menu options
async function sendList(to, headerText, bodyText, buttonLabel, sections) {
  return sendRequest({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: { type: 'text', text: headerText },
      body:   { text: bodyText },
      footer: { text: 'FoodPost · +91 9867236115' },
      action: {
        button: buttonLabel,
        sections,
      },
    },
  });
}

// ── Send an image with optional caption ───────────────────
async function sendImage(to, imageUrl, caption = '') {
  return sendRequest({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'image',
    image: { link: imageUrl, caption },
  });
}

// ── Mark a message as read (good UX — shows double blue ticks) ──
async function markAsRead(messageId) {
  return sendRequest({
    messaging_product: 'whatsapp',
    status: 'read',
    message_id: messageId,
  });
}
// ── Send a document/PDF with optional caption ─────────────
async function sendDocument(to, documentUrl, caption = '') {
  return sendRequest({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'document',
    document: { link: documentUrl, caption, filename: 'FoodPost_Menu.pdf' },
  });
}
module.exports = { sendText, sendButtons, sendList, sendImage, markAsRead, sendDocument };
