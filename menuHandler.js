const { sendText, sendDocument } = require('./whatsapp');

const READY_MENU = [
  { name: 'Upma',               price: 'Rs. 180' },
  { name: 'Pohe',               price: 'Rs. 180' },
  { name: 'Sheera',             price: 'Rs. 190' },
  { name: 'Misal',              price: 'Rs. 165' },
  { name: 'Pav Bhaji',          price: 'Rs. 190' },
  { name: 'Rajma',              price: 'Rs. 205' },
  { name: 'Dal Makhani',        price: 'Rs. 205' },
  { name: 'Gujarati Dal',       price: 'Rs. 175' },
  { name: 'Mix Dal',            price: 'Rs. 180' },
  { name: 'Masala Dal',         price: 'Rs. 180' },
  { name: 'Veg Biryani',        price: 'Rs. 205' },
  { name: 'Biryani',            price: 'Rs. 190' },
  { name: 'Pesto Rice',         price: 'Rs. 170' },
  { name: 'Green Gravy',        price: 'Rs. 195' },
  { name: 'Red Gravy',          price: 'Rs. 195' },
  { name: 'Yellow Gravy',       price: 'Rs. 195' },
  { name: 'Reshmi Tikka Gravy', price: 'Rs. 190' },
  { name: 'Tikka Gravy',        price: 'Rs. 190' },
  { name: 'Sarson Da Saag',     price: 'Rs. 190' },
];

const SERVES_TWO = [
  { name: 'Koyla Makhani Gravy',    price: 'Rs. 310' },
  { name: 'Koyla Dal Makhani',      price: 'Rs. 375' },
  { name: 'Koyla Amritsari Rajma',  price: 'Rs. 350' },
  { name: 'Chandni Chowk Ke Chana', price: 'Rs. 350' },
];

async function sendMainMenu(from) {
  await sendDocument(
    from,
    'https://drive.google.com/uc?export=download&id=1QPX63ARIV8BpXLXyMV22tk3XsXUbWx0G',
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
