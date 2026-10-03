// اسکریپت Node.js برای درج مقاله (بهترین روش برای UTF-8)

const fs = require('fs');
const http = require('http');

// خواندن فایل JSON
const articleData = fs.readFileSync('./.agents/tasks/engine-knock-article.json', 'utf8');

// تنظیمات درخواست
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/articles',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(articleData, 'utf8')
    // اگر نیاز به احراز هویت دارید:
    // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
};

console.log('🚀 در حال ارسال مقاله به API...\n');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 201 || res.statusCode === 200) {
      try {
        const response = JSON.parse(data);
        console.log('✅ مقاله با موفقیت منتشر شد!\n');
        console.log(`📝 عنوان: ${response.title || 'رفع ناک ماشین'}`);
        console.log(`🆔 ID: ${response._id || response.id}`);
        console.log(`🔗 URL: http://localhost:3000/wiki/rafeh-nak-mashin\n`);
      } catch (e) {
        console.log('✅ مقاله منتشر شد!');
        console.log('🔗 URL: http://localhost:3000/wiki/rafeh-nak-mashin\n');
      }
    } else {
      console.log(`❌ خطا: ${res.statusCode} ${res.statusMessage}`);
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ خطا در اتصال به API:');
  console.error(error.message);
  console.log('\n💡 راهنمایی:');
  console.log('1. مطمئن شوید backend در حال اجراست:');
  console.log('   cd backend');
  console.log('   npm start');
  console.log('2. پورت backend روی 5000 باشد');
});

// ارسال داده
req.write(articleData);
req.end();
