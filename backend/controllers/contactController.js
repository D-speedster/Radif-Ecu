const ContactMessage = require('../models/ContactMessage');

const createContactMessage = async (req, res) => {
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

    // Save message to database
    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'پیام شما با موفقیت دریافت شد. تیم فنی به زودی پاسخ می‌دهد.',
      messageId: contactMessage._id,
    });
  } catch (error) {
    console.error('Contact Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

const getContactMessages = async (req, res) => {
  try {
    const filter = {};
    
    // Filter by status if provided
    if (req.query.status) {
      const validStatuses = ['New', 'Read', 'Replied'];
      if (!validStatuses.includes(req.query.status)) {
        return res.status(400).json({ 
          success: false, 
          message: 'وضعیت نامعتبر است. مقادیر مجاز: New، Read، Replied' 
        });
      }
      filter.status = req.query.status;
    }

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages: messages,
    });
  } catch (error) {
    console.error('getContactMessages Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Read', 'Replied'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'وضعیت نامعتبر است. مقادیر مجاز: New، Read، Replied' 
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: 'پیام مورد نظر یافت نشد' });
    }

    res.status(200).json({
      success: true,
      message: 'وضعیت پیام با موفقیت به‌روز شد',
      contactMessage: message,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'شناسه پیام نامعتبر است' });
    }
    console.error('updateMessageStatus Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
  updateMessageStatus,
};