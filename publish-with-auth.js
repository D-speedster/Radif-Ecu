// اسکریپت کامل: ورود به عنوان ادمین و انتشار مقاله

const fs = require('fs');
const http = require('http');
const readline = require('readline');

const BASE_URL = 'localhost';
const PORT = 5000;

// تابع کمکی برای درخواست HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(responseData)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

// تابع برای دریافت ورودی از کاربر
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

// 1. ورود و دریافت توکن
async function login(email, password) {
  console.log('🔐 در حال ورود به سیستم...\n');

  const loginData = JSON.stringify({ email, password });

  const options = {
    hostname: BASE_URL,
    port: PORT,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  try {
    const response = await makeRequest(options, loginData);

    if (response.statusCode === 200 && response.data.token) {
      console.log('✅ ورود موفق!');
      console.log(`👤 نام: ${response.data.name}`);
      console.log(`📧 ایمیل: ${response.data.email}\n`);
      return response.data.token;
    } else {
      console.error('❌ خطا در ورود:', response.data.message || 'مشخص نشده');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ خطا در اتصال:', error.message);
    console.log('\n💡 مطمئن شوید backend در حال اجراست:');
    console.log('   cd backend');
    console.log('   npm start');
    process.exit(1);
  }
}

// 2. انتشار مقاله
async function publishArticle(token) {
  console.log('📝 در حال انتشار مقاله...\n');

  // خواندن فایل JSON
  const articleData = fs.readFileSync('./.agents/tasks/engine-knock-article.json', 'utf8');

  const options = {
    hostname: BASE_URL,
    port: PORT,
    path: '/api/articles',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(articleData, 'utf8'),
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await makeRequest(options, articleData);

    if (response.statusCode === 201 || response.statusCode === 200) {
      console.log('✅ مقاله با موفقیت منتشر شد!\n');
      console.log(`📝 عنوان: ${response.data.title || 'رفع ناک ماشین'}`);
      console.log(`🆔 ID: ${response.data._id || response.data.id}`);
      console.log(`🔗 URL: http://localhost:3000/wiki/${response.data.slug || 'rafeh-nak-mashin'}\n`);
      console.log('🎉 حالا می‌توانید مقاله را در مرورگر مشاهده کنید!');
    } else {
      console.error('❌ خطا در انتشار:', response.data.message || 'مشخص نشده');
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.error('❌ خطا:', error.message);
  }
}

// اجرای اصلی
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   انتشار مقاله "رفع ناک ماشین"      ║');
  console.log('╚════════════════════════════════════════╝\n');

  // دریافت اطلاعات ورود
  const email = await askQuestion('📧 ایمیل ادمین: ');
  const password = await askQuestion('🔒 رمز عبور: ');

  console.log('');

  // ورود و دریافت توکن
  const token = await login(email, password);

  // انتشار مقاله
  await publishArticle(token);
}

// اجرا
main().catch(error => {
  console.error('❌ خطای غیرمنتظره:', error);
  process.exit(1);
});
