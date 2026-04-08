const axios = require('axios');
const BASE_URL = 'https://graph.facebook.com/v18.0';

async function sendRequest(payload) {
  const res = await axios.post(
    `${BASE_URL}/${process.env.PHONE_NUMBER_ID}/messages`,
    payload,
    {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
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

module.exports = { sendText, sendButtons };
