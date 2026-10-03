// اسکریپت تست: مشاهده محتوای مقاله از API

const http = require('http');

const BASE_URL = 'localhost';
const PORT = 5000;

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: path,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('🔍 تست مقاله "رفع ناک ماشین"\n');
  
  try {
    // تست با slug
    console.log('📡 درخواست: GET /api/articles/rafeh-nak-mashin');
    const response = await makeRequest('/api/articles/rafeh-nak-mashin');
    
    if (response.statusCode === 200) {
      const article = response.data.article || response.data;
      
      console.log('\n✅ مقاله پیدا شد!');
      console.log('═══════════════════════════════════════\n');
      console.log(`📝 عنوان: ${article.title}`);
      console.log(`🆔 ID: ${article._id}`);
      console.log(`🔗 Slug: ${article.slug}`);
      console.log(`📁 دسته: ${article.category}`);
      console.log(`📅 تاریخ: ${new Date(article.createdAt).toLocaleDateString('fa-IR')}`);
      console.log(`📊 منتشر: ${article.published ? 'بله' : 'خیر'}`);
      console.log(`🔒 خصوصی: ${article.isPrivate ? 'بله' : 'خیر'}`);
      console.log(`\n📄 خلاصه:\n${article.excerpt}\n`);
      console.log(`📏 طول محتوا: ${article.content ? article.content.length.toLocaleString('fa-IR') : 0} کاراکتر`);
      console.log(`📊 تعداد کلمات: ~${Math.round((article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length).toLocaleString('fa-IR')} کلمه`);
      
      console.log('\n🌐 لینک‌های مشاهده:');
      console.log(`   Frontend: http://localhost:3000/wiki/${article.slug || article._id}`);
      console.log(`   API: http://localhost:5000/api/articles/${article.slug || article._id}`);
      
      // نمایش اولین 500 کاراکتر محتوا
      if (article.content) {
        const preview = article.content.substring(0, 500).replace(/<[^>]*>/g, '');
        console.log(`\n📖 پیش‌نمایش محتوا:\n${preview}...\n`);
      }
      
    } else {
      console.log(`\n❌ خطا: ${response.statusCode}`);
      console.log(response.data);
    }
    
  } catch (error) {
    console.error('\n❌ خطا:', error.message);
    console.log('\n💡 مطمئن شوید backend در حال اجراست:');
    console.log('   cd backend && npm start\n');
  }
}

main();
