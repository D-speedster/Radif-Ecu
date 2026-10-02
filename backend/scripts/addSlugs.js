/**
 * افزودن slug به مقالات قدیمی که slug ندارند (یک‌بار اجرا کنید)
 * استفاده: node scripts/addSlugs.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('../models/Article');
const { uniqueSlug } = require('../utils/slug');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const articles = await Article.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
    console.log(`مقالهٔ بدون slug: ${articles.length}`);

    for (const a of articles) {
      a.slug = await uniqueSlug(Article, a.title, a._id);
      await a.save({ validateModifiedOnly: true });
      console.log(`✅ ${a.title} → ${a.slug}`);
    }
    console.log('تمام شد.');
    process.exit(0);
  } catch (e) {
    console.error('❌', e.message);
    process.exit(1);
  }
})();
