// ─────────────────────────────────────────────────────────
// handlers/handoffHandler.js
// When a customer is a HOT LEAD (hotScore >= 6), this:
//   1. Sends a reassuring message to the customer
//   2. Sends an alert to your sales team's WhatsApp
//   3. Includes all collected context about the lead
// ─────────────────────────────────────────────────────────
const { sendText, sendButtons } = require('../utils/whatsapp');

async function triggerHandoff(from, session, latestMessage) {
  // ── Message to the CUSTOMER ───────────────────────────
  await sendButtons(
    from,
    `Thank you for your interest! 🎉\n\nThis looks like a great fit for FoodPost. Our sales team will reach out to you on WhatsApp within *2 hours* with a custom quote and a *free sample offer*.\n\nIn the meantime, feel free to ask me anything!`,
    [
      { id: 'more_info',  title: 'Tell me more' },
      { id: 'call_now',   title: 'Call us now' },
    ]
  );

  // ── Alert to the SALES TEAM ───────────────────────────
  const salesPhone = process.env.SALES_TEAM_WHATSAPP; // e.g. '919867236115'

  const leadSummary =
    `*🔥 HOT LEAD ALERT — FoodPost Bot*\n\n` +
    `*Customer phone:* +${from}\n` +
    `*Lead score:* ${session.hotScore}/10\n` +
    (session.name     ? `*Name:* ${session.name}\n`         : '') +
    (session.business ? `*Business:* ${session.business}\n` : '') +
    (session.interest ? `*Interest:* ${session.interest}\n` : '') +
    (session.quantity ? `*Quantity mentioned:* ${session.quantity}\n` : '') +
    `*Messages exchanged:* ${session.messageCount}\n\n` +
    `*Last message:*\n_"${latestMessage}"_\n\n` +
    `*Conversation history (last 5):*\n` +
    session.history.slice(-5)
      .map(m => `[${m.role === 'user' ? 'Customer' : 'Bot'}]: ${m.content}`)
      .join('\n') +
    `\n\n_Reply to customer directly at +${from}_`;

  try {
    await sendText(salesPhone, leadSummary);
    console.log(`[HANDOFF] Lead alert sent to sales team for customer ${from}`);
  } catch (err) {
    console.error('Failed to send lead alert to sales team:', err.message);
  }

  // Update session so we don't trigger handoff repeatedly
  session.stage = 'handoff';
}

module.exports = { triggerHandoff };
