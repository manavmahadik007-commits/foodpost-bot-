const { sendText, sendButtons } = require('./whatsapp');

async function triggerHandoff(from, session, latestMessage) {
  await sendButtons(from,
    `Thank you for your interest! 🎉\n\nOur sales team will reach out within *2 hours* with a custom quote and a *free sample offer*.`,
    [
      { id: 'more_info', title: 'Tell me more' },
      { id: 'call_now',  title: 'Call us now' },
    ]
  );
  const alert =
    `*🔥 HOT LEAD — FoodPost Bot*\n\n` +
    `*Customer:* +${from}\n` +
    `*Score:* ${session.hotScore}/10\n` +
    (session.quantity ? `*Qty:* ${session.quantity}\n` : '') +
    `*Messages:* ${session.messageCount}\n\n` +
    `*Last message:*\n_"${latestMessage}"_\n\n` +
    `_Reply directly to +${from}_`;
  try {
    await sendText(process.env.SALES_TEAM_WHATSAPP, alert);
    console.log(`[HANDOFF] Alert sent for ${from}`);
  } catch (err) {
    console.error('Handoff failed:', err.message);
  }
}

module.exports = { triggerHandoff };
