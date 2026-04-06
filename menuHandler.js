const { sendText } = require('./whatsapp');
const axios = require('axios');

async function sendMainMenu(from) {
  try {
    const TOKEN = (process.env.WHATSAPP_TOKEN || '').replace(/[\r\n\t\s]/g, '').trim();
    const PHONE_ID = process.env.PHONE_NUMBER_ID;
    
    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: from,
        type: 'document',
        document: {
          link: 'https://raw.githubusercontent.com/manavmahadik007-commits/foodpost-bot-/main/menu.pdf',
          filename: 'FoodPost_Menu.pdf',
          caption: 'FoodPost Ready-to-Cook Menu 🍱\nNo preservatives · 6–8 months shelf life\nTo order: +91 9867236115'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('PDF sent successfully to', from);
  } catch (err) {
    console.error('PDF send error:', JSON.stringify(err.response?.data || err.message));
    await sendText(from, 
      `📋 *FoodPost Ready-to-Cook Menu*\n\nView our menu here:\nhttps://raw.githubusercontent.com/manavmahadik007-commits/foodpost-bot-/main/menu.pdf\n\nTo order: +91 9867236115`
    );
  }
}

async function sendServiceInfo(from) {
  const text =
    `*FoodPost Dehydration Services* ⚗️\n\n` +
    `*Service options:*\n` +
    `1. Only Dehydration / Vacuum Seal\n` +
    `2. Pick-up + Dehydration\n` +
    `3. Pick-up + Dehydration + Courier (worldwide)\n\n` +
    `*Pricing:*\n` +
    `• Heat Dehydration: *Rs. 375/kg* (MOQ: 3 kg)\n` +
    `• Freeze Drying: *Rs. 400/kg* (MOQ: 20 kg)\n\n` +
    `To book: +91 9867236115`;
  await sendText(from, text);
}

module.exports = { sendMainMenu, sendServiceInfo };
