const mongoose = require('mongoose');

// downloadUrl is stripped from public responses when user is not authenticated
// category enum mirrors the frontend Wiki filter keys exactly
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'عنوان مقاله الزامی است'],
      trim: true,
      maxlength: [200, 'عنوان نمی‌تواند بیش از ۲۰۰ کاراکتر باشد'],
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'دسته‌بندی الزامی است'],
      enum: {
        values: ['ecu', 'multiplex', 'dtc', 'dump'],
        message: 'دسته‌بندی باید یکی از: ecu، multiplex، dtc یا dump باشد',
      },
    },
    downloadUrl: {
      type: String,
      trim: true,
      default: null,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

articleSchema.index({ title: 'text', content: 'text' });
articleSchema.index({ category: 1, published: 1, createdAt: -1 });

module.exports = mongoose.model('Article', articleSchema);
