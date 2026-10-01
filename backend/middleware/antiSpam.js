const rateLimit = require('express-rate-limit');

const isTest = process.env.NODE_ENV === 'test';

// حداکثر ۱۵ ارسال در ساعت برای هر IP (چند کاربر موبایل ممکن است IP مشترک داشته باشند)
const publicFormLimiter = isTest
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 15,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'تعداد درخواست‌های شما زیاد است. لطفاً کمی بعد دوباره تلاش کنید.' },
    });

// Honeypot: فیلد مخفی «website» که انسان پر نمی‌کند ولی ربات‌ها پر می‌کنند.
// پاسخ موفقیت‌نما می‌دهیم تا ربات متوجه نشود، ولی چیزی ذخیره نمی‌شود.
const honeypot = (req, res, next) => {
  if (req.body && req.body.website) {
    return res.status(201).json({ success: true, message: 'دریافت شد' });
  }
  next();
};

module.exports = { publicFormLimiter, honeypot };
