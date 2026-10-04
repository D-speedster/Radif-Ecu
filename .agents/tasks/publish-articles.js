/**
 * Script to publish 3 wiki articles to MongoDB backend
 * Backend: http://91.107.157.82:5000
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const BACKEND_URL = 'http://91.107.157.82:5000';
const ADMIN_EMAIL = 'admin@radif-ecu.ir';
const ADMIN_PASSWORD = 'Admin123!@#';

// Article files to publish
const ARTICLE_FILES = [
  'engine-knock-article.json',
  'rafeh-kap-daricheh-gaz-article.json',
  'kahesh-damaye-ab-motor-article.json'
];

let authCookie = null;

// Helper: Make HTTP request
function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Extract Set-Cookie header if present
          if (res.headers['set-cookie']) {
            authCookie = res.headers['set-cookie'][0].split(';')[0];
          }
          resolve({ statusCode: res.statusCode, data: JSON.parse(data || '{}'), headers: res.headers });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// Step 1: Login
async function login() {
  console.log('🔐 Logging in...');
  
  const loginData = JSON.stringify({
    identifier: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  });

  const options = {
    hostname: '91.107.157.82',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const response = await makeRequest(options, loginData);
  console.log(`✅ Login successful: ${response.data.message || 'OK'}`);
  console.log(`🍪 Cookie: ${authCookie}\n`);
}

// Step 2: Publish an article
async function publishArticle(filename) {
  console.log(`📤 Publishing: ${filename}`);
  
  const filepath = path.join(__dirname, filename);
  const articleData = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

  // Truncate excerpt to 300 characters if needed
  if (articleData.excerpt && articleData.excerpt.length > 300) {
    console.log(`⚠️  Excerpt too long (${articleData.excerpt.length} chars), truncating to 300...`);
    articleData.excerpt = articleData.excerpt.substring(0, 297) + '...';
  }

  const postData = JSON.stringify(articleData);

  const options = {
    hostname: '91.107.157.82',
    port: 5000,
    path: '/api/articles',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Cookie': authCookie
    }
  };

  try {
    const response = await makeRequest(options, postData);
    console.log(`✅ Published: ${articleData.title}`);
    console.log(`   ID: ${response.data.article?._id || response.data._id || 'N/A'}`);
    console.log(`   Slug: ${articleData.slug}\n`);
    return { success: true, slug: articleData.slug, id: response.data.article?._id || response.data._id, title: articleData.title };
  } catch (error) {
    console.error(`❌ Failed to publish ${filename}: ${error.message}\n`);
    return { success: false, slug: articleData.slug, error: error.message, title: articleData.title };
  }
}

// Step 3: Verify articles
async function verifyArticles() {
  console.log('🔍 Verifying published articles...');
  
  const options = {
    hostname: '91.107.157.82',
    port: 5000,
    path: '/api/articles',
    method: 'GET'
  };

  const response = await makeRequest(options);
  console.log(`✅ Total articles in database: ${response.data.count}`);
  console.log(`   Articles: ${response.data.articles.map(a => a.slug).join(', ')}\n`);
  return response.data;
}

// Main execution
async function main() {
  const results = [];
  
  try {
    // Step 1: Login
    await login();

    // Step 2: Publish each article
    for (const filename of ARTICLE_FILES) {
      const result = await publishArticle(filename);
      results.push(result);
    }

    // Step 3: Verify
    const verification = await verifyArticles();

    // Generate summary
    const summary = {
      timestamp: new Date().toISOString(),
      backend: BACKEND_URL,
      published: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results: results,
      verification: {
        totalArticles: verification.count,
        slugs: verification.articles.map(a => a.slug)
      }
    };

    // Write summary to file
    const summaryPath = path.join(__dirname, 'publish-result.txt');
    const summaryText = `
═══════════════════════════════════════════════════════════════
  مقالات ویکی منتشر شد - خلاصه نتایج
═══════════════════════════════════════════════════════════════

⏰ زمان: ${new Date().toLocaleString('fa-IR')}
🌐 بک‌اند: ${BACKEND_URL}

📊 نتایج انتشار:
   ✅ موفق: ${summary.published}
   ❌ ناموفق: ${summary.failed}

📝 جزئیات مقالات:

${results.map((r, i) => `
${i + 1}. ${r.title}
   وضعیت: ${r.success ? '✅ منتشر شد' : '❌ خطا'}
   اسلاگ: ${r.slug}
   ${r.success ? `آی‌دی: ${r.id}` : `خطا: ${r.error}`}
   لینک: ${BACKEND_URL}/api/articles/${r.slug}
`).join('\n')}

🔍 تأیید نهایی:
   تعداد کل مقالات در دیتابیس: ${summary.verification.totalArticles}
   اسلاگ‌های موجود: ${summary.verification.slugs.join(', ')}

═══════════════════════════════════════════════════════════════
`;

    fs.writeFileSync(summaryPath, summaryText, 'utf-8');
    console.log(`📄 Summary saved to: ${summaryPath}`);
    
    console.log('\n✅ All done!');
    process.exit(0);

  } catch (error) {
    console.error(`\n❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
}

main();
