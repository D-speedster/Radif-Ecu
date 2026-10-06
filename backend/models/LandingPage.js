const mongoose = require('mongoose');

const landingPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'عنوان صفحه الزامی است'],
      trim: true,
      maxlength: [200, 'عنوان نمی‌تواند بیش از ۲۰۰ کاراکتر باشد'],
    },
    slug: {
      type: String,
      required: [true, 'slug الزامی است'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      default: '',
      // محتوای HTML صفحه (ویرایشگر غنی)
    },
    sections: {
      type: Array,
      default: [],
    },
    metadata: {
      type: {
        metaTitle: { type: String, trim: true, default: '' },
        metaDescription: { type: String, trim: true, default: '' },
        keywords: { type: [String], default: [] },
      },
      default: () => ({ metaTitle: '', metaDescription: '', keywords: [] }),
    },
    schema: {
      type: Object,
      default: null,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false, timestamps: true }
);

landingPageSchema.index({ slug: 1 });
landingPageSchema.index({ published: 1 });

module.exports = mongoose.model('LandingPage', landingPageSchema);
