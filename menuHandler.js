const { sendText, sendDocument } = require('./whatsapp');

// ── IMPORTANT: Upload your menu.pdf to Google Drive ───────
// 1. Go to drive.google.com
// 2. Upload menu.pdf
// 3. Right-click → Share → "Anyone with the link" → Viewer
// 4. Copy the file ID from the URL:
//    https://drive.google.com/file/d/FILE_ID_HERE/view
// 5. Replace FILE_ID_HERE below with your actual file ID
const MENU_PDF_URL = 'https://drive.google.com/uc?export=download&id=1ETcARp9mc6VV2s8tsVpJbS_Lez0inCer';

async function sendMainMenu(to) {
  try {
    // Send the PDF menu
    await sendDocument(
      to,
      MENU_PDF_URL,
      'FoodPost_Menu.pdf',
      '🍱 *FoodPost Ready Packaged Menu*\n\nAll items serve 1 person. Minimum order: 6 packets.\n\nCall us to order:\n📞 +91 98672 36115 | +91 98207 33103'
    );
  } catch (err) {
    console.error('Menu send error:', err.message);
    // Fallback to text menu if PDF fails
    await sendText(to,
      `🍱 *FoodPost Ready Packaged Menu* (Serves 1 person)\n\n` +
      `• Upma — ₹180\n` +
      `• Pohe — ₹180\n` +
      `• Sheera — ₹190\n` +
      `• Misal — ₹165\n` +
      `• Pav Bhaji — ₹190\n` +
      `• Rajma — ₹205\n` +
      `• Dal Makhani — ₹205\n` +
      `• Gujarati Dal — ₹190\n` +
      `• Veg Biryani — ₹205\n` +
      `• Green Gravy — ₹195\n` +
      `• Red Gravy — ₹195\n` +
      `• Yellow Gravy — ₹195\n\n` +
      `_Minimum order: 6 packets_\n` +
      `_We also make to order as per your requirements_\n\n` +
      `📞 +91 98672 36115 | +91 98207 33103`
    );
  }
}

async function sendServiceInfo(to) {
  await sendText(to,
    `🏠 *Dehydrate Your Food with FoodPost!*\n\n` +
    `Send us your home-cooked food or favourite restaurant food — we dehydrate or freeze-dry it and pack it into ready-to-cook packets. Ships anywhere in the world!\n\n` +
    `*💰 Pricing:*\n` +
    `• Heat Dehydration: *Rs. 375/kg* (MOQ: 3 kg)\n` +
    `• Freeze Drying: *Rs. 400/kg* (MOQ: 20 kg)\n\n` +
    `*✅ What we offer:*\n` +
    `• Only Dehydration / Vacuum Seal\n` +
    `• Pick-up + Dehydration\n` +
    `• Pick-up + Dehydration + Courier _(worldwide)_\n\n` +
    `*📋 Quick prep tips:*\n` +
    `• Minimal oil / ghee\n` +
    `• Dal with less water\n` +
    `• Cut vegetables small\n` +
    `• Paneer must be *grated only*\n` +
    `• Send in labelled disposable containers\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `📅 *Ready to book your slot?*\n` +
    `Tap the link below to book directly on our website:\n\n` +
    `👉 http://www.food-post.in/book-your-slot\n\n` +
    `📞 Questions? Call us:\n` +
    `+91 9867236115 | +91 9820733103`
  );
}

module.exports = { sendMainMenu, sendServiceInfo };
