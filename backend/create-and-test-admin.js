const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAndTestAdmin() {
  try {
    console.log('🔌 در حال اتصال به MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ اتصال موفق\n');

    // 1. حذف تمام کاربران speedster قدیمی
    const deleteResult = await User.deleteMany({ identifier: 'speedster' });
    console.log(`🗑️  ${deleteResult.deletedCount} کاربر قدیمی speedster حذف شد\n`);

    // 2. ایجاد Admin جدید
    console.log('📝 در حال ایجاد Admin جدید...');
    const newAdmin = await User.create({
      name: 'Speedster Admin',
      identifier: 'speedster',
      password: 'Amir9900a',
      role: 'admin'
    });
    
    console.log('✅ Admin جدید ایجاد شد:');
    console.log('   ID:', newAdmin._id);
    console.log('   Username: speedster');
    console.log('   Password: Amir9900a');
    console.log('   Role:', newAdmin.role);
    console.log('');

    // 3. تست خواندن کاربر
    console.log('🔍 تست خواندن کاربر از دیتابیس...');
    const foundUser = await User.findOne({ identifier: 'speedster' }).select('+password');
    
    if (!foundUser) {
      console.log('❌ خطا: کاربر پیدا نشد!');
      process.exit(1);
    }
    
    console.log('✅ کاربر پیدا شد\n');

    // 4. تست رمز عبور
    console.log('🔐 تست رمز عبور...');
    const isPasswordCorrect = await foundUser.matchPassword('Amir9900a');
    
    if (isPasswordCorrect) {
      console.log('✅ رمز عبور صحیح است!\n');
    } else {
      console.log('❌ خطا: رمز عبور اشتباه است!\n');
      process.exit(1);
    }

    // 5. نمایش همه Adminها
    const allAdmins = await User.find({ role: 'admin' }).select('-password');
    console.log('👑 لیست Admin‌های موجود:');
    allAdmins.forEach((admin, i) => {
      console.log(`   ${i + 1}. ${admin.identifier} (${admin.name})`);
    });
    console.log('');

    // 6. نمایش تمام کاربران
    const allUsers = await User.find({}).select('identifier role name createdAt');
    console.log('📋 تمام کاربران سیستم:');
    if (allUsers.length === 0) {
      console.log('   هیچ کاربری وجود ندارد');
    } else {
      allUsers.forEach((user, i) => {
        console.log(`   ${i + 1}. ${user.identifier} - ${user.role}`);
      });
    }
    console.log('');

    console.log('✅ همه تست‌ها موفق بود!');
    console.log('\n📌 اطلاعات لاگین:');
    console.log('   Username: speedster');
    console.log('   Password: Amir9900a');
    console.log('');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ خطا:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createAndTestAdmin();
