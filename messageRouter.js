const { sendText, sendButtons } = require('./whatsapp');
const { askClaude }             = require('./claude');
const { triggerHandoff }        = require('./handoffHandler');
const { sendMainMenu, sendServiceInfo } = require('./menuHandler');

const sessions = new Map();

function getSession(phone) {
  if (!sessions.has(phone)) {
    sessions.set(phone, {
      phone, stage: 'new', messageCount: 0,
      history: [], hotScore: 0, quantity: null,
    });
  }
  return sessions.get(phone);
}

const HOT_SIGNALS = [
  { pattern: /\b(restaurant|hotel|cafe|cloud kitchen|catering|franchise|branch)\b/i, score: 3 },
  { pattern: /\b(\d+)\s*(kg|kgs|kilos|kilogram)/i, score: 2 },
  { pattern: /\b(bulk|wholesale|large|supply|monthly|weekly)\b/i, score: 2 },
  { pattern: /\b(quote|quotation|sample)\b/i, score: 2 },
];

function scoreMessage(text, session) {
  HOT_SIGNALS.forEach(({ pattern, score }) => {
    if (pattern.test(text)) {
      session.hotScore = Math.min(10, session.hotScore + score);
      const m = text.match(/(\d+)\s*(kg|kgs|kilos)/i);
      if (m) session.quantity = m[0];
    }
  });
}

const GREETINGS  = ['hi','hii','hiii','hello','hey','namaste','helo','start','good morning','good afternoon','good evening'];
const MENU_KW    = ['menu', 'packets', 'dishes', 'items', 'what do you have', 'what do you sell', 'price', 'rate', 'cost', 'how much', 'kin'];
const SERVICE_KW = ['dehydrat','freeze','preserve','pick up','pickup','send my food','ghar ka khana','my own food','dehydrate my food'];
const CONTACT_KW = ['talk','speak','human','person','team','contact','call us now','call','talk to our team'];
const ORDER_KW   = ['order','place an order','buy','purchase','book'];
const B2B_KW     = ['business inquiry','business','restaurant','b2b','bulk','wholesale'];

async function sendWelcome(from) {
  await sendButtons(from,
    `Namaste! 🙏 Welcome to *FoodPost* — Home Food, Everywhere!\n\nWe dehydrate and freeze-dry your food — no preservatives, exact same taste, all nutrients intact.\n\nHow can I help you today?`,
    [
      { id: 'menu',    title: 'See our menu' },
      { id: 'service', title: 'Dehydrate my food' },
      { id: 'b2b',     title: 'Business inquiry' },
    ]
  );
}

async function routeMessage(from, text) {
  const session = getSession(from);
  session.messageCount++;
  const lower = text.toLowerCase().trim();
  session.history.push({ role: 'user', content: text });
  if (session.history.length > 10) session.history.shift();
  scoreMessage(text, session);

  if (session.messageCount === 1 || GREETINGS.includes(lower) || GREETINGS.some(g => lower.startsWith(g + ' '))) {
    session.stage = 'browsing';
    await sendWelcome(from);
    return;
  }
  if (MENU_KW.some(k => lower.includes(k))) {
    session.stage = 'browsing';
    await sendMainMenu(from);
    return;
  }
  if (SERVICE_KW.some(k => lower.includes(k))) {
    await sendServiceInfo(from);
    return;
  }
  if (CONTACT_KW.some(k => lower.includes(k))) {
    await sendText(from,
      `Our team is available *Mon–Sat, 10 AM – 7 PM IST* 📞\n\n+91 9867236115\n+91 9820733103\n@foodpostit on Instagram\n\n📍 Sai Prasad, Nanda Patkar Road, Vile Parle (E), Mumbai – 400057`
    );
    return;
  }
  if (ORDER_KW.some(k => lower.includes(k))) {
    await sendText(from,
      `To place your order:\n\n• Min *6 packets* (in-house menu)\n• Min *12 packets* (full menu)\n\n📞 Call or WhatsApp us:\n+91 9867236115\n+91 9820733103`
    );
    return;
  }
  if (B2B_KW.some(k => lower.includes(k))) {
    session.hotScore += 3;
    if (session.hotScore >= 6 && session.stage !== 'handoff') {
      session.stage = 'handoff';
      await triggerHandoff(from, session, text);
      return;
    }
    await sendButtons(from,
      `Great! FoodPost works with restaurants, cloud kitchens & franchises.\n\nWe preserve signature masalas & purees for 6–8 months without preservatives.\n\nHow much would you like to send per day?`,
      [
        { id: 'under30',  title: 'Under 30 kg/day' },
        { id: 'over30',   title: '30–100 kg/day' },
        { id: 'getquote', title: 'Get a custom quote' },
      ]
    );
    return;
  }
  if (session.hotScore >= 6 && session.stage !== 'handoff') {
    session.stage = 'handoff';
    await triggerHandoff(from, session, text);
    return;
  }
  try {
    const reply = await askClaude(text, session.history.slice(-6));
    await sendText(from, reply);
    session.history.push({ role: 'assistant', content: reply });
  } catch (err) {
    console.error('Claude error:', err.message);
    await sendText(from, `I couldn't process that right now. Please call us:\n📞 +91 9867236115`);
  }
}

module.exports = { routeMessage };
