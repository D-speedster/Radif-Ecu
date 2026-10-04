#!/usr/bin/env node
// لیست کردن تمام ادمین‌های موجود

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const User = require('./backend/models/User');

console.log('╔════════════════════════════════════════╗');
console.log('║   لیست ادمین‌های موجود              ║');
console.log('╚════════════════════════════════════════╝\n');

async function listAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ متصل به MongoDB\n');

    // پیدا کردن همه ادمین‌ها
    const admins = await User.find({ role: 'admin' });

    if (admins.length === 0) {
      console.log('❌ هیچ ادمینی یافت نشد!\n');
      console.log('💡 برای ساخت ادمین جدید:');
      console.log('   cd backend');
      console.log('   $env:ADMIN_IDENTIFIER="admin@radif-ecu.ir"; $env:ADMIN_PASSWORD="Admin123"; node scripts/createAdmin.js\n');
    } else {
      console.log(`📊 تعداد ادمین‌ها: ${admins.length}\n`);
      console.log('═══════════════════════════════════════════\n');
      
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ادمین:`);
        console.log(`   📧 شناسه: ${admin.identifier}`);
        console.log(`   👤 نام: ${admin.name || 'ندارد'}`);
        console.log(`   🆔 ID: ${admin._id}`);
        console.log(`   📅 تاریخ ساخت: ${new Date(admin.createdAt).toLocaleDateString('fa-IR')}`);
        console.log('');
      });
      
      console.log('═══════════════════════════════════════════\n');
      console.log('💡 برای ورود به پنل:');
      console.log('   URL: http://localhost:3000/auth');
      console.log(`   شناسه: ${admins[0].identifier}`);
      console.log('   رمز: (رمزی که هنگام ساخت تعیین کردید)\n');
    }

  } catch (error) {
    console.error('❌ خطا:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

listAdmins();
