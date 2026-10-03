#!/usr/bin/env node
// اسکریپت تست اتصال به MongoDB Atlas

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

console.log('╔════════════════════════════════════════╗');
console.log('║   تست اتصال به MongoDB Atlas        ║');
console.log('╚════════════════════════════════════════╝\n');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI در فایل .env یافت نشد!');
  console.log('\n💡 مطمئن شوید فایل backend/.env موجود است.');
  process.exit(1);
}

// مخفی کردن رمز عبور در نمایش
const displayURI = MONGO_URI.replace(/:([^:@]{3})[^:@]*@/, ':***$1***@');
console.log(`📡 Connection String: ${displayURI}\n`);

async function testConnection() {
  try {
    console.log('🔄 در حال اتصال...');
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 ثانیه timeout
    });

    console.log('✅ اتصال موفقیت‌آمیز به MongoDB Atlas!\n');
    
    // اطلاعات اتصال
    const connection = mongoose.connection;
    console.log('📊 اطلاعات دیتابیس:');
    console.log(`   نام: ${connection.db.databaseName}`);
    console.log(`   Host: ${connection.host}`);
    console.log(`   Port: ${connection.port || 'default'}`);
    console.log(`   Ready State: ${connection.readyState} (1 = connected)`);
    
    // لیست collections
    console.log('\n📁 Collections موجود:');
    const collections = await connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('   (هیچ collection موجود نیست - دیتابیس جدید است)');
    } else {
      for (const col of collections) {
        const count = await connection.db.collection(col.name).countDocuments();
        console.log(`   - ${col.name}: ${count} سند`);
      }
    }
    
    console.log('\n🎉 همه چیز آماده است!');
    console.log('💡 حالا می‌توانید backend را اجرا کنید:\n');
    console.log('   cd backend');
    console.log('   npm start\n');
    
  } catch (error) {
    console.error('\n❌ خطا در اتصال به MongoDB Atlas:');
    console.error(`   ${error.message}\n`);
    
    // راهنمای عیب‌یابی بر اساس نوع خطا
    if (error.message.includes('bad auth')) {
      console.log('💡 راهنمای رفع خطا:');
      console.log('   1. رمز عبور دیتابیس اشتباه است');
      console.log('   2. در MongoDB Atlas → Database Access → Edit Password');
      console.log('   3. رمز جدید را در backend/.env قرار دهید');
      console.log('   4. اگر رمز کاراکتر خاص دارد، URL encode کنید:');
      console.log('      @ → %40, # → %23, ! → %21, / → %2F, : → %3A\n');
      
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('connection timeout')) {
      console.log('💡 راهنمای رفع خطا:');
      console.log('   1. IP شما در Network Access نیست');
      console.log('   2. در MongoDB Atlas → Network Access');
      console.log('   3. Add IP Address → 0.0.0.0/0 (برای تست)');
      console.log('   4. اگر از VPN استفاده می‌کنید، آن را تست کنید\n');
      
    } else if (error.message.includes('not authorized')) {
      console.log('💡 راهنمای رفع خطا:');
      console.log('   1. کاربر دسترسی به این database ندارد');
      console.log('   2. در MongoDB Atlas → Database Access');
      console.log('   3. مطمئن شوید کاربر به database "radif-ecu" دسترسی دارد');
      console.log('   4. یا Built-in Role: "Atlas admin" را بدهید\n');
      
    } else {
      console.log('💡 برای کمک بیشتر:');
      console.log('   - خطای بالا را در گوگل جستجو کنید');
      console.log('   - راهنمای MONGODB-ATLAS-SETUP.md را مطالعه کنید\n');
    }
    
  } finally {
    await mongoose.disconnect();
    console.log('🔌 اتصال بسته شد.\n');
  }
}

testConnection();
