// تبدیل ارقام فارسی و عربی به انگلیسی (مثلاً ۰۹۱۲ → 0912)
const toEnglishDigits = (value) =>
  String(value ?? '')
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

// شماره موبایل: حذف فاصله و خط تیره و تبدیل ارقام
const normalizePhone = (value) => toEnglishDigits(value).replace(/[\s\-()]/g, '').trim();

module.exports = { toEnglishDigits, normalizePhone };
