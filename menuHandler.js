// ─────────────────────────────────────────────────────────
// handlers/menuHandler.js
// Sends formatted menu lists and service info to customers
// ─────────────────────────────────────────────────────────
const { sendText, sendList } = require('./whatsapp')
const { READY_MENU, SERVES_TWO, SERVICE_PRICING } = require('../data/products');

async function sendMainMenu(from) {
  const text =
    `*FoodPost Ready-to-Cook Menu* 🍱\n\n` +
    `All dishes are dehydrated, with *no preservatives* and shelf life of 6–8 months.\n\n` +
    `*Serves 1 person:*\n` +
    READY_MENU.map(i => `• ${i.name.padEnd(24)} *${i.price}*`).join('\n') +
    `\n\n*Serves 2 people (Premium):*\n` +
    SERVES_TWO.map(i => `• ${i.name.padEnd(24)} *${i.price}*`).join('\n') +
    `\n\nMin. order: *6 packets* (in-house menu) · *12 packets* (full order)\n\nTo order: +91 9867236115`;

  await sendText(from, text);
}

async function sendServiceInfo(from) {
  const text =
    `*FoodPost Dehydration Services* ⚗️\n\n` +
    `We dehydrate or freeze-dry your home food, restaurant food, or custom ingredients.\n\n` +
    `*Service options:*\n` +
    `1. Only Dehydration / Vacuum Seal\n` +
    `2. Pick-up + Dehydration\n` +
    `3. Pick-up + Dehydration + Courier (anywhere in the world)\n\n` +
    `*Pricing:*\n` +
    SERVICE_PRICING.map(s => `• ${s.name}: *${s.price}* (MOQ: ${s.moq})`).join('\n') +
    `\n\n*Freeze drying batch days:* Tue, Thu, Sat\n` +
    `📍 Up to 30 kg/day at Vile Parle · 30–100 kg/day at Nagpur facility\n\n` +
    `*Food prep tips before sending:*\n` +
    `• Use minimal oil/ghee\n` +
    `• Cook dal with less water\n` +
    `• Cut vegetables into small pieces\n` +
    `• Grate paneer — no large chunks\n` +
    `• Send in labelled disposable containers\n\n` +
    `To book a pick-up: +91 9867236115`;

  await sendText(from, text);
}

async function sendPricingInfo(from) {
  const text =
    `*FoodPost Pricing* 💰\n\n` +
    `*Ready-to-cook packets:*\n` +
    `• Starts from Rs. 150 (Misal, serves 1)\n` +
    `• Up to Rs. 375 (Koyla Dal Makhani, serves 2)\n` +
    `• Min. order: 6–12 packets\n\n` +
    `*Dehydration / Freeze Drying Service:*\n` +
    SERVICE_PRICING.map(s => `• ${s.name}: *${s.price}* | MOQ ${s.moq}`).join('\n') +
    `\n\n*Packaging:* Silver or black pouches · up to 80g/packet · custom sizes available\n\n` +
    `For B2B / bulk quotes: +91 9867236115`;

  await sendText(from, text);
}

module.exports = { sendMainMenu, sendServiceInfo, sendPricingInfo };
