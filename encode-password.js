#!/usr/bin/env node
// ابزار URL Encoding برای رمز عبور MongoDB

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('╔════════════════════════════════════════╗');
console.log('║   URL Encoder برای رمز MongoDB       ║');
console.log('╚════════════════════════════════════════╝\n');

console.log('کاراکترهای خاصی که نیاز به encoding دارند:');
console.log('  @ # ! / : $ & % + , ; = ? [ ] < > { } | \\ ^ ` space\n');

rl.question('🔒 رمز عبور خود را وارد کنید: ', (password) => {
  if (!password) {
    console.log('❌ رمز عبور خالی است!');
    rl.close();
    return;
  }

  // URL encoding
  const encoded = encodeURIComponent(password);
  
  console.log('\n═══════════════════════════════════════════');
  console.log('✅ نتیجه:\n');
  console.log(`📝 رمز اصلی:     ${password}`);
  console.log(`🔐 رمز Encoded:   ${encoded}`);
  console.log('═══════════════════════════════════════════\n');

  // بررسی آیا encoding نیاز بود یا نه
  if (password === encoded) {
    console.log('✅ رمز شما نیازی به encoding ندارد.');
    console.log('💡 می‌توانید همان‌طور که هست استفاده کنید.\n');
  } else {
    console.log('⚠️  رمز شما شامل کاراکترهای خاص است.');
    console.log('💡 از رمز Encoded در فایل .env استفاده کنید.\n');
  }

  // نمایش Connection String کامل
  const username = 'mrspeed717_db_user'; // یا از argv بگیر
  const cluster = 'cluster0.rj18c6s.mongodb.net';
  const database = 'radif-ecu';
  
  console.log('📋 Connection String شما:\n');
  console.log(`MONGO_URI=mongodb+srv://${username}:${encoded}@${cluster}/${database}?retryWrites=true&w=majority&appName=Cluster0\n`);
  
  console.log('💡 این خط را کپی کرده و در backend/.env قرار دهید.\n');
  
  rl.close();
});

rl.on('close', () => {
  process.exit(0);
});
