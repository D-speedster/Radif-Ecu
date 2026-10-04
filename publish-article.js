#!/usr/bin/env node
// اسکریپت انتشار مقاله در دیتابیس

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// تعریف مدل Article
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  published: { type: Boolean, default: false },
  isPrivate: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);

async function publishArticle() {
  try {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   انتشار مقاله در دیتابیس          ║');
    console.log('╚════════════════════════════════════════╝\n');

    // خواندن فایل JSON
    const articlePath = path.join(__dirname, '.agents', 'tasks', 'engine-knock-article.json');
    const articleData = JSON.parse(fs.readFileSync(articlePath, 'utf8'));

    // اتصال به دیتابیس
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ متصل به MongoDB\n');

    // بررسی وجود مقاله
    const existing = await Article.findOne({ slug: articleData.slug });
    
    if (existing) {
      console.log('⚠️  مقاله با این slug قبلاً وجود دارد!');
      console.log(`   عنوان: ${existing.title}`);
      console.log(`   Slug: ${existing.slug}`);
      console.log(`   تاریخ ایجاد: ${existing.createdAt.toLocaleDateString('fa-IR')}\n`);
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      process.exit(0);
    }

    // ایجاد مقاله جدید
    const article = new Article(articleData);
    await article.save();

    console.log('✅ مقاله با موفقیت منتشر شد!\n');
    console.log('📄 اطلاعات مقاله:');
    console.log(`   عنوان: ${article.title}`);
    console.log(`   Slug: ${article.slug}`);
    console.log(`   دسته: ${article.category}`);
    console.log(`   منتشر شده: ${article.published ? '✅ بله' : '❌ خیر'}`);
    console.log(`   خصوصی: ${article.isPrivate ? '🔒 بله' : '🌐 خیر'}`);
    console.log(`   طول محتوا: ${article.content.length} کاراکتر`);
    console.log(`   تاریخ: ${article.createdAt.toLocaleDateString('fa-IR')}\n`);

    console.log('🔗 لینک‌ها:');
    console.log(`   صفحه مقاله: https://radif-ecu.ir/wiki/${article.slug}`);
    console.log(`   API: https://radif-ecu.ir/api/articles/${article.slug}\n`);

  } catch (error) {
    console.error('\n❌ خطا:', error.message);
    if (error.code === 11000) {
      console.error('   این slug قبلاً استفاده شده است.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 اتصال بسته شد.\n');
  }
}

publishArticle();
