// اعلان فوری Lead به تلگرام مدیر.
// اگر TELEGRAM_BOT_TOKEN و TELEGRAM_CHAT_ID تنظیم نشده باشند، هیچ کاری نمی‌کند (بدون خطا).
// هرگز نباید ثبت Lead را به خاطر خطای اعلان شکست بدهد؛ پس خطاها فقط لاگ می‌شوند.

const esc = (s) =>
  String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

const notifyAdmin = async (title, fields) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId || process.env.NODE_ENV === 'test') return;

  const lines = [`<b>${esc(title)}</b>`];
  for (const [label, value] of Object.entries(fields)) {
    if (value) lines.push(`${esc(label)}: ${esc(value)}`);
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML' }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error('Telegram notify failed:', res.status);
  } catch (err) {
    console.error('Telegram notify error:', err.message);
  }
};

module.exports = { notifyAdmin };
