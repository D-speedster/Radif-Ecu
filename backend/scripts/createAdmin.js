/**
 * ساخت کاربر ادمین
 *
 * استفاده (رمز و شناسه را خودتان بدهید؛ رمز پیش‌فرض عمومی وجود ندارد):
 *   ADMIN_IDENTIFIER=you@example.com ADMIN_PASSWORD='یک-رمز-قوی' node scripts/createAdmin.js
 *
 * ویندوز (PowerShell):
 *   $env:ADMIN_IDENTIFIER="you@example.com"; $env:ADMIN_PASSWORD="رمز-قوی-خودتان"; node scripts/createAdmin.js
 *
 * اگر ADMIN_PASSWORD ندهید، یک رمز تصادفی ساخته و فقط یک‌بار چاپ می‌شود.
 */

require('dotenv').config();
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');

const identifier = (process.env.ADMIN_IDENTIFIER || '').trim().toLowerCase();
const generated = !process.env.ADMIN_PASSWORD;
const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url');

async function createAdmin() {
  if (!identifier) {
    console.error('❌ ADMIN_IDENTIFIER را تنظیم کنید (ایمیل یا شماره موبایل ادمین).');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('❌ رمز عبور باید حداقل ۸ کاراکتر باشد.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ identifier });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log('✅ کاربر موجود به ادمین ارتقا یافت (رمز تغییر نکرد).');
      } else {
        console.log('⚠️  این ادمین از قبل وجود دارد. رمز تغییر نکرد.');
      }
      process.exit(0);
    }

    const admin = await User.create({ name: 'مدیر سیستم', identifier, password, role: 'admin' });
    console.log('\n✅ ادمین ساخته شد');
    console.log(`   شناسه: ${admin.identifier}`);
    if (generated) {
      console.log(`   رمز (فقط همین یک‌بار نمایش داده می‌شود): ${password}`);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();
