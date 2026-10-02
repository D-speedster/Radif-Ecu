// پاک‌سازی HTML مقاله (جلوگیری از XSS). خروجی ویرایشگر TipTap را فقط با تگ‌ها و ویژگی‌های مجاز نگه می‌دارد.
// اگر پکیج sanitize-html نصب نباشد، به‌جای ریسک کردن، همهٔ تگ‌ها escape می‌شوند (متن ساده).
let sanitizeLib = null;
try {
  // eslint-disable-next-line global-require
  sanitizeLib = require('sanitize-html');
} catch {
  console.warn('⚠️ sanitize-html نصب نیست؛ محتوای مقاله به‌صورت متن ساده ذخیره می‌شود. اجرا کنید: npm install sanitize-html');
}

const escapeAll = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const OPTIONS = {
  allowedTags: [
    'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, rel: 'noopener noreferrer nofollow', ...(attribs.target ? { target: '_blank' } : {}) },
    }),
  },
};

const cleanHtml = (html) => (sanitizeLib ? sanitizeLib(String(html ?? ''), OPTIONS) : escapeAll(html));

// متن ساده برای پیش‌نمایش (حذف همهٔ تگ‌ها؛ خروجی HTML-safe است)
const toPlainText = (html) =>
  (sanitizeLib
    ? sanitizeLib(String(html ?? ''), { allowedTags: [], allowedAttributes: {} })
    : escapeAll(String(html ?? '').replace(/<[^>]*>/g, ' '))
  )
    .replace(/\s+/g, ' ')
    .trim();

module.exports = { cleanHtml, toPlainText };
