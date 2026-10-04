# گزارش تحلیل معماری پروژه Radif-ECU

**تاریخ تحلیل:** 3 اکتبر 2026  
**نوع تحلیل:** Read-Only Architecture Analysis  
**هدف:** بررسی امکان استقرار Backend روی Ubuntu VPS با توجه به مشکل فیلترینگ IP از طرف ایرانسل

---

## ۱. معماری فعلی پروژه

پروژه Radif-ECU یک وب‌اپلیکیشن سه‌لایه است با معماری زیر:

### لایه‌های سیستم:

1. **Frontend:** Next.js 14 با App Router (React Server Components + Client Components)
2. **Backend:** Node.js + Express.js (RESTful API)
3. **Database:** MongoDB Atlas (Cloud-hosted)

### وضعیت فعلی استقرار:

- ✅ **Frontend:** در حال حاضر روی **Vercel** مستقر است
- ❓ **Backend:** هنوز مشخص نیست - قرار است روی **Ubuntu VPS** مستقر شود
- ✅ **Database:** روی **MongoDB Atlas** (cloud) مستقر است

---

## ۲. نحوه ارتباط Next.js و Express

### 🔴 مشکل اصلی: دو مکانیزم API Call موجود است

پروژه از **دو مکانیزم مختلف** برای ارتباط با Backend استفاده می‌کند:

#### **مکانیزم A: Client-side API Calls** (مشکل‌ساز)

**فایل:** `src/lib/api.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
```

**ویژگی‌ها:**
- `NEXT_PUBLIC_API_URL` یک متغیر محیطی **Client-exposed** است
- مقدار این متغیر در زمان **Build** به داخل JavaScript Bundle تزریق می‌شود
- تمام درخواست‌ها از **مرورگر کاربر مستقیماً** به Backend ارسال می‌شوند

**کامپوننت‌های استفاده‌کننده از این مکانیزم:**

| کامپوننت | فایل | نوع | عملکرد |
|---------|------|-----|--------|
| LatestArticlesSection | `src/components/home/LatestArticlesSection.tsx` | Client | دریافت ۳ مقاله آخر برای صفحه اصلی |
| WikiList | `src/components/wiki/WikiList.tsx` | Client | لیست تمام مقالات دانشنامه |
| ContactForm | `src/components/contact/ContactForm.tsx` | Client | ارسال فرم تماس با ما |
| BookingForm | `src/components/booking/BookingForm.tsx` | Client | رزرو نوبت |
| AuthContext | `src/context/AuthContext.tsx` | Client | Login/Logout/CheckAuth |
| AdminDashboard | `src/app/admin/page.tsx` | Client | دریافت آمار و نوبت‌ها |

**جریان درخواست:**

```
User Browser  →  Backend API (مستقیم)  →  MongoDB Atlas
```

---

#### **مکانیزم B: Server-side API Calls**

**کامپوننت‌های استفاده‌کننده:**

| کامپوننت | فایل | نوع | عملکرد |
|---------|------|-----|--------|
| WikiArticlePage | `src/app/wiki/[slug]/page.tsx` | Server | دریافت محتوای مقاله (SSR/ISR) |
| Sitemap | `src/app/sitemap.ts` | Server | تولید sitemap.xml |

**کد نمونه:**

```typescript
const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const response = await fetch(`${API_URL}/articles/${slug}`, {
  next: { revalidate: 3600 }
});
```

**جریان درخواست:**

```
User Browser  →  Vercel (Next.js Server)  →  Backend API  →  MongoDB Atlas
```

---

### ۲.۳ وضعیت Rewrites در next.config.js

**فایل:** `next.config.js`

```javascript
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'http://localhost:5000';

async rewrites() {
  return [{ 
    source: '/api/:path*', 
    destination: `${BACKEND_ORIGIN}/api/:path*` 
  }];
}
```

### ⚠️ مشکل کلیدی: Rewrite استفاده نمی‌شود!

**دلیل:**
- `api.ts` از `NEXT_PUBLIC_API_URL` استفاده می‌کند که مستقیماً به Backend اشاره می‌کند
- بنابراین **هیچ‌وقت** درخواستی به `/api` ارسال نمی‌شود
- مکانیزم Rewrite موجود است اما **Bypass** می‌شود

**مثال:**
- اگر `NEXT_PUBLIC_API_URL=https://api.radif-ecu.ir/api`
- مرورگر مستقیماً به `api.radif-ecu.ir` درخواست می‌فرستد
- **نه** از طریق `radif-ecu.ir/api`

---

## ۳. نحوه اتصال MongoDB Atlas

### محل اتصال:
**فقط Backend** به MongoDB متصل می‌شود.

**فایل:** `backend/config/db.js`

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};
```

### ویژگی‌ها:
- ✅ Frontend **هیچ دسترسی مستقیمی** به MongoDB ندارد
- ✅ تمام عملیات دیتابیس از طریق Backend API انجام می‌شود
- ✅ MongoDB Atlas یک سرویس Cloud است و مشکل IP فیلترشده ندارد
- ✅ Connection Pool به صورت صحیح از طریق Mongoose مدیریت می‌شود

**جریان دسترسی به دیتا:**

```
Frontend  →  Backend  →  MongoDB Atlas
```

---

## ۴. محل اجرای هر بخش

| بخش | محل فعلی | محل پیشنهادی | دسترسی کاربران ایرانسل |
|-----|----------|--------------|------------------------|
| **Next.js Frontend** | ✅ Vercel | ✅ Vercel (بدون تغییر) | ✅ قابل دسترسی |
| **Express Backend** | ❓ مشخص نیست | 🔸 VPS یا Cloud Service | ⚠️ بستگی به معماری |
| **MongoDB Atlas** | ✅ Cloud | ✅ Cloud (بدون تغییر) | N/A (فقط Backend متصل می‌شود) |

---

## ۵. وضعیت Client-side / Server-side API Calls (جدول کامل)

| نام Component/Page | مسیر | نوع | API Call از کجا؟ | API Endpoint |
|-------------------|------|-----|------------------|--------------|
| Home Page (Articles) | `/` | Client | Browser → Backend | `GET /api/articles?limit=3` |
| Wiki List | `/wiki` | Client | Browser → Backend | `GET /api/articles` |
| Wiki Article Detail | `/wiki/[slug]` | Server | Vercel → Backend | `GET /api/articles/:slug` |
| Sitemap | `/sitemap.xml` | Server | Vercel → Backend | `GET /api/articles` |
| Contact Form | `/contact` | Client | Browser → Backend | `POST /api/contact` |
| Booking Form | `/booking` | Client | Browser → Backend | `POST /api/appointments` |
| Login | `/auth` | Client | Browser → Backend | `POST /api/auth/login` |
| Admin Dashboard | `/admin` | Client | Browser → Backend | `GET /api/appointments`, `GET /api/articles/admin/all` |
| Admin Pages | `/admin/*` | Client | Browser → Backend | متعدد |

### نتیجه‌گیری:
- **~90% از APIها:** Client-side (از مرورگر کاربر)
- **~10% از APIها:** Server-side (از سرورهای Vercel)

---

## ۶. تأثیر IP فیلترشده VPS روی کاربران ایرانسل

### 🔴 سناریو فعلی: اگر Backend روی VPS با IP فیلترشده قرار بگیرد

#### ❌ مشکلات:

1. **صفحه اصلی (Home):**
   - LatestArticlesSection کار نمی‌کند
   - به جای مقالات، Skeleton Loading یا خطا نمایش داده می‌شود

2. **دانشنامه (/wiki):**
   - صفحه لیست مقالات باز نمی‌شود
   - خطای "Network Error" یا "خطا در دریافت مقالات"

3. **صفحه تماس (/contact):**
   - فرم تماس ارسال نمی‌شود
   - خطای "Failed to fetch"

4. **رزرو نوبت (/booking):**
   - دکمه "ثبت نوبت" کار نمی‌کند
   - کاربر نمی‌تواند نوبت بگیرد

5. **ورود به پنل ادمین:**
   - Login ناموفق
   - دسترسی به Admin Dashboard غیرممکن

#### ✅ بخش‌هایی که کار می‌کنند:

1. **صفحات استاتیک:**
   - صفحه اصلی بدون بخش مقالات
   - صفحات `/remap`, `/repair-ecu` به صورت کامل

2. **صفحه مقاله خاص (/wiki/[slug]):**
   - **فقط اگر قبلاً Cache شده باشد** (ISR با revalidate: 3600)
   - اولین بار که کاربر از ایرانسل وارد می‌شود، Vercel سعی می‌کند به VPS متصل شود
   - اگر VPS از ایرانسل فیلتر باشد، Vercel (که در US/EU است) **می‌تواند** به VPS متصل شود
   - پس این صفحات **احتمالاً کار می‌کنند**

3. **Sitemap:**
   - sitemap.xml کار می‌کند چون از سرورهای Vercel به VPS درخواست می‌فرستد

### 📊 درصد خرابی:

- **90% از عملکرد سایت** برای کاربران ایرانسل خراب می‌شود
- **تنها 10%** (SSR pages + static pages) کار می‌کنند

### جریان فعلی (با VPS فیلترشده):

```
┌─────────────────┐
│ کاربر ایرانسل   │
└────────┬────────┘
         │
         │ ✅ HTTPS (OK)
         ▼
┌─────────────────┐
│  Vercel / HTML  │
└────────┬────────┘
         │
         │ ✅ Server-side API (OK) - Vercel → VPS
         │ ❌ Client-side API (FAIL) - Browser → VPS
         │
         ▼
┌─────────────────┐
│  Ubuntu VPS     │ ← ❌ IP Blocked from Irancell
│  (Backend API)  │
└────────┬────────┘
         │
         │ ✅ Always OK
         ▼
┌─────────────────┐
│ MongoDB Atlas   │
└─────────────────┘
```

---

## ۷. آیا Ubuntu VPS مناسب است؟

### بررسی سازگاری Backend با VPS:

#### ✅ ویژگی‌های مثبت:

1. **Stateless Backend:**
   - هیچ Session Store محلی وجود ندارد
   - استفاده از JWT برای Authentication
   - Cookies از طریق `httpOnly` و `secure` مدیریت می‌شوند

2. **بدون WebSocket/Socket.IO:**
   - تمام ارتباطات HTTP/HTTPS هستند
   - نیازی به Real-time connection نیست

3. **بدون Cron Jobs:**
   - هیچ Scheduled Task یا Background Job وجود ندارد
   - تمام عملیات Request-Response هستند

4. **بدون File Storage:**
   - فایل‌ها روی سرور ذخیره نمی‌شوند
   - تنها `downloadUrl` در دیتابیس ذخیره می‌شود

5. **CORS به درستی تنظیم شده:**
   ```javascript
   const allowedOrigins = [
     'http://localhost:3000',
     'https://radif-ecu.ir',
     'https://www.radif-ecu.ir',
     'https://radif-ecu.vercel.app',
     process.env.CLIENT_URL
   ].filter(Boolean);
   ```

6. **Production-Ready:**
   - استفاده از `helmet` برای Security Headers
   - استفاده از `express-rate-limit` برای جلوگیری از Abuse
   - استفاده از `express-mongo-sanitize` برای جلوگیری از NoSQL Injection

#### ⚠️ نکات قابل توجه:

1. **Port:**
   - پیش‌فرض: `5000`
   - باید مطمئن شوید Firewall آن را باز کرده باشید

2. **Environment Variables:**
   - `MONGO_URI`: باید به MongoDB Atlas متصل شود
   - `JWT_SECRET`: باید یک مقدار Strong تصادفی باشد
   - `COOKIE_SECURE`: باید `true` باشد اگر پشت HTTPS اجرا می‌شود
   - `NODE_ENV`: باید `production` باشد

3. **Process Management:**
   - توصیه می‌شود از **PM2** برای اجرای دائمی استفاده کنید
   - نیاز به Restart خودکار در صورت Crash

4. **Reverse Proxy:**
   - توصیه می‌شود از **Nginx** یا **Caddy** استفاده کنید
   - برای SSL/TLS Certificate (Let's Encrypt)

### نتیجه:
✅ **Backend از نظر فنی کاملاً برای VPS مناسب است**  
❌ **اما مشکل IP فیلترشده باعث می‌شود 90% سایت برای ایرانسل کار نکند**

---

## ۸. بهترین معماری پیشنهادی

### 🏆 **گزینه پیشنهادی: Option B - VPS + Vercel Proxy**

#### چرا این گزینه بهترین است؟

1. ✅ شما قبلاً یک VPS دارید → **هزینه اضافی ندارد**
2. ✅ مشکل ایرانسل **100% حل می‌شود**
3. ✅ کنترل کامل روی Backend
4. ✅ تنها **3 تغییر Environment Variable** لازم است

#### معماری پیشنهادی:

```
┌─────────────────┐
│ کاربر ایرانسل   │
└────────┬────────┘
         │
         │ HTTPS (radif-ecu.ir/api/*)
         ▼
┌─────────────────────────┐
│  Vercel (Next.js)       │
│                         │
│  Rewrite:               │
│  /api/* → VPS:5000/api  │
└────────┬────────────────┘
         │
         │ Server-to-Server (Vercel → VPS)
         │ ✅ IP فیلترنشده (Vercel در US/EU)
         ▼
┌─────────────────┐
│  Ubuntu VPS     │
│  Express.js API │
└────────┬────────┘
         │
         │ ✅ Always OK
         ▼
┌─────────────────┐
│ MongoDB Atlas   │
└─────────────────┘
```

#### چگونه کار می‌کند؟

1. **کاربر درخواست API می‌فرستد:**
   - قبل: `https://YOUR_VPS_IP:5000/api/articles`
   - بعد: `https://radif-ecu.ir/api/articles`

2. **Vercel درخواست را Proxy می‌کند:**
   - Next.js Rewrite: `/api/*` → `http://YOUR_VPS_IP:5000/api/*`

3. **VPS پاسخ را به Vercel می‌فرستد**

4. **Vercel پاسخ را به کاربر برمی‌گرداند**

#### مزایا:

- ✅ کاربر فقط با Vercel صحبت می‌کند (IP فیلترنشده)
- ✅ Vercel با VPS صحبت می‌کند (از US/EU)
- ✅ Backend روی VPS می‌ماند (کنترل کامل)
- ✅ هزینه اضافی صفر

#### معایب:

- ⚠️ یک Hop اضافی (Latency اندکی بیشتر ~ 50-100ms)
- ⚠️ نیاز به تغییر چند متغیر محیطی

---

### گزینه جایگزین: Option C - Cloud Service (Render/Railway)

اگر نمی‌خواهید دردسر مدیریت VPS را داشته باشید:

#### Render (توصیه می‌شود):

- **Free Tier:**
  - ⚠️ بعد از 15 دقیقه Cold Start
  - ⚠️ ماهی 750 ساعت رایگان
  - ❌ برای سایت Production مناسب نیست

- **Paid Tier ($7/mo):**
  - ✅ بدون Cold Start
  - ✅ Auto-scaling
  - ✅ SSL رایگان
  - ✅ Zero maintenance

#### Railway:

- **$5/mo** برای شروع
- مشابه Render اما Interface بهتر

#### معماری:

```
User Browser  →  radif-ecu-api.onrender.com  →  MongoDB Atlas
```

تنها کافی است:
- Backend را روی Render deploy کنید
- `NEXT_PUBLIC_API_URL=https://radif-ecu-api.onrender.com/api` روی Vercel تنظیم کنید

---

## ۹. تغییرات لازم برای رسیدن به معماری پیشنهادی

### 🎯 برای Option B (VPS + Vercel Proxy):

#### تغییرات Environment Variables روی Vercel:

```bash
# ۱. تغییر NEXT_PUBLIC_API_URL
NEXT_PUBLIC_API_URL=/api

# ۲. تنظیم BACKEND_ORIGIN (Server-side only)
BACKEND_ORIGIN=http://YOUR_VPS_IP:5000

# ۳. تنظیم INTERNAL_API_URL (Server-side only)
INTERNAL_API_URL=http://YOUR_VPS_IP:5000/api
```

#### توضیحات:

1. **`NEXT_PUBLIC_API_URL=/api`:**
   - مرورگر کاربر به `https://radif-ecu.ir/api` درخواست می‌فرستد
   - Vercel آن را به VPS Proxy می‌کند

2. **`BACKEND_ORIGIN=http://YOUR_VPS_IP:5000`:**
   - برای `next.config.js` rewrites
   - فقط در Server-side استفاده می‌شود

3. **`INTERNAL_API_URL=http://YOUR_VPS_IP:5000/api`:**
   - برای SSR/ISR pages که مستقیماً از Vercel به VPS درخواست می‌فرستند

#### تغییرات Backend (روی VPS):

```bash
# backend/.env

# ۱. CORS باید Vercel را Allow کند (قبلاً موجود است)
CLIENT_URL=https://radif-ecu.ir

# ۲. Cookie Settings
COOKIE_SECURE=false  # چون بین Vercel و VPS HTTP است

# ۳. Trust Proxy
TRUST_PROXY=1  # چون Vercel یک proxy است

# ۴. MongoDB
MONGO_URI=mongodb+srv://...  # همان MongoDB Atlas

# ۵. Environment
NODE_ENV=production
```

#### ⚠️ نکته مهم درباره CORS:

در حال حاضر `backend/server.js` این خط را دارد:

```javascript
origin: function (origin, callback) {
  if (!origin) return callback(null, true);  // ✅ این خط مهم است
  // ...
}
```

وقتی Vercel درخواست را Proxy می‌کند، ممکن است `origin` خالی باشد یا `https://radif-ecu.ir` باشد.  
**خوشبختانه کد فعلی این حالت را Handle می‌کند.**

#### تغییرات در کد (اختیاری):

**هیچ تغییری در کد لازم نیست!** فقط Environment Variables کافی است.

اما برای اطمینان، می‌توانید `next.config.js` را چک کنید:

```javascript
// این قبلاً موجود است و کار می‌کند ✅
async rewrites() {
  return [{ 
    source: '/api/:path*', 
    destination: `${BACKEND_ORIGIN}/api/:path*` 
  }];
}
```

#### اجرای Backend روی VPS:

```bash
# ۱. نصب dependencies
cd backend
npm install --production

# ۲. نصب PM2 (Process Manager)
npm install -g pm2

# ۳. اجرا با PM2
pm2 start server.js --name radif-ecu-api

# ۴. ذخیره برای Restart خودکار
pm2 save
pm2 startup

# ۵. چک کردن
pm2 status
pm2 logs
```

#### (اختیاری) نصب Nginx برای SSL:

اگر می‌خواهید Backend روی HTTPS اجرا شود:

```nginx
server {
    listen 443 ssl;
    server_name api.radif-ecu.ir;

    ssl_certificate /etc/letsencrypt/live/api.radif-ecu.ir/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.radif-ecu.ir/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**اما برای Option B این اختیاری است** چون Vercel با VPS از طریق IP داخلی ارتباط برقرار می‌کند.

---

### 🎯 برای Option C (Render/Railway):

#### مراحل Deployment روی Render:

1. **ایجاد Web Service:**
   - به [render.com](https://render.com) بروید
   - "New +" → "Web Service"
   - Repository GitHub خود را وصل کنید

2. **تنظیمات:**
   - **Name:** `radif-ecu-api`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Starter ($7/mo)

3. **Environment Variables:**
   ```bash
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your-strong-secret
   COOKIE_SECURE=true
   NODE_ENV=production
   CLIENT_URL=https://radif-ecu.ir
   TRUST_PROXY=1
   ```

4. **Deploy:**
   - روی "Create Web Service" کلیک کنید
   - Render به صورت خودکار deploy می‌کند
   - URL نهایی: `https://radif-ecu-api.onrender.com`

5. **تنظیم Vercel:**
   ```bash
   NEXT_PUBLIC_API_URL=https://radif-ecu-api.onrender.com/api
   ```

6. **Rebuild Vercel:**
   - به Vercel Dashboard بروید
   - "Deployments" → "Redeploy"

#### مزایا:
- ✅ Zero maintenance
- ✅ Auto SSL
- ✅ Auto scaling
- ✅ صفر مشکل IP

#### معایب:
- ❌ هزینه ماهانه ~$7

---

## ۱۰. فایل‌هایی که باید تغییر کنند

### برای Option B (VPS + Proxy):

#### فایل‌های Vercel (Environment Variables - نیاز به Redeploy):

```
تنها تغییر Environment Variables در Vercel Dashboard:
- NEXT_PUBLIC_API_URL=/api
- BACKEND_ORIGIN=http://YOUR_VPS_IP:5000
- INTERNAL_API_URL=http://YOUR_VPS_IP:5000/api
```

#### فایل‌های Backend (روی VPS):

```bash
backend/.env (ایجاد یا ویرایش):
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
COOKIE_SECURE=false
NODE_ENV=production
CLIENT_URL=https://radif-ecu.ir
TRUST_PROXY=1
```

### ⚠️ نکته مهم:

**هیچ کد یا فایل پروژه نیاز به تغییر ندارد!**

- ✅ `next.config.js` قبلاً rewrite دارد
- ✅ `src/lib/api.ts` از `NEXT_PUBLIC_API_URL` استفاده می‌کند
- ✅ `backend/server.js` CORS را درست تنظیم کرده
- ✅ فقط Environment Variables نیاز به تغییر دارند

---

## دیاگرام معماری فعلی

```
┌────────────────────────────────────────────────────────────────┐
│                      CURRENT ARCHITECTURE                       │
│                        (PROBLEMATIC)                            │
└────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  User (Browser) │
│  ایرانسل ❌     │
└────────┬────────┘
         │
         ├─────────────┬─────────────────────────┐
         │             │                         │
         │ ✅ HTML     │ ❌ API Calls            │ ✅ Images/CSS
         │             │ (Client-side)           │
         ▼             ▼                         ▼
┌─────────────────────────────────────────────────┐
│              Vercel (Next.js)                   │
│                                                 │
│  • Server Components ✅                         │
│  • Static Pages ✅                              │
│  • Rewrites موجود است (اما استفاده نمی‌شود)  │
└─────────────────────────────────────────────────┘
         │
         │ ❌ Direct from Browser (90% of API calls)
         │    این مسیر از ایرانسل Block می‌شود
         ▼
┌─────────────────┐
│   Ubuntu VPS    │ ← ❌ IP فیلترشده از ایرانسل
│   Express API   │
│   Port: 5000    │
└────────┬────────┘
         │
         │ ✅ همیشه OK
         ▼
┌─────────────────┐
│ MongoDB Atlas   │
│  (Cloud - US)   │
└─────────────────┘

🔴 مشکل: کاربران ایرانسل نمی‌توانند به VPS دسترسی داشته باشند
    → 90% از سایت برایشان کار نمی‌کند
```

---

## دیاگرام معماری پیشنهادی

### Option B: VPS + Vercel Proxy (توصیه می‌شود)

```
┌────────────────────────────────────────────────────────────────┐
│                    RECOMMENDED ARCHITECTURE                     │
│                   VPS + Vercel Proxy (Option B)                 │
└────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  User (Browser) │
│  ایرانسل ✅     │
└────────┬────────┘
         │
         │ ✅ HTTPS به radif-ecu.ir/api
         │    (کاربر فقط با Vercel صحبت می‌کند)
         ▼
┌──────────────────────────────────────────────────┐
│               Vercel (Next.js)                   │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │  Rewrite Configuration:                │    │
│  │  /api/* → http://VPS_IP:5000/api/*    │    │
│  └────────────────────────────────────────┘    │
│                                                  │
│  • Client Components: API calls → /api/*       │
│  • Server Components: SSR/ISR                   │
│  • Static Assets: Images, CSS, etc.            │
└─────────────────┬────────────────────────────────┘
                  │
                  │ ✅ Server-to-Server
                  │    (Vercel در US/EU → VPS)
                  │    این مسیر فیلتر نیست
                  ▼
         ┌─────────────────┐
         │   Ubuntu VPS    │
         │   Express API   │
         │   Port: 5000    │
         │                 │
         │  CORS Origin:   │
         │  radif-ecu.ir   │
         └────────┬────────┘
                  │
                  │ ✅ همیشه OK (Cloud to Cloud)
                  ▼
         ┌─────────────────┐
         │ MongoDB Atlas   │
         │  (Cloud - US)   │
         └─────────────────┘

✅ حل مشکل: کاربر با Vercel صحبت می‌کند → Vercel با VPS صحبت می‌کند
   → IP فیلترشده مشکلی ایجاد نمی‌کند
```

### تغییرات Environment Variables:

```
Vercel:
  NEXT_PUBLIC_API_URL=/api                    ← تغییر اصلی
  BACKEND_ORIGIN=http://VPS_IP:5000          ← برای rewrites
  INTERNAL_API_URL=http://VPS_IP:5000/api    ← برای SSR

VPS:
  CLIENT_URL=https://radif-ecu.ir
  COOKIE_SECURE=false
  TRUST_PROXY=1
```

---

### Option C: Cloud Service (جایگزین)

```
┌────────────────────────────────────────────────────────────────┐
│                    ALTERNATIVE ARCHITECTURE                     │
│                  Cloud Backend (Render/Railway)                 │
└────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  User (Browser) │
│  ایرانسل ✅     │
└────────┬────────┘
         │
         ├────────────────┬──────────────────────┐
         │                │                      │
         │ HTML/JS/CSS    │ API Calls            │ Assets
         ▼                ▼                      ▼
┌─────────────────┐  ┌──────────────────────┐  
│ Vercel          │  │ Render.com           │  ✅ No IP issues
│ (Next.js)       │  │ Express API          │  ✅ Auto SSL
│                 │  │                      │  ✅ Auto scaling
│ Server + Client │  │ radif-ecu-api        │  
│ Components      │  │ .onrender.com        │  💰 $7/mo
└─────────────────┘  └──────────┬───────────┘
                                │
                                │ ✅ Cloud to Cloud
                                ▼
                     ┌─────────────────┐
                     │ MongoDB Atlas   │
                     │  (Cloud - US)   │
                     └─────────────────┘

✅ مزایا: صفر مشکل، صفر نگهداری، IP آزاد
💰 معایب: ~$7/month هزینه
```

### تغییرات Environment Variables:

```
Vercel:
  NEXT_PUBLIC_API_URL=https://radif-ecu-api.onrender.com/api

Render:
  MONGO_URI=mongodb+srv://...
  JWT_SECRET=...
  COOKIE_SECURE=true
  NODE_ENV=production
  CLIENT_URL=https://radif-ecu.ir
```

---

## خلاصه و نتیجه‌گیری

### 🔍 یافته‌های کلیدی:

1. **معماری فعلی:** ~90% از API calls از سمت Client (مرورگر کاربر) هستند
2. **مشکل اصلی:** `NEXT_PUBLIC_API_URL` مستقیماً به Backend اشاره می‌کند
3. **Rewrite موجود است** اما استفاده نمی‌شود
4. **Backend:** کاملاً برای VPS مناسب است (Stateless, No WebSocket, No Cron)
5. **MongoDB:** Cloud-hosted و مشکلی ندارد

### 🎯 پاسخ به سؤال اصلی:

> آیا با معماری فعلی می‌توانم Backend را روی VPS نگه دارم؟

**پاسخ:**

- ❌ **با تنظیمات فعلی:** خیر - 90% سایت برای ایرانسل خراب می‌شود
- ✅ **با Option B (Proxy):** بله - با 3 تغییر env کاملاً کار می‌کند
- ✅ **با Option C (Cloud):** بله - با deploy روی Render کار می‌کند

### 🏆 توصیه نهایی:

**Option B (VPS + Vercel Proxy)** را انتخاب کنید چون:

1. ✅ هزینه صفر (VPS موجود است)
2. ✅ کنترل کامل روی Backend
3. ✅ مشکل ایرانسل 100% حل می‌شود
4. ✅ تنها 3 env variable نیاز به تغییر دارد
5. ✅ هیچ کد یا فایل نیاز به تغییر ندارد
6. ✅ Performance تقریباً مشابه (فقط یک Proxy hop اضافه)

### 📝 Checklist برای پیاده‌سازی Option B:

- [ ] Backend را روی VPS Deploy کنید
- [ ] فایل `backend/.env` را با مقادیر Production پر کنید
- [ ] Backend را با PM2 اجرا کنید
- [ ] Port 5000 را در Firewall باز کنید
- [ ] Environment Variables را در Vercel تنظیم کنید:
  - [ ] `NEXT_PUBLIC_API_URL=/api`
  - [ ] `BACKEND_ORIGIN=http://VPS_IP:5000`
  - [ ] `INTERNAL_API_URL=http://VPS_IP:5000/api`
- [ ] Frontend را در Vercel Redeploy کنید
- [ ] تست کنید:
  - [ ] صفحه اصلی → بخش مقالات
  - [ ] دانشنامه → لیست مقالات
  - [ ] فرم تماس → ارسال موفق
  - [ ] رزرو نوبت → ثبت موفق
  - [ ] Login ادمین → موفق

---

**تاریخ ایجاد گزارش:** 3 اکتبر 2026  
**تحلیل‌گر:** AI Architecture Analysis  
**وضعیت:** Read-Only Analysis - No Changes Made
