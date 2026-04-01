// ─────────────────────────────────────────────────────────
// handlers/messageRouter.js
// Brain of the bot. Decides what to do with each message:
//   1. Keyword match → instant hardcoded reply (faster, cheaper)
//   2. Hot lead signals → trigger sales team handoff
//   3. Everything else → send to Claude AI
// ─────────────────────────────────────────────────────────
const { sendText, sendButtons } = require('./whatsapp');
const { askClaude }             = require('./claude');
const { triggerHandoff }        = require('./handoffHandler');
const menuHandler               = require('./menuHandler');
// In-memory session store — tracks conversation state per customer
// In production, replace with Redis or Firebase
const sessions = new Map();

function getSession(phone) {
  if (!sessions.has(phone)) {
    sessions.set(phone, {
      phone,
      name: null,
      stage: 'new',        // new | browsing | qualifying | handoff
      interest: null,
      quantity: null,
      business: null,
      messageCount: 0,
      history: [],         // Last N messages for Claude context
      hotScore: 0,         // 0-10: above 6 triggers handoff
      createdAt: Date.now()
    });
  }
  return sessions.get(phone);
}

// ── Keyword patterns ──────────────────────────────────────
const MENU_KEYWORDS   = ['menu', 'food', 'packets', 'dishes', 'items', 'what do you have', 'what do you sell', 'price', 'rate', 'cost', 'how much', 'kin'];
const SERVICE_KW      = ['dehydrat', 'freeze', 'preserve', 'pick up', 'pickup', 'send my food', 'ghar ka khana', 'my own food'];
const ORDER_KW        = ['order', 'buy', 'want', 'purchase', 'interested in', 'book'];
const CONTACT_KW      = ['call', 'talk', 'speak', 'human', 'person', 'team', 'contact', 'number', 'phone'];
const GREETING_KW     = ['hi', 'hello', 'hii', 'hey', 'namaste', 'helo', 'good morning', 'good afternoon', 'good evening'];

// ── Hot lead signals (raise hotScore) ─────────────────────
const HOT_SIGNALS = [
  { pattern: /\b(restaurant|hotel|cafe|cloud kitchen|catering|franchise|branch)\b/i, score: 3 },
  { pattern: /\b(\d+)\s*(kg|kgs|kilos|kilogram)/i, score: 2 },
  { pattern: /\b(bulk|wholesale|large|lot|supply|monthly|weekly)\b/i, score: 2 },
  { pattern: /\b(quote|quotation|pricing|proposal|sample)\b/i, score: 2 },
  { pattern: /\b(urgent|asap|soon|immediately|this week)\b/i, score: 1 },
  { pattern: /\b(already|currently|right now|we use|we have)\b/i, score: 1 },
];

function scoreMessage(text, session) {
  HOT_SIGNALS.forEach(({ pattern, score }) => {
    if (pattern.test(text)) {
      session.hotScore = Math.min(10, session.hotScore + score);
      // Extract quantity if mentioned
      const qtyMatch = text.match(/(\d+)\s*(kg|kgs|kilos)/i);
      if (qtyMatch) session.quantity = qtyMatch[0];
    }
  });
}

// ── Main router ───────────────────────────────────────────
async function routeMessage(from, text) {
  const session = getSession(from);
  session.messageCount++;

  const lower = text.toLowerCase().trim();

  // Save to conversation history for Claude context
  session.history.push({ role: 'user', content: text });
  if (session.history.length > 10) session.history.shift(); // Keep last 10

  // Score the message for hot lead detection
  scoreMessage(text, session);

  // ── 1. Greetings ──────────────────────────────────────
  if (session.messageCount === 1 || GREETING_KW.some(k => lower === k || lower.startsWith(k + ' '))) {
    const reply = `Namaste! 🙏 Welcome to FoodPost — *Home Food, Everywhere!*\n\nWe dehydrate and freeze-dry your food — no preservatives, exact same taste, all nutrients intact.\n\nHow can I help you today?`;
    await sendButtons(from, reply, [
      { id: 'menu',    title: 'See our menu' },
      { id: 'service', title: 'Dehydrate my food' },
      { id: 'b2b',     title: 'Business inquiry' },
    ]);
    session.stage = 'browsing';
    return;
  }

  // ── 2. Menu requests ──────────────────────────────────
  if (MENU_KEYWORDS.some(k => lower.includes(k))) {
    await menuHandler.sendMainMenu(from);
    session.stage = 'browsing';
    return;
  }

  // ── 3. Service / dehydration questions ───────────────
  if (SERVICE_KW.some(k => lower.includes(k))) {
    await menuHandler.sendServiceInfo(from);
    return;
  }

  // ── 4. Contact / talk to human ────────────────────────
  if (CONTACT_KW.some(k => lower.includes(k))) {
    await sendText(from,
      `Our team is available *Mon–Sat, 10 AM – 7 PM IST* 📞\n\n+91 9867236115\n+91 9820733103\n@foodpostit on Instagram\n\n📍 Sai Prasad, Nanda Patkar Road, Vile Parle (E), Mumbai – 400057`
    );
    return;
  }

  // ── 5. Hot lead threshold — trigger handoff ───────────
  if (session.hotScore >= 6 && session.stage !== 'handoff') {
    session.stage = 'handoff';
    await triggerHandoff(from, session, text);
    return;
  }

  // ── 6. Order intent — start qualifying ───────────────
  if (ORDER_KW.some(k => lower.includes(k)) && session.stage === 'browsing') {
    session.stage = 'qualifying';
    await sendText(from,
      `Great! To get you the best price and availability, could you share:\n\n1. What food/dish are you interested in?\n2. Roughly how many packets or kg?\n3. Is this for personal use or business?`
    );
    return;
  }

  // ── 7. Qualifying stage — collect lead info ───────────
  if (session.stage === 'qualifying') {
    session.hotScore += 2;
    if (session.hotScore >= 6) {
      session.stage = 'handoff';
      await triggerHandoff(from, session, text);
      return;
    }
  }

  // ── 8. Fallback — ask Claude ──────────────────────────
  try {
    const reply = await askClaude(text, session.history.slice(-6));
    await sendText(from, reply);
    session.history.push({ role: 'assistant', content: reply });
  } catch (err) {
    console.error('Claude error:', err.message);
    await sendText(from,
      `Sorry, I couldn't process that right now. Please call us directly:\n+91 9867236115 · +91 9820733103`
    );
  }
}

module.exports = { routeMessage };
