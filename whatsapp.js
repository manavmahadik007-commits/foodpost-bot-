const axios = require('axios');

const BASE_URL = 'https://graph.facebook.com/v18.0';
const PHONE_ID = () => process.env.PHONE_NUMBER_ID?.trim();
const TOKEN    = () => (process.env.WHATSAPP_TOKEN || '').replace(/[\r\n\t\s]/g, '').trim();

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

async function sendText(to, text) {
  return sendRequest({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { preview_url: false, body: text },
  });
}

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
      action: { button: buttonLabel, sections },
    },
  });
}

async function sendImage(to, imageUrl, caption = '') {
  return sendRequest({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'image',
    image: { link: imageUrl, caption },
  });
}

// ── Send PDF document ──────────────────────────────────────
// Upload your menu PDF to Google Drive or Dropbox as a PUBLIC link
async function sendDocument(to, documentUrl, filename, caption = '') {
  return sendRequest({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'document',
    document: {
      link: documentUrl,
      filename: filename,
      caption: caption,
    },
  });
}

async function markAsRead(messageId) {
  return sendRequest({
    messaging_product: 'whatsapp',
    status: 'read',
    message_id: messageId,
  });
}

module.exports = { sendText, sendButtons, sendList, sendImage, sendDocument, markAsRead };
