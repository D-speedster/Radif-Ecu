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
    sections: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
      // هر بخش شامل { type: String, data: Mixed } می‌باشد
      // مثال: { type: 'hero', data: { title: '...', description: '...', image: '...' } }
      // یا: { type: 'features', data: [{ icon: '...', title: '...', description: '...' }] }
      // یا: { type: 'faq', data: [{ question: '...', answer: '...' }] }
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
      type: mongoose.Schema.Types.Mixed,
      default: null,
      // Schema.org JSON-LD markup برای SEO
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
