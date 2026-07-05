const express = require('express');
const router  = express.Router();

// Simple contact endpoint — validates fields and acknowledges receipt
router.post('/', async (req, res) => {
  try {
    const { name, phone, subject, message } = req.body;

    if (!name || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'لطفاً تمام فیلدهای اجباری را تکمیل کنید',
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'نام باید حداقل ۲ کاراکتر باشد' });
    }

    if (!/^09\d{9}$/.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'شماره موبایل معتبر نیست (مثال: ۰۹۱۲XXXXXXX)' });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'پیام باید حداقل ۱۰ کاراکتر باشد' });
    }

    // In production: send email via nodemailer / store in DB
    // For now: acknowledge receipt
    res.status(200).json({
      success: true,
      message: 'پیام شما با موفقیت دریافت شد. تیم فنی به زودی پاسخ می‌دهد.',
    });
  } catch (error) {
    console.error('Contact Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
});

module.exports = router;
