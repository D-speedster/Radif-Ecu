const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'نام الزامی است'],
      trim: true,
      maxlength: [100, 'نام نمی‌تواند بیش از ۱۰۰ کاراکتر باشد'],
    },
    phone: {
      type: String,
      required: [true, 'شماره تماس الزامی است'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'موضوع الزامی است'],
      trim: true,
      maxlength: [200, 'موضوع نمی‌تواند بیش از ۲۰۰ کاراکتر باشد'],
    },
    message: {
      type: String,
      required: [true, 'پیام الزامی است'],
      trim: true,
      maxlength: [1000, 'پیام نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد'],
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Read', 'Replied'],
        message: 'وضعیت باید یکی از: New، Read، Replied باشد',
      },
      default: 'New',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);