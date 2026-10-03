# طرح اجرای بهینه‌سازی SEO و Performance

## خلاصه وضعیت فعلی

**موارد انجام شده:**
- `app/layout.tsx` دارای metadata پایه با title template، description، openGraph و locale fa_IR
- `app/layout.tsx` دارای JSON-LD schema برای AutoRepair در head
- `app/page.tsx` فقط canonical دارد، بدون metadata کامل
- `app/wiki/[slug]/page.tsx` دارای metadata و JSON-LD schema Article کامل
- `app/remap/page.tsx` و `app/repair-ecu/page.tsx` دارای metadata پایه (title، description، canonical)
- `app/sitemap.ts` وجود دارد و از API مقالات می‌خواند (force-dynamic)
- `app/robots.ts` وجود دارد و sitemap را معرفی می‌کند
- `next.config.js` فقط rewrites دارد، بدون image optimization config
- فونت‌های YekanBakh self-hosted در `public/fonts/` با font-display: swap
- `src/lib/track.ts` برای GTM آماده است
- `src/components/analytics/Analytics.tsx` GTM را load می‌کند اگر NEXT_PUBLIC_GTM_ID تنظیم شود

**موارد ناقص:**
- صفحات client component (`contact`، `booking`، `wiki`) بدون metadata
- صفحه اصلی (`app/page.tsx`) بدون metadata و JSON-LD کامل
- صفحات service بدون JSON-LD schema
- `next.config.js` بدون image optimization config
- بدون bundle analyzer
- بدون progressive image loading strategy

---

## مراحل پیاده‌سازی

### ✅ مرحله 1: بهینه‌سازی metadata صفحه اصلی (Homepage)

**هدف:** اضافه کردن metadata کامل و LocalBusiness JSON-LD schema به صفحه اصلی

**فایل‌های تغییر:**
- `src/app/page.tsx`

**تغییرات:**
1. اضافه کردن export metadata کامل شامل:
   - title: 'ریمپ و تعمیر ECU خودرو در تهران | ردیف ایسیو'
   - description با ذکر خدمات اصلی (تعمیر ECU، ریمپ، مالتی‌پلکس، دیاگ)
   - keywords شامل: ECU، ریمپ، تعمیر ECU، دیاگ خودرو، مالتی‌پلکس، تهران، ردیف ایسیو
   - openGraph کامل (title، description، url، type: website، locale: fa_IR)
   - twitter card (summary_large_image)
   - alternates.canonical (از قبل موجود است)

2. اضافه کردن JSON-LD schema LocalBusiness در component:
   - @type: 'AutoRepair'
   - name، description، url، telephone از business config
   - address با فیلدهای کامل PostalAddress
   - openingHoursSpecification
   - priceRange: '$$' (اختیاری)
   - sameAs: [] (آرایه خالی — بعداً اگر شبکه‌های اجتماعی اضافه شد)
   - areaServed: { @type: 'City', name: business.city }
   - hasOfferCatalog با لیست خدمات اصلی (تعمیر ECU، ریمپ، مالتی‌پلکس)

**نکات پیاده‌سازی:**
- schema را در یک const تعریف و در JSX با dangerouslySetInnerHTML رندر کنیم
- از business config استفاده کنیم برای consistency
- telephone باید با فرمت بین‌المللی: `+98${business.phone.slice(1).replace(/-/g, '')}`

**تست:**
```bash
npm run dev
```
- بازدید از http://localhost:3000
- مشاهده source و بررسی وجود metadata و JSON-LD
- استفاده از Rich Results Test گوگل: https://search.google.com/test/rich-results
- بررسی با Lighthouse: `npm run build && npm run start` سپس Lighthouse در DevTools

---

### ✅ مرحله 2: اضافه کردن metadata به صفحه تماس (Contact)

**هدف:** اضافه کردن metadata به صفحه contact که الان client component است

**چالش:** صفحه contact یک 'use client' component است و نمی‌تواند مستقیماً metadata export کند.

**راه‌حل:** Pattern wrapper — تبدیل صفحه به server component و جداسازی client logic

**فایل‌های تغییر:**
- `src/app/contact/page.tsx` (تبدیل به server component با metadata)
- `src/components/contact/ContactForm.tsx` (ایجاد — client component جدید)

**تغییرات:**

1. ایجاد `src/components/contact/ContactForm.tsx`:
   - انتقال تمام محتوای فعلی `contact/page.tsx` (از 'use client' تا return) به این فایل
   - export default ContactForm

2. بازنویسی `src/app/contact/page.tsx`:
   - حذف 'use client'
   - اضافه کردن export metadata:
     - title: 'تماس با ما | مشاوره رایگان تعمیر و ریمپ ECU'
     - description: شامل آدرس، تلفن، ساعت کاری از business config
     - keywords: تماس، مشاوره، آدرس، تلفن
     - openGraph کامل
     - alternates.canonical: '/contact'
   - import ContactForm
   - return `<ContactForm />`

**نکات پیاده‌سازی:**
- اطمینان از این که هیچ breaking change در UI نداشته باشیم
- RTL layout باید دست‌نخورده بماند
- form submission و validation همان‌طور که هست کار کند

**تست:**
```bash
npm run dev
```
- بازدید از http://localhost:3000/contact
- مشاهده source و بررسی metadata
- پر کردن و ارسال فرم و اطمینان از کار کردن
- بررسی console برای خطاهای hydration

---

### ✅ مرحله 3: اضافه کردن metadata به صفحه رزرو نوبت (Booking)

**هدف:** اضافه کردن metadata به صفحه booking که الان client component است

**راه‌حل:** مشابه contact — wrapper pattern

**فایل‌های تغییر:**
- `src/app/booking/page.tsx` (تبدیل به server component با metadata)
- `src/components/booking/BookingForm.tsx` (ایجاد — client component جدید)

**تغییرات:**

1. ایجاد `src/components/booking/BookingForm.tsx`:
   - انتقال component BookingForm (شامل BookingPage wrapper با Suspense) به این فایل
   - export default BookingForm

2. بازنویسی `src/app/booking/page.tsx`:
   - حذف 'use client'
   - اضافه کردن export metadata:
     - title: 'رزرو نوبت آنلاین | تعمیر و ریمپ ECU'
     - description: 'رزرو نوبت آنلاین برای تعمیر ECU، ریمپ و دیاگ خودرو. انتخاب تاریخ و ساعت دلخواه.'
     - keywords: رزرو نوبت، نوبت آنلاین، تعمیر ECU، ریمپ
     - openGraph کامل
     - alternates.canonical: '/booking'
   - import BookingForm
   - return `<BookingForm />`

**نکات پیاده‌سازی:**
- Suspense wrapper باید در BookingForm component جدید باقی بماند
- useSearchParams و useRouter hooks در client component کار می‌کنند
- اطمینان از این که query param phone از URL به درستی خوانده می‌شود

**تست:**
```bash
npm run dev
```
- بازدید از http://localhost:3000/booking
- بازدید از http://localhost:3000/booking?phone=09123456789
- مشاهده source و بررسی metadata
- تست فرم: گذر از مرحله 1 به 2، برگشت به مرحله 1، ارسال فرم
- بررسی tracking code در success page

---

### ✅ مرحله 4: اضافه کردن metadata به لیست مقالات Wiki

**هدف:** اضافه کردن metadata به صفحه لیست wiki که الان client component است

**راه‌حل:** wrapper pattern

**فایل‌های تغییر:**
- `src/app/wiki/page.tsx` (تبدیل به server component با metadata)
- `src/components/wiki/WikiList.tsx` (ایجاد — client component جدید)

**تغییرات:**

1. ایجاد `src/components/wiki/WikiList.tsx`:
   - انتقال تمام محتوای فعلی `wiki/page.tsx` به این فایل
   - export default WikiList

2. بازنویسی `src/app/wiki/page.tsx`:
   - حذف 'use client'
   - اضافه کردن export metadata:
     - title: 'دانشنامه ECU | آموزش و مقالات تخصصی'
     - description: 'آموزش‌های تخصصی، نکات کاربردی و راهنمای کامل تعمیرات ECU، ریمپ، مالتی‌پلکس و دیاگ خودرو'
     - keywords: دانشنامه ECU، آموزش تعمیر ECU، مقالات خودرو
     - openGraph کامل
     - alternates.canonical: '/wiki'
   - import WikiList
   - return `<WikiList />`

**تست:**
```bash
npm run dev
```
- بازدید از http://localhost:3000/wiki
- مشاهده source و بررسی metadata
- تست جستجو در مقالات
- تست فیلتر دسته‌بندی
- کلیک روی مقاله و اطمینان از باز شدن

---

### ✅ مرحله 5: بهبود JSON-LD schema مقالات Wiki

**هدف:** تبدیل schema Article به TechArticle و اضافه کردن BreadcrumbList

**فایل تغییر:**
- `src/app/wiki/[slug]/page.tsx`

**تغییرات:**

1. تغییر articleSchema:
   - @type: 'TechArticle' (به جای 'Article') — مناسب‌تر برای مقالات فنی
   - اضافه کردن fields:
     - articleSection: article.category
     - wordCount: تقریبی از طول content (content.replace(/<[^>]*>/g, '').split(/\s+/).length)
     - inLanguage: 'fa'
   - بهبود author و publisher با اضافه کردن url: business.url

2. اضافه کردن BreadcrumbList schema:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "BreadcrumbList",
     "itemListElement": [
       { "@type": "ListItem", "position": 1, "name": "خانه", "item": "https://radif-ecu.ir" },
       { "@type": "ListItem", "position": 2, "name": "دانشنامه", "item": "https://radif-ecu.ir/wiki" },
       { "@type": "ListItem", "position": 3, "name": article.title }
     ]
   }
   ```

3. رندر هر دو schema در head:
   - articleSchema در یک script tag
   - breadcrumbSchema در یک script tag دیگر

**نکات پیاده‌سازی:**
- استفاده از business.url برای URL‌های absolute
- محاسبه wordCount به صورت approximate (برای performance)
- مطمئن شویم که نام فیلد value است نه expectedValue در BreadcrumbList

**تست:**
```bash
npm run dev
```
- بازدید از یک مقاله
- مشاهده source و بررسی JSON-LD schemas
- تست در Rich Results Test گوگل

---

### ✅ مرحله 6: اضافه کردن Service JSON-LD schema به صفحات خدمات

**هدف:** اضافه کردن Service schema به remap و repair-ecu pages

**فایل‌های تغییر:**
- `src/app/remap/page.tsx`
- `src/app/repair-ecu/page.tsx`

**تغییرات:**

هر دو صفحه الان از ServicePage component استفاده می‌کنند. دو راه‌حل:

**راه‌حل 1 (ساده‌تر):** اضافه کردن schema مستقیماً در هر page.tsx

1. در `remap/page.tsx`:
   - ایجاد remapServiceSchema:
     - @type: 'Service'
     - name: 'ریمپ ECU خودرو'
     - serviceType: 'ECU remapping'
     - provider: { @type: 'AutoRepair', name: business.name, url: business.url }
     - areaServed: { @type: 'City', name: business.city }
     - description
   - تبدیل component به async
   - return کردن `<> schema script + <ServicePage> </>`

2. مشابه در `repair-ecu/page.tsx` برای 'تعمیر ECU خودرو'

**راه‌حل 2 (بهتر):** اضافه کردن prop schema به ServicePage component

برای سادگی در این مرحله، راه‌حل 1 را پیاده می‌کنیم.

**نکات پیاده‌سازی:**
- استفاده از Fragment `<>` برای wrap کردن
- schema در بالای JSX قبل از ServicePage

**تست:**
```bash
npm run dev
```
- بازدید از /remap و /repair-ecu
- مشاهده source و بررسی Service schema
- تست در Rich Results Test گوگل

---

### ✅ مرحله 7: بهینه‌سازی next.config.js برای تصاویر و cache

**هدف:** اضافه کردن image optimization config و cache headers

**فایل تغییر:**
- `next.config.js`

**تغییرات:**

1. اضافه کردن images config:
   ```javascript
   images: {
     formats: ['image/avif', 'image/webp'],
     deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
     imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
     minimumCacheTTL: 60,
     remotePatterns: [
       // اگر در آینده از CDN استفاده شد
       // { protocol: 'https', hostname: 'cdn.example.com' }
     ],
   }
   ```

2. اضافه کردن async headers() برای cache:
   ```javascript
   async headers() {
     return [
       {
         source: '/fonts/:path*',
         headers: [
           { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
         ],
       },
       {
         source: '/images/:path*',
         headers: [
           { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
         ],
       },
     ];
   }
   ```

3. (اختیاری) اضافه کردن bundle analyzer:
   ```javascript
   // در بالای فایل:
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });
   // در پایان:
   module.exports = withBundleAnalyzer(nextConfig);
   ```
   اگر این را اضافه کنیم، باید `@next/bundle-analyzer` نصب شود.

**نکات پیاده‌سازی:**
- برای فونت‌ها immutable cache چون hash در نام فایل دارند
- remotePatterns خالی بماند چون همه تصاویر local هستند
- bundle analyzer فقط برای development است

**تست:**
```bash
npm run build
npm run start
```
- بررسی Network tab در DevTools برای cache headers
- بررسی اینکه تصاویر به webp/avif convert می‌شوند
- (اختیاری) `ANALYZE=true npm run build` برای bundle analysis

---

### ✅ مرحله 8: بهینه‌سازی sitemap.ts

**هدف:** بهبود sitemap برای شامل شدن همه صفحات و priority صحیح

**فایل تغییر:**
- `src/app/sitemap.ts`

**تغییرات:**

1. اضافه کردن صفحه booking به staticPages:
   ```javascript
   {
     url: `${SITE_URL}/booking`,
     changeFrequency: 'monthly',
     priority: 0.8,
   }
   ```

2. تنظیم revalidate به 86400 (24 ساعت) به جای 3600:
   - در fetch options: `next: { revalidate: 86400 }`
   - چون مقالات روزانه تغییر نمی‌کنند

3. اضافه کردن lastModified به صفحات static (اختیاری):
   - برای صفحه اصلی: lastModified: new Date()

4. بررسی error handling و fallback به staticPages

**نکات پیاده‌سازی:**
- مطمئن شویم که SITE_URL در production به درستی set شده
- priority: 1.0 فقط برای homepage
- changeFrequency realistic باشد (daily فقط برای صفحاتی که واقعاً روزانه update می‌شوند)

**تست:**
```bash
npm run dev
```
- بازدید از http://localhost:3000/sitemap.xml
- بررسی وجود همه صفحات
- بررسی فرمت XML و validity

---

### ✅ مرحله 9: بررسی و بهینه‌سازی robots.ts

**هدف:** اطمینان از صحت robots.txt و crawl directives

**فایل تغییر:**
- `src/app/robots.ts`

**تغییرات:**

1. بررسی disallow rules:
   - `/admin/` ✅
   - `/api/` ✅
   - اضافه کردن `/booking/success` و `/booking/track` اگر نباید index شوند
   - اضافه کردن `/auth/` اگر صفحات auth دارند

2. اضافه کردن Crawl-delay (اختیاری):
   ```javascript
   rules: [{
     userAgent: '*',
     allow: '/',
     disallow: ['/admin/', '/api/', '/auth/'],
     crawlDelay: 10, // اختیاری برای کاهش بار
   }]
   ```

3. بررسی sitemap URL:
   - مطمئن شویم SITE_URL در production درست است

**نکات پیاده‌سازی:**
- صفحات داخلی که نباید index شوند: /admin، /auth، /booking/success، /booking/track
- robots.txt باید در production در دسترس باشد: https://radif-ecu.ir/robots.txt

**تست:**
```bash
npm run dev
```
- بازدید از http://localhost:3000/robots.txt
- بررسی فرمت و directives

---

### ✅ مرحله 10: ایجاد .env.example برای frontend

**هدف:** مستندسازی environment variables مورد نیاز

**فایل ایجاد:**
- `.env.example` (در root پروژه)

**محتوا:**
```env
# ── Frontend Environment Variables ──

# Site URL (برای metadata، sitemap، og:url)
NEXT_PUBLIC_SITE_URL=https://radif-ecu.ir

# API URL برای client-side requests
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Google Tag Manager ID (برای تبلیغات و tracking)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Backend Origin برای rewrites در next.config.js (فقط در build time)
BACKEND_ORIGIN=http://localhost:5000

# Internal API URL برای server-side requests (sitemap، SSR)
INTERNAL_API_URL=http://backend:5000/api
```

**نکات:**
- این فایل را commit می‌کنیم (نه .env واقعی)
- تیم باید .env واقعی را بر اساس این بسازد

**تست:**
- فقط ایجاد فایل — نیازی به test خاصی نیست

---

### ✅ مرحله 11: اضافه کردن noindex به صفحات داخلی (auth، booking success)

**هدف:** جلوگیری از index شدن صفحات داخلی در گوگل

**فایل‌های تغییر:**
- `src/app/auth/login/page.tsx` (اگر وجود دارد)
- `src/app/booking/success/page.tsx` (اگر وجود دارد)
- `src/app/booking/track/page.tsx` (اگر وجود دارد)

**تغییرات:**

در هر یک از این صفحات، اضافه کردن metadata:
```typescript
export const metadata: Metadata = {
  title: 'عنوان صفحه',
  robots: {
    index: false,
    follow: false,
  },
};
```

**نکات:**
- صفحاتی که user data دارند نباید index شوند
- noindex، nofollow برای admin و auth

**تست:**
- مشاهده source و بررسی `<meta name="robots" content="noindex, nofollow">`

---

### ✅ مرحله 12: تست نهایی Performance و SEO

**هدف:** اطمینان از این که همه بهینه‌سازی‌ها کار می‌کنند

**مراحل تست:**

1. **Build Production:**
   ```bash
   npm run build
   npm run start
   ```

2. **Lighthouse Audit:**
   - باز کردن DevTools > Lighthouse
   - انتخاب Categories: Performance، Accessibility، Best Practices، SEO
   - Run audit برای صفحات:
     - / (homepage)
     - /contact
     - /booking
     - /wiki
     - /wiki/[یک-مقاله]
     - /remap
     - /repair-ecu

3. **Rich Results Test:**
   - https://search.google.com/test/rich-results
   - تست URL هر صفحه و بررسی schema validation

4. **Sitemap و Robots Test:**
   - بازدید از /sitemap.xml و بررسی همه URLs
   - بازدید از /robots.txt و بررسی directives

5. **Metadata بررسی:**
   - مشاهده source هر صفحه
   - بررسی وجود title، description، og tags، canonical
   - بررسی JSON-LD schemas

6. **Performance Metrics:**
   - بررسی اینکه:
     - FCP < 1.8s
     - LCP < 2.5s
     - CLS < 0.1
     - TTI < 3.8s

**معیارهای موفقیت:**
- Lighthouse SEO score > 95
- Lighthouse Performance score > 90 (در production build)
- همه Rich Results بدون error
- Sitemap شامل همه صفحات
- Robots.txt accessible و صحیح

**خروجی:**
- یک گزارش خلاصه از نتایج Lighthouse
- screenshot از Rich Results Test
- لیست مشکلات یافت شده (اگر وجود دارد)

---

## خلاصه فایل‌های تغییر و ایجاد

### فایل‌های تغییر:
1. `src/app/page.tsx` — اضافه کردن metadata و JSON-LD
2. `src/app/contact/page.tsx` — تبدیل به server component wrapper
3. `src/app/booking/page.tsx` — تبدیل به server component wrapper
4. `src/app/wiki/page.tsx` — تبدیل به server component wrapper
5. `src/app/wiki/[slug]/page.tsx` — بهبود JSON-LD با TechArticle و BreadcrumbList
6. `src/app/remap/page.tsx` — اضافه کردن Service schema
7. `src/app/repair-ecu/page.tsx` — اضافه کردن Service schema
8. `src/app/sitemap.ts` — اضافه کردن booking و بهبود revalidate
9. `src/app/robots.ts` — بررسی و بهبود disallow rules
10. `next.config.js` — اضافه کردن images config و headers
11. `src/app/auth/*/page.tsx` (اگر وجود دارد) — اضافه کردن noindex
12. `src/app/booking/success/page.tsx` (اگر وجود دارد) — اضافه کردن noindex

### فایل‌های ایجاد:
1. `src/components/contact/ContactForm.tsx` — client component جداشده
2. `src/components/booking/BookingForm.tsx` — client component جداشده
3. `src/components/wiki/WikiList.tsx` — client component جداشده
4. `.env.example` — مستندسازی environment variables

---

## ترتیب اولویت اجرا

**اولویت بالا (تأثیر مستقیم روی SEO):**
1. مرحله 1: Homepage metadata و JSON-LD
2. مرحله 5: بهبود Wiki article schemas
3. مرحله 6: Service schemas
4. مرحله 8: Sitemap optimization

**اولویت متوسط (تجربه کاربر و کامل‌بودن):**
5. مرحله 2: Contact metadata
6. مرحله 3: Booking metadata
7. مرحله 4: Wiki list metadata
8. مرحله 11: Noindex برای صفحات داخلی

**اولویت پایین (بهینه‌سازی فنی):**
9. مرحله 7: next.config.js optimization
10. مرحله 9: Robots.txt بررسی
11. مرحله 10: .env.example مستندسازی
12. مرحله 12: تست نهایی

---

## نکات مهم

### ⚠️ نکات امنیتی:
- هیچ اطلاعات محرمانه در metadata نگذارید
- business.email اگر placeholder است، در metadata نیاورید

### ⚠️ نکات RTL:
- همه تگ‌های metadata باید محتوای فارسی صحیح داشته باشند
- lang="fa" و dir="rtl" در layout.tsx موجود است
- og:locale باید fa_IR باشد

### ⚠️ نکات Performance:
- همه تصاویر باید از Next.js Image component استفاده کنند
- فونت‌ها self-hosted هستند با font-display: swap ✅
- GTM فقط اگر GTM_ID set شده باشد load می‌شود ✅

### ⚠️ نکات Schema:
- همه URLs در JSON-LD باید absolute باشند (با https://)
- telephone در فرمت بین‌المللی: +98...
- از business config برای consistency استفاده کنید

### ⚠️ نکات Deployment:
- NEXT_PUBLIC_SITE_URL باید در production روی https://radif-ecu.ir set شود
- INTERNAL_API_URL برای Docker: http://backend:5000/api
- بررسی کنید که sitemap و robots.txt در production accessible هستند

---

## انتظارات بعد از اجرا

**SEO:**
- Rich snippets در نتایج گوگل (نام، آدرس، تلفن، ساعت کاری)
- Article snippets برای مقالات با عکس، تاریخ، نویسنده
- Breadcrumbs در نتایج جستجو
- Service information در جستجوی محلی

**Performance:**
- Lighthouse Performance > 90
- Lighthouse SEO > 95
- FCP < 1.8s
- LCP < 2.5s

**User Experience:**
- بدون تغییر در رفتار سایت
- بدون breaking changes
- RTL layout دست‌نخورده
- فرم‌ها کار می‌کنند

---

## منابع مفید

- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Schema.org](https://schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [Web.dev Performance](https://web.dev/performance/)

