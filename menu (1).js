const { sendText, sendDocument } = require('./whatsapp');

async function sendMainMenu(from) {
  await sendDocument(
    from,
    'https://raw.githubusercontent.com/manavmahadik007-commits/foodpost-bot-/main/menu.pdf',
    'FoodPost Ready-to-Cook Menu 🍱\nNo preservatives · 6–8 months shelf life\nTo order: +91 9867236115'
  );
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
    `*Freeze drying batch days:* Tue, Thu, Sat\n` +
    `Up to 30 kg/day at Vile Parle · 30–100 kg/day at Nagpur\n\n` +
    `*Prep tips:*\n` +
    `• Minimal oil/ghee\n• Dal with less water\n• Cut veggies small\n• Paneer grated only\n• Labelled disposable containers\n\n` +
    `To book: +91 9867236115`;
  await sendText(from, text);
}

module.exports = { sendMainMenu, sendServiceInfo };
