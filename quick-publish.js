#!/usr/bin/env node
// اسکریپت سریع: ساخت ادمین و انتشار مقاله

const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

const BASE_URL = 'localhost';
const PORT = 5000;

// مشخصات ادمین پیش‌فرض
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@radif-ecu.ir';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!@#';

console.log('╔════════════════════════════════════════╗');
console.log('║   انتشار مقاله "رفع ناک ماشین"      ║');
console.log('╚════════════════════════════════════════╝\n');

// تابع کمکی برای درخواست HTTP با پشتیبانی از cookies
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          // استخراج cookie از header
          const cookies = res.headers['set-cookie'];
          resolve({ 
            statusCode: res.statusCode, 
            data: parsedData,
            cookies: cookies 
          });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: responseData, cookies: null });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// مرحله 1: ساخت ادمین
async function createAdmin() {
  console.log('🔧 مرحله 1: ساخت/بررسی ادمین...');
  
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      ADMIN_IDENTIFIER: ADMIN_EMAIL,
      ADMIN_PASSWORD: ADMIN_PASSWORD
    };

    const child = spawn('node', ['scripts/createAdmin.js'], {
      cwd: './backend',
      env: env,
      stdio: 'inherit'
    });

    child.on('close', (code) => {
      console.log('');
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Failed to create admin'));
      }
    });

    child.on('error', reject);
  });
}

// مرحله 2: ورود
async function login() {
  console.log('🔐 مرحله 2: ورود به سیستم...');

  const loginData = JSON.stringify({
    identifier: ADMIN_EMAIL,  // backend انتظار 'identifier' دارد نه 'email'
    password: ADMIN_PASSWORD
  });

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

  const response = await makeRequest(options, loginData);

  if (response.statusCode === 200) {
    console.log('✅ ورود موفق!\n');
    
    // استخراج توکن از cookie
    if (response.cookies && response.cookies.length > 0) {
      const tokenCookie = response.cookies.find(c => c.startsWith('token='));
      if (tokenCookie) {
        const token = tokenCookie.split(';')[0].split('=')[1];
        return token;
      }
    }
    
    throw new Error('Token not found in response cookies');
  } else {
    throw new Error(`Login failed: ${response.data.message || 'Unknown error'}`);
  }
}

// مرحله 3: انتشار مقاله
async function publishArticle(token) {
  console.log('📝 مرحله 3: انتشار مقاله...');

  const articleData = fs.readFileSync('./.agents/tasks/engine-knock-article.json', 'utf8');

  const options = {
    hostname: BASE_URL,
    port: PORT,
    path: '/api/articles',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(articleData, 'utf8'),
      'Cookie': `token=${token}`  // ارسال توکن به عنوان cookie
    }
  };

  const response = await makeRequest(options, articleData);

  if (response.statusCode === 201 || response.statusCode === 200) {
    console.log('\n════════════════════════════════════════');
    console.log('✅ مقاله با موفقیت منتشر شد!');
    console.log('════════════════════════════════════════\n');
    console.log(`📝 عنوان: ${response.data.title}`);
    console.log(`🆔 ID: ${response.data._id}`);
    console.log(`🔗 URL: http://localhost:3000/wiki/${response.data.slug}\n`);
    console.log('🎉 حالا می‌توانید مقاله را در مرورگر مشاهده کنید!\n');
    
    console.log('📋 گام‌های بعدی:');
    console.log('   1. باز کنید: http://localhost:3000/wiki/rafeh-nak-mashin');
    console.log('   2. Ctrl+U برای دیدن SEO metadata');
    console.log('   3. تست در موبایل');
    console.log('   4. Submit به Google Search Console\n');
  } else {
    throw new Error(`Publish failed: ${response.data.message || 'Unknown error'}`);
  }
}

// اجرای اصلی
async function main() {
  try {
    await createAdmin();
    const token = await login();
    await publishArticle(token);
  } catch (error) {
    console.error('\n❌ خطا:', error.message);
    console.log('\n💡 بررسی کنید:');
    console.log('   1. Backend در حال اجراست: cd backend && npm start');
    console.log('   2. MongoDB متصل است');
    console.log('   3. پورت 5000 آزاد است\n');
    process.exit(1);
  }
}

main();
