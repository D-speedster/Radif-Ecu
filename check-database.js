#!/usr/bin/env node
// بررسی محتوای دیتابیس و collections

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

console.log('╔════════════════════════════════════════╗');
console.log('║   بررسی محتوای دیتابیس             ║');
console.log('╚════════════════════════════════════════╝\n');

async function checkDatabase() {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    
    if (!MONGO_URI) {
      console.error('❌ MONGO_URI یافت نشد!');
      process.exit(1);
    }

    // نمایش connection string (با مخفی کردن رمز)
    const displayURI = MONGO_URI.replace(/:([^:@]{3})[^:@]*@/, ':***$1***@');
    console.log(`📡 Connection: ${displayURI}\n`);

    await mongoose.connect(MONGO_URI);
    console.log('✅ متصل به MongoDB\n');

    const db = mongoose.connection.db;
    
    // اطلاعات دیتابیس
    console.log('📊 اطلاعات دیتابیس:');
    console.log(`   نام: ${db.databaseName}`);
    console.log(`   Host: ${mongoose.connection.host}\n`);

    // لیست collections
    const collections = await db.listCollections().toArray();
    
    console.log('📁 Collections:\n');
    
    if (collections.length === 0) {
      console.log('   ⚠️  هیچ collection وجود ندارد (دیتابیس خالی است)\n');
    } else {
      for (const col of collections) {
        const collection = db.collection(col.name);
        const count = await collection.countDocuments();
        
        console.log(`   📦 ${col.name}: ${count} سند`);
        
        // نمایش نمونه از اولین سند
        if (count > 0) {
          const sample = await collection.findOne({}, { projection: { _id: 1, title: 1, name: 1, identifier: 1, slug: 1 } });
          console.log(`      نمونه:`, JSON.stringify(sample, null, 2).split('\n').map(l => '      ' + l).join('\n').trim());
        }
        console.log('');
      }
    }

    // بررسی مخصوص articles
    const articlesCol = db.collection('articles');
    const articlesCount = await articlesCol.countDocuments();
    
    console.log('═══════════════════════════════════════════');
    console.log(`\n📚 مقالات (Articles): ${articlesCount} عدد\n`);
    
    if (articlesCount > 0) {
      const articles = await articlesCol.find({}).limit(5).toArray();
      
      articles.forEach((article, i) => {
        console.log(`${i + 1}. ${article.title || 'بدون عنوان'}`);
        console.log(`   Slug: ${article.slug || article._id}`);
        console.log(`   Category: ${article.category || 'ندارد'}`);
        console.log(`   Published: ${article.published ? '✅' : '❌'}`);
        console.log('');
      });
      
      if (articlesCount > 5) {
        console.log(`   ... و ${articlesCount - 5} مقاله دیگر\n`);
      }
    } else {
      console.log('⚠️  هیچ مقاله‌ای یافت نشد!\n');
      console.log('💡 برای انتشار مقاله "رفع ناک ماشین":');
      console.log('   node quick-publish.js\n');
    }

  } catch (error) {
    console.error('\n❌ خطا:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 اتصال بسته شد.\n');
  }
}

checkDatabase();
