const { sendText, sendButtons } = require('./whatsapp');

async function sendMainMenu(from) {
  const part1 =
    `*🍱 FoodPost — Ready Packaged Food Menu*\n` +
    `_No preservatives · Exact same taste · All nutrients intact_\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `*SERVES 1 PERSON*\n\n` +
    `🥣 Upma  ........................  *Rs. 180*\n` +
    `    _Savour with sev_\n\n` +
    `🍚 Pohe  ........................  *Rs. 180*\n` +
    `    _Savour with sev_\n\n` +
    `🍮 Sheera  ......................  *Rs. 190*\n` +
    `    _Dessert that leaves you fulfilled_\n\n` +
    `🌶️ Misal  .......................  *Rs. 165*\n` +
    `    _Authentic Maharashtrian, with pav_\n\n` +
    `🍛 Pav Bhaji  ...................  *Rs. 190*\n` +
    `    _Gujarati style_\n\n` +
    `🫘 Rajma  .......................  *Rs. 205*\n` +
    `    _Savour with steaming plain rice_\n\n` +
    `🫕 Dal Makhani  .................  *Rs. 205*\n` +
    `    _Savour with steaming plain rice_\n\n` +
    `🟡 Gujarati Dal  ................  *Rs. 190*\n` +
    `    _Savour with steaming plain rice_\n\n` +
    `🍛 Veg Biryani  .................  *Rs. 205*\n` +
    `    _Indian rice, goes well with raita_\n\n` +
    `🟢 Green Gravy  .................  *Rs. 195*\n` +
    `    _Paneer / mushroom / chicken_\n\n` +
    `🔴 Red Gravy  ...................  *Rs. 195*\n` +
    `    _Paneer / mushroom / chicken_\n\n` +
    `🟡 Yellow Gravy  ................  *Rs. 195*\n` +
    `    _Paneer / mushroom / chicken_`;

  const part2 =
    `*SERVES 2 PEOPLE — PREMIUM*\n\n` +
    `🍖 Koyla Makhani Gravy  .........  *Rs. 310*\n` +
    `    _Paneer / mushroom / chicken_\n\n` +
    `🫕 Koyla Dal Makhani  ...........  *Rs. 375*\n` +
    `    _Savour with steaming plain rice_\n\n` +
    `🫘 Koyla Amritsari Rajma  .......  *Rs. 350*\n` +
    `    _With roti or steaming plain rice_\n\n` +
    `🟤 Chandni Chowk Ke Chana  ......  *Rs. 350*\n` +
    `    _With roti or steaming plain rice_\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 *Min order:* 6 packets (in-house) · 12 packets (full)\n` +
    `📞 *To order:* +91 9867236115 | +91 9820733103\n` +
    `📸 *Instagram:* @foodpostit\n\n` +
    `_We also make to order as per your requirements!_`;

  await sendText(from, part1);
  await new Promise(r => setTimeout(r, 800));
  await sendText(from, part2);
  await new Promise(r => setTimeout(r, 800));
  await sendButtons(from,
    'What would you like to do next?',
    [
      { id: 'order',   title: 'Place an order' },
      { id: 'service', title: 'Dehydrate my food' },
      { id: 'contact', title: 'Talk to our team' },
    ]
  );
}

async function sendServiceInfo(from) {
  await sendText(from,
    `*⚗️ FoodPost Dehydration Services*\n\n` +
    `*Service options:*\n` +
    `1. Only Dehydration / Vacuum Seal\n` +
    `2. Pick-up + Dehydration\n` +
    `3. Pick-up + Dehydration + Courier _(anywhere in the world)_\n\n` +
    `*💰 Pricing:*\n` +
    `• Heat Dehydration: *Rs. 375/kg* (MOQ: 3 kg)\n` +
    `• Freeze Drying: *Rs. 400/kg* (MOQ: 20 kg)\n\n` +
    `*Freeze drying batch days:* Tue, Thu, Sat only\n` +
    `📍 Up to 30 kg/day → Vile Parle, Mumbai\n` +
    `📍 30–100 kg/day → Nagpur facility\n\n` +
    `*📋 Prep tips before sending your food:*\n` +
    `• Use minimal oil / ghee\n` +
    `• Cook dal with less water\n` +
    `• Cut all vegetables into small pieces\n` +
    `• Paneer must be *grated only* — no chunks\n` +
    `• Send in labelled disposable containers\n` +
    `• Always send fresh food from the same day\n\n` +
    `📞 To book: +91 9867236115`
  );
}

module.exports = { sendMainMenu, sendServiceInfo };
