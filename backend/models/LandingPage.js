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
    },
    // SEO fields - flat structure
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    keywords: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { 
    versionKey: false, 
    timestamps: true,
    strict: false // Allow extra fields
  }
);

landingPageSchema.index({ slug: 1 });
landingPageSchema.index({ published: 1 });

module.exports = mongoose.model('LandingPage', landingPageSchema);
