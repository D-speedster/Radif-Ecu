const mongoose = require('mongoose');

let mongoServer;

// دو حالت برای دیتابیس تست:
// 1) پیش‌فرض: MongoDB درون‌حافظه‌ای (mongodb-memory-server). فایل MongoDB را از اینترنت دانلود می‌کند
//    و از ایران معمولاً با خطای 403 مواجه می‌شود (یا باید یک بار با VPN دانلود شود).
// 2) اگر TEST_MONGO_URI تنظیم شود، تست‌ها روی همان دیتابیس اجرا می‌شوند (MongoDB محلی یا Atlas).
//    ⚠️ بعد از هر تست «همهٔ» کالکشن‌ها پاک می‌شوند، پس نام دیتابیس باید حتماً شامل "test" باشد.
//
//    PowerShell:  $env:TEST_MONGO_URI="mongodb://localhost:27017/radif-ecu-test"; npm test
beforeAll(async () => {
  const realUri = process.env.TEST_MONGO_URI;

  if (realUri) {
    const dbName = (realUri.split('?')[0].split('/').pop() || '').toLowerCase();
    if (!dbName.includes('test')) {
      throw new Error(
        `TEST_MONGO_URI باید به دیتابیسی اشاره کند که اسمش شامل "test" است (الان: "${dbName}"). ` +
          'تست‌ها همهٔ داده‌های دیتابیس را پاک می‌کنند.'
      );
    }
    await mongoose.connect(realUri, { serverSelectionTimeoutMS: 15000 });
    return;
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}, 120000);

// Cleanup after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});
