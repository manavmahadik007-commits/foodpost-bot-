// ─────────────────────────────────────────────────────────
// data/products.js
// Single source of truth for all FoodPost pricing & products.
// Update here whenever you add dishes or change prices.
// ─────────────────────────────────────────────────────────

const READY_MENU = [
  { name: 'Upma',                price: 'Rs. 180', serves: 1, desc: 'Savour with sev' },
  { name: 'Pohe',                price: 'Rs. 180', serves: 1, desc: 'Savour with sev' },
  { name: 'Sheera',              price: 'Rs. 190', serves: 1, desc: 'Dessert' },
  { name: 'Misal',               price: 'Rs. 150–165', serves: 1, desc: 'With pav (Maharashtrian)' },
  { name: 'Pav Bhaji',           price: 'Rs. 190', serves: 1, desc: 'Gujarati style' },
  { name: 'Rajma',               price: 'Rs. 205', serves: 1, desc: 'With steaming plain rice' },
  { name: 'Dal Makhani',         price: 'Rs. 205', serves: 1, desc: 'With steaming plain rice' },
  { name: 'Gujarati Dal',        price: 'Rs. 175–190', serves: 1, desc: 'With steaming plain rice' },
  { name: 'Mix Dal',             price: 'Rs. 180', serves: 1, desc: 'With steaming plain rice' },
  { name: 'Masala Dal',          price: 'Rs. 180', serves: 1, desc: 'Lentils with tadka' },
  { name: 'Veg Biryani',         price: 'Rs. 205', serves: 1, desc: 'With raita/yogurt' },
  { name: 'Biryani',             price: 'Rs. 190', serves: 1, desc: 'With raita/yogurt' },
  { name: 'Pesto Rice',          price: 'Rs. 170', serves: 1, desc: 'Green basil sauce with rice' },
  { name: 'Green Gravy',         price: 'Rs. 180–195', serves: 1, desc: 'Paneer/mushroom/chicken' },
  { name: 'Red Gravy',           price: 'Rs. 180–195', serves: 1, desc: 'Paneer/mushroom/chicken' },
  { name: 'Yellow Gravy',        price: 'Rs. 180–195', serves: 1, desc: 'Paneer/mushroom/chicken' },
  { name: 'Reshmi Tikka Gravy',  price: 'Rs. 190', serves: 1, desc: 'Paneer/veggies/chicken' },
  { name: 'Tikka Gravy',         price: 'Rs. 190', serves: 1, desc: 'Paneer/chicken/rice' },
  { name: 'Sarson Da Saag',      price: 'Rs. 190', serves: 1, desc: 'With makki ki roti or rice' },
];

const SERVES_TWO = [
  { name: 'Koyla Makhani Gravy',  price: 'Rs. 310', serves: 2, desc: 'Paneer/mushroom/chicken' },
  { name: 'Koyla Dal Makhani',    price: 'Rs. 375', serves: 2, desc: 'With steaming plain rice' },
  { name: 'Koyla Amritsari Rajma',price: 'Rs. 350', serves: 2, desc: 'With roti or rice' },
  { name: 'Chandni Chowk Ke Chana',price: 'Rs. 350', serves: 2, desc: 'With roti or rice' },
];

const SERVICE_PRICING = [
  {
    name: 'Heat Dehydration',
    price: 'Rs. 375/kg',
    priceNum: 375,
    moq: '3 kg',
    moqNum: 3,
    facility: 'Vile Parle, Mumbai',
    capacity: 'Up to 30 kg/day',
    desc: 'Best for gravies, dals, curries, rice dishes',
  },
  {
    name: 'Freeze Drying',
    price: 'Rs. 400/kg',
    priceNum: 400,
    moq: '20 kg',
    moqNum: 20,
    facility: 'Nagpur facility',
    capacity: '30–100 kg/day',
    batchDays: 'Tuesday, Thursday, Saturday',
    desc: 'Best for fruits, premium ingredients, maximum nutrient retention',
  },
];

const CONTACT = {
  phone1: '+91 9867236115',
  phone2: '+91 9820733103',
  instagram: '@foodpostit',
  address: 'Sai Prasad, Nanda Patkar Road, Vile Parle (E), Mumbai – 400057',
  hours: 'Mon–Sat, 10 AM – 7 PM IST',
  fssai: '21523005001158',
};

module.exports = { READY_MENU, SERVES_TWO, SERVICE_PRICING, CONTACT };
