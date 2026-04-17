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
    `🏠 *Dehydrate Your Own Food — "Ghar Ka Khana" Service*\n\n` +
    `If you're in Mumbai, we can:\n` +
    `✅ Pick up your home-cooked food\n` +
    `✅ Dehydrate or freeze-dry it\n` +
    `✅ Package in single-serving ready-to-cook packets\n` +
    `✅ Deliver back to you or ship anywhere\n\n` +
    `*No preservatives. Exact same taste. All nutrients intact.*\n\n` +
    `📍 Sai Prasad, Nanda Patkar Road, Vile Parle (E), Mumbai 400057\n` +
    `📞 +91 98672 36115 | +91 98207 33103\n` +
    `📸 @foodpostit on Instagram\n\n` +
    `📅 *Ready to get started? Book your slot here:*\n` +
    `http://www.food-post.in/book-your-slot`
  );
}

module.exports = { sendMainMenu, sendServiceInfo };
